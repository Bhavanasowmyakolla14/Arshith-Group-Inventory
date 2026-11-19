const { MongoClient } = require('mongodb');
const { store } = require('./dataStore');
const path = require('path');
const fs = require('fs');

class SyncEngine {
  /**
   * Universal Sync runner
   * @param {string} integrationKey - 'arshithfresh' | 'codelekho' | 'arshith_infotech'
   * @param {object} options - { syncType: 'FULL' | 'INCREMENTAL', entities: string[] }
   */
  async runSync(integrationKey, options = {}) {
    const syncType = options.syncType || 'FULL';
    const integrations = store.getCollection('integrations');
    const integration = integrations.find((i) => i.key === integrationKey);

    if (!integration) {
      throw new Error(`Integration "${integrationKey}" not found.`);
    }

    if (integrationKey === 'arshith_infotech') {
      throw new Error('Arshith Infotech integration is pending and cannot be synchronized.');
    }

    // Create a new sync job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const job = {
      id: jobId,
      integrationKey,
      sourceSystem: integrationKey,
      syncType,
      status: 'RUNNING',
      startTime: new Date().toISOString(),
      endTime: null,
      totalFetched: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errorDetails: null,
    };
    store.addItem('integration_sync_jobs', job);

    this._log(jobId, integrationKey, 'INFO', `Starting ${syncType} sync for ${integration.name}...`);

    try {
      let syncResult;
      if (integrationKey === 'arshithfresh') {
        syncResult = await this._syncArshithFresh(jobId, integration, syncType);
      } else if (integrationKey === 'codelekho') {
        syncResult = await this._syncCodeLekho(jobId, integration, syncType);
      } else {
        throw new Error(`Unsupported sync source: ${integrationKey}`);
      }

      const status = syncResult.failed > 0 && syncResult.created === 0 && syncResult.updated === 0
        ? 'FAILED'
        : syncResult.failed > 0
        ? 'COMPLETED_WITH_ERRORS'
        : 'COMPLETED';

      const endTime = new Date().toISOString();

      store.updateItem('integration_sync_jobs', jobId, {
        status,
        endTime,
        totalFetched: syncResult.totalFetched,
        created: syncResult.created,
        updated: syncResult.updated,
        skipped: syncResult.skipped,
        failed: syncResult.failed,
        errorDetails: syncResult.errors.length ? syncResult.errors.join('; ') : null,
      });

      // Update integration overall statistics
      const allSynced = store.getCollection('synced_records') || [];
      const currentCount = allSynced.filter((r) => r.sourceSystem === integrationKey).length;

      store.updateItem('integrations', integration.id, {
        status: status === 'FAILED' ? 'ERROR' : 'CONNECTED',
        lastSyncAt: endTime,
        lastSyncStatus: status,
        syncedRecordsCount: currentCount,
        stats: {
          ...integration.stats,
          ...syncResult.entityCounts,
        },
      });

      this._log(
        jobId,
        integrationKey,
        status === 'FAILED' ? 'ERROR' : 'SUCCESS',
        `${syncType} sync finished with status ${status}. Fetched: ${syncResult.totalFetched}, Created: ${syncResult.created}, Updated: ${syncResult.updated}, Skipped: ${syncResult.skipped}, Failed: ${syncResult.failed}.`
      );

      return {
        jobId,
        status,
        ...syncResult,
      };
    } catch (err) {
      const endTime = new Date().toISOString();
      store.updateItem('integration_sync_jobs', jobId, {
        status: 'FAILED',
        endTime,
        errorDetails: err.message,
      });

      store.updateItem('integrations', integration.id, {
        lastSyncAt: endTime,
        lastSyncStatus: 'FAILED',
      });

      this._log(jobId, integrationKey, 'ERROR', `Sync operation failed: ${err.message}`, { error: err.stack });
      throw err;
    }
  }

  // Helper logger
  _log(jobId, integrationKey, level, message, details = null) {
    const logItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      jobId,
      integrationKey,
      level,
      message,
      details,
      createdAt: new Date().toISOString(),
    };
    store.addItem('integration_sync_logs', logItem);
    return logItem;
  }

  /**
   * Upsert helper with composite uniqueness: sourceSystem:entityType:sourceRecordId
   */
  _upsertRecord(sourceSystem, entityType, sourceRecordId, recordData) {
    const compositeKey = `${sourceSystem}:${entityType}:${sourceRecordId}`;
    const syncedRecords = store.getCollection('synced_records');
    const existingIndex = syncedRecords.findIndex((r) => r.compositeKey === compositeKey);

    const now = new Date().toISOString();

    const normalized = {
      compositeKey,
      sourceSystem,
      entityType,
      sourceRecordId: String(sourceRecordId),
      name: recordData.name || recordData.title || `Record ${sourceRecordId}`,
      category: recordData.category || null,
      status: recordData.status || null,
      amount: recordData.amount !== undefined ? Number(recordData.amount) : null,
      recordDate: recordData.recordDate || now,
      rawPayload: recordData.rawPayload || recordData,
      syncTimestamp: now,
      sourceCreatedAt: recordData.sourceCreatedAt || now,
      sourceUpdatedAt: recordData.sourceUpdatedAt || now,
    };

    if (existingIndex !== -1) {
      // Check if data changed
      const old = syncedRecords[existingIndex];
      const hasChanged = JSON.stringify(old.rawPayload) !== JSON.stringify(normalized.rawPayload);

      if (!hasChanged) {
        return { status: 'SKIPPED', record: old };
      }

      syncedRecords[existingIndex] = {
        ...old,
        ...normalized,
        id: old.id,
        createdAt: old.createdAt,
        updatedAt: now,
      };
      store.save();
      return { status: 'UPDATED', record: syncedRecords[existingIndex] };
    } else {
      const newRec = {
        id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...normalized,
        createdAt: now,
        updatedAt: now,
      };
      syncedRecords.unshift(newRec);
      store.save();
      return { status: 'CREATED', record: newRec };
    }
  }

  /**
   * ArshithFresh Data Synchronizer (MongoDB Atlas -> Fallback to verified local store)
   */
  async _syncArshithFresh(jobId, integration, syncType) {
    let products = [];
    let orders = [];
    let users = [];
    let suppliers = [];
    let dataSource = 'MongoDB Atlas';

    const uri = integration.config?.mongoUri || process.env.ARSHITHFRESH_MONGO_URI || process.env.MONGO_URI;

    let client = null;
    let connectedToAtlas = false;

    if (uri) {
      try {
        client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 4000,
        });
        await client.connect();
        const db = client.db(integration.config.database || 'arshith_Fresh');

        const colls = (await db.listCollections().toArray()).map((c) => c.name);

        if (colls.includes('products')) products = await db.collection('products').find({}).toArray();
        if (colls.includes('orders')) orders = await db.collection('orders').find({}).toArray();
        if (colls.includes('users')) users = await db.collection('users').find({}).toArray();
        if (colls.includes('suppliers')) suppliers = await db.collection('suppliers').find({}).toArray();

        connectedToAtlas = true;
        this._log(jobId, 'arshithfresh', 'INFO', `Connected to MongoDB Atlas. Pulled live data (${products.length} products, ${orders.length} orders).`);
      } catch (err) {
        this._log(jobId, 'arshithfresh', 'WARN', `MongoDB Atlas connection attempt failed: ${err.message}. Checking local verified store...`);
      } finally {
        if (client) {
          try { await client.close(); } catch (_) {}
        }
      }
    }

    // Fallback to local verified store if Atlas was unreachable
    if (!connectedToAtlas) {
      const localStorePath = path.join(__dirname, '../../data/arshith_fresh_store.json');
      if (fs.existsSync(localStorePath)) {
        try {
          const localData = JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
          products = localData.products || [];
          orders = localData.orders || [];
          users = localData.users || [];
          suppliers = localData.suppliers || [];
          dataSource = 'Local Store Cache (arshith_fresh_store.json)';
          this._log(jobId, 'arshithfresh', 'INFO', `Synchronizing from verified local store (${products.length} products, ${orders.length} orders).`);
        } catch (readErr) {
          throw new Error(`Failed to read local ArshithFresh data: ${readErr.message}`);
        }
      } else {
        throw new Error('Unable to connect to MongoDB Atlas and no local store backup was found.');
      }
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    // 1. Sync Products
    for (const p of products) {
      try {
        const pId = p._id ? String(p._id) : String(p.id);
        const price = Number(p.price || p.regularPrice || (p.variants && p.variants[0]?.price) || 0);
        const stockQty = Number(p.stock !== undefined ? p.stock : (p.quantity || 0));
        const res = this._upsertRecord('arshithfresh', 'product', pId, {
          name: p.name || p.title || 'Product',
          category: p.category || p.categoryName || 'Organic Groceries',
          status: stockQty > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
          amount: price,
          recordDate: p.createdAt || p.updatedAt || new Date().toISOString(),
          rawPayload: p,
          sourceCreatedAt: p.createdAt,
          sourceUpdatedAt: p.updatedAt,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Product sync failed: ${e.message}`);
      }
    }

    // 2. Sync Orders
    for (const o of orders) {
      try {
        const oId = o._id ? String(o._id) : (o.orderNumber ? String(o.orderNumber) : String(o.id));
        const total = Number(o.totalAmount || o.finalAmount || o.total || 0);
        const res = this._upsertRecord('arshithfresh', 'order', oId, {
          name: `Order #${o.orderNumber || oId.slice(-6)}`,
          category: 'E-COMMERCE_ORDER',
          status: o.orderStatus || o.status || 'PENDING',
          amount: total,
          recordDate: o.createdAt || o.orderDate || new Date().toISOString(),
          rawPayload: o,
          sourceCreatedAt: o.createdAt,
          sourceUpdatedAt: o.updatedAt,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Order sync failed: ${e.message}`);
      }
    }

    // 3. Sync Customers
    for (const u of users) {
      try {
        const uId = u._id ? String(u._id) : String(u.id);
        const res = this._upsertRecord('arshithfresh', 'customer', uId, {
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Customer',
          category: 'CUSTOMER',
          status: u.isActive !== false ? 'ACTIVE' : 'INACTIVE',
          amount: null,
          recordDate: u.createdAt || new Date().toISOString(),
          rawPayload: u,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Customer sync failed: ${e.message}`);
      }
    }

    // 4. Sync Suppliers
    for (const s of suppliers) {
      try {
        const sId = s._id ? String(s._id) : String(s.id);
        const res = this._upsertRecord('arshithfresh', 'supplier', sId, {
          name: s.name || s.companyName || 'Supplier',
          category: 'SUPPLIER',
          status: s.status || 'ACTIVE',
          amount: null,
          recordDate: s.createdAt || new Date().toISOString(),
          rawPayload: s,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Supplier sync failed: ${e.message}`);
      }
    }

    const totalFetched = products.length + orders.length + users.length + suppliers.length;

    // Calculate total revenue from orders
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || o.finalAmount || o.total || 0), 0);

    return {
      totalFetched,
      created,
      updated,
      skipped,
      failed,
      errors,
      dataSource,
      entityCounts: {
        products: products.length,
        orders: orders.length,
        customers: users.length,
        suppliers: suppliers.length,
        totalRevenue,
      },
    };
  }

  /**
   * CodeLekho Data Synchronizer (Supabase PostgreSQL -> Fallback to verified local db.json)
   */
  async _syncCodeLekho(jobId, integration, syncType) {
    let learners = [];
    let courses = [];
    let certificates = [];
    let submissions = [];
    let dataSource = 'Supabase PostgreSQL';

    const url = (integration.config?.supabaseUrl || process.env.CODELEKHO_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const key = integration.config?.supabaseKey || process.env.CODELEKHO_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

    let connectedToSupabase = false;

    if (url && key) {
      try {
        const headers = { 
          apikey: key, 
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json' 
        };

        const res = await fetch(`${url}/rest/v1/app_state?select=key,data&limit=100`, {
          headers,
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const rows = await res.json();
          const state = Object.fromEntries(rows.map((r) => [r.key, r.data]));

          if (state.courses) courses = Array.isArray(state.courses) ? state.courses : Object.values(state.courses);
          if (state.certificates) certificates = Array.isArray(state.certificates) ? state.certificates : Object.values(state.certificates);
          if (state.projectSubmissions) submissions = Array.isArray(state.projectSubmissions) ? state.projectSubmissions : Object.values(state.projectSubmissions);

          try {
            const lRes = await fetch(`${url}/rest/v1/learners_view?select=*&limit=1000`, { headers, signal: AbortSignal.timeout(6000) });
            if (lRes.ok) {
              const lRows = await lRes.json();
              if (Array.isArray(lRows) && lRows.length > 0) {
                learners = lRows.map(r => ({ email: r.email, name: r.name, phone: r.phone, regNo: r.reg_no, learnerId: r.learner_id, ...r }));
              }
            }
          } catch (lErr) {}

          if (learners.length === 0 && state.learners) {
            learners = Array.isArray(state.learners)
              ? state.learners
              : Object.entries(state.learners).map(([email, val]) => ({ email, ...val }));
          }

          connectedToSupabase = true;
          this._log(jobId, 'codelekho', 'INFO', `Connected to Supabase PostgreSQL. Pulled ${courses.length} courses, ${learners.length} learners.`);
        }
      } catch (err) {
        this._log(jobId, 'codelekho', 'WARN', `Supabase connection attempt failed: ${err.message}. Checking local CodeLekho database store...`);
      }
    }

    // Fallback to local verified CodeLekho database store
    if (!connectedToSupabase) {
      const localDbPath = 'C:/Users/KRANTI/Downloads/ARSHITH-BOOT-CAMP--main/ARSHITH-BOOT-CAMP--main/server/data/db.json';
      if (fs.existsSync(localDbPath)) {
        try {
          const raw = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
          courses = raw.courses || [];
          if (raw.learners) {
            learners = Array.isArray(raw.learners)
              ? raw.learners
              : Object.entries(raw.learners).map(([email, val]) => ({ email, ...val }));
          }
          certificates = raw.certificates || [];
          submissions = raw.projectSubmissions || [];
          dataSource = 'Local Store (server/data/db.json)';
          this._log(jobId, 'codelekho', 'INFO', `Synchronizing from verified CodeLekho store (${courses.length} courses, ${learners.length} learners, ${certificates.length} certificates).`);
        } catch (readErr) {
          throw new Error(`Failed to read CodeLekho store: ${readErr.message}`);
        }
      } else {
        throw new Error('Supabase not configured and local CodeLekho store not found.');
      }
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    // 1. Sync Courses
    for (const c of courses) {
      try {
        const cId = String(c.id);
        const res = this._upsertRecord('codelekho', 'course', cId, {
          name: c.title || 'Course',
          category: 'ACADEMIC_COURSE',
          status: 'ACTIVE',
          amount: Number(c.price || 0),
          recordDate: new Date().toISOString(),
          rawPayload: c,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Course sync failed: ${e.message}`);
      }
    }

    // 2. Sync Learners / Students
    for (const l of learners) {
      try {
        const lId = l.learnerId || l.email || l.id;
        const res = this._upsertRecord('codelekho', 'learner', String(lId), {
          name: l.name || l.email || 'Learner',
          category: 'STUDENT_LEARNER',
          status: 'ENROLLED',
          amount: null,
          recordDate: l.joinedAt || l.createdAt || new Date().toISOString(),
          rawPayload: l,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Learner sync failed: ${e.message}`);
      }
    }

    // 3. Sync Certificates
    for (const cert of certificates) {
      try {
        const certId = String(cert.certificateId || cert.id);
        const res = this._upsertRecord('codelekho', 'certificate', certId, {
          name: `${cert.studentName || 'Student'} - ${cert.courseTitle || 'Course Certificate'}`,
          category: 'CERTIFICATION',
          status: cert.status || 'ISSUED',
          amount: null,
          recordDate: cert.issueDate || cert.createdAt || new Date().toISOString(),
          rawPayload: cert,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Certificate sync failed: ${e.message}`);
      }
    }

    // 4. Sync Project Submissions
    for (const sub of submissions) {
      try {
        const subId = String(sub.id || `${sub.studentEmail}_${sub.courseTitle}`);
        const res = this._upsertRecord('codelekho', 'submission', subId, {
          name: `${sub.studentName || 'Student'} - ${sub.projectTitle || 'Capstone'}`,
          category: 'PROJECT_SUBMISSION',
          status: sub.status || 'SUBMITTED',
          amount: null,
          recordDate: sub.submittedAt || new Date().toISOString(),
          rawPayload: sub,
        });
        if (res.status === 'CREATED') created++;
        else if (res.status === 'UPDATED') updated++;
        else skipped++;
      } catch (e) {
        failed++;
        errors.push(`Submission sync failed: ${e.message}`);
      }
    }

    const totalFetched = courses.length + learners.length + certificates.length + submissions.length;

    return {
      totalFetched,
      created,
      updated,
      skipped,
      failed,
      errors,
      dataSource,
      entityCounts: {
        courses: courses.length,
        learners: learners.length,
        certificates: certificates.length,
        submissions: submissions.length,
        totalRevenue: 0,
      },
    };
  }
}

const syncEngine = new SyncEngine();

module.exports = {
  syncEngine,
};

