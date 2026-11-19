const { MongoClient } = require('mongodb');
const { store } = require('./dataStore');
const path = require('path');
const fs = require('fs');

// Initial baseline integration configs
const DEFAULT_INTEGRATIONS = [
  {
    id: 'int-af-001',
    key: 'arshithfresh',
    name: 'ArshithFresh',
    subtitle: 'E-Commerce Platform',
    sourceType: 'MONGODB_ATLAS',
    databaseName: 'MongoDB Atlas (arshith_Fresh)',
    status: 'DISCONNECTED', // CONNECTED, DISCONNECTED, ERROR, PENDING_CONFIG
    description: 'Fresh organic groceries, cold-pressed oils & farm produce retail e-commerce platform',
    config: {
      mongoUri: process.env.ARSHITHFRESH_MONGO_URI || process.env.MONGO_URI || '',
      database: 'arshith_Fresh',
      timeoutMs: 5000,
    },
    lastTestAt: null,
    lastTestSuccess: false,
    lastTestMessage: 'Not tested yet',
    lastSyncAt: null,
    lastSyncStatus: null,
    stats: {
      products: 0,
      orders: 0,
      customers: 0,
      suppliers: 0,
      totalRevenue: 0,
    },
  },
  {
    id: 'int-clk-002',
    key: 'codelekho',
    name: 'CodeLekho',
    subtitle: 'Academic ERP & LMS',
    sourceType: 'SUPABASE_POSTGRES',
    databaseName: 'Supabase (PostgreSQL)',
    status: 'DISCONNECTED', // CONNECTED, DISCONNECTED, ERROR, PENDING_CONFIG
    description: 'Technical bootcamp, developer course certifications, student progress & academic operations',
    config: {
      supabaseUrl: process.env.CODELEKHO_SUPABASE_URL || process.env.SUPABASE_URL || '',
      supabaseKey: process.env.CODELEKHO_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '',
      timeoutMs: 5000,
    },
    lastTestAt: null,
    lastTestSuccess: false,
    lastTestMessage: 'Not tested yet',
    lastSyncAt: null,
    lastSyncStatus: null,
    stats: {
      learners: 0,
      courses: 0,
      certificates: 0,
      submissions: 0,
      totalRevenue: 0,
    },
  },
  {
    id: 'int-ait-003',
    key: 'arshith_infotech',
    name: 'Arshith Infotech',
    subtitle: 'Enterprise Software & Portfolio',
    sourceType: 'REST_API',
    databaseName: 'External Database (Not Configured)',
    status: 'PENDING_INTEGRATION', // Always pending integration placeholder
    description: 'Enterprise bespoke software engineering, IT client consulting & digital transformation services',
    config: {
      baseUrl: '',
      authType: 'BEARER_TOKEN',
      syncFrequency: 'MANUAL',
    },
    lastTestAt: null,
    lastTestSuccess: false,
    lastTestMessage: 'Integration Pending: Source database and API endpoints are not yet configured.',
    lastSyncAt: null,
    lastSyncStatus: 'NOT_STARTED',
    stats: {
      projects: 0,
      clients: 0,
      tasks: 0,
      totalRevenue: 0,
    },
  },
];

class IntegrationService {
  constructor() {
    this.init();
  }

  init() {
    const integrations = store.getCollection('integrations');
    if (!integrations || integrations.length === 0) {
      DEFAULT_INTEGRATIONS.forEach((item) => store.addItem('integrations', item));
    } else {
      // Ensure all 3 systems exist in store
      DEFAULT_INTEGRATIONS.forEach((def) => {
        const found = integrations.find((i) => i.key === def.key);
        if (!found) {
          store.addItem('integrations', def);
        }
      });
    }
  }

  getAll() {
    const integrations = store.getCollection('integrations');
    // Mask sensitive secrets before returning to client
    return integrations.map((int) => {
      const safeConfig = { ...(int.config || {}) };
      if (safeConfig.mongoUri) {
        safeConfig.mongoUriMasked = safeConfig.mongoUri.replace(/:([^@]+)@/, ':****@');
      }
      if (safeConfig.supabaseKey) {
        safeConfig.supabaseKeyMasked = safeConfig.supabaseKey.slice(0, 6) + '...' + safeConfig.supabaseKey.slice(-4);
      }
      // Calculate actual synced record count from synced_records
      const syncedRecords = store.getCollection('synced_records') || [];
      const count = syncedRecords.filter((r) => r.sourceSystem === int.key).length;

      return {
        ...int,
        config: safeConfig,
        syncedRecordsCount: count,
      };
    });
  }

  getByKey(key) {
    const integrations = store.getCollection('integrations');
    const item = integrations.find((i) => i.key === key);
    if (!item) return null;
    const safeConfig = { ...(item.config || {}) };
    if (safeConfig.mongoUri) {
      safeConfig.mongoUriMasked = safeConfig.mongoUri.replace(/:([^@]+)@/, ':****@');
    }
    if (safeConfig.supabaseKey) {
      safeConfig.supabaseKeyMasked = safeConfig.supabaseKey.slice(0, 6) + '...' + safeConfig.supabaseKey.slice(-4);
    }
    const syncedRecords = store.getCollection('synced_records') || [];
    const count = syncedRecords.filter((r) => r.sourceSystem === item.key).length;

    return {
      ...item,
      config: safeConfig,
      syncedRecordsCount: count,
    };
  }

  updateConfig(key, newConfig) {
    const integrations = store.getCollection('integrations');
    const existing = integrations.find((i) => i.key === key);
    if (!existing) {
      throw new Error(`Integration "${key}" not found.`);
    }

    if (key === 'arshith_infotech') {
      throw new Error('Arshith Infotech integration is pending and cannot be modified until APIs are provided.');
    }

    const mergedConfig = { ...existing.config, ...newConfig };
    const updated = store.updateItem('integrations', existing.id, {
      config: mergedConfig,
      lastTestAt: null,
      lastTestSuccess: false,
      lastTestMessage: 'Configuration updated. Connection test recommended.',
    });

    return updated;
  }

  /**
   * Real connection testing
   */
  async testConnection(key) {
    const integrations = store.getCollection('integrations');
    const item = integrations.find((i) => i.key === key);
    if (!item) {
      throw new Error(`Integration "${key}" not found.`);
    }

    const startTime = Date.now();

    if (key === 'arshith_infotech') {
      const msg = 'Integration Pending: Source database and API connection are not yet available for Arshith Infotech.';
      store.updateItem('integrations', item.id, {
        status: 'PENDING_INTEGRATION',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: false,
        lastTestMessage: msg,
      });
      return {
        success: false,
        status: 'PENDING_INTEGRATION',
        message: msg,
        latencyMs: Date.now() - startTime,
        details: {
          databaseStatus: 'Unavailable',
          apiStatus: 'Not Configured',
        },
      };
    }

    if (key === 'arshithfresh') {
      return await this._testArshithFresh(item);
    }

    if (key === 'codelekho') {
      return await this._testCodeLekho(item);
    }

    throw new Error(`Unsupported integration key: ${key}`);
  }

  async _testArshithFresh(item) {
    const startTime = Date.now();
    const uri = item.config?.mongoUri || process.env.ARSHITHFRESH_MONGO_URI || process.env.MONGO_URI;

    if (!uri) {
      const msg = 'Missing MongoDB Atlas Connection URI in configuration.';
      store.updateItem('integrations', item.id, {
        status: 'PENDING_CONFIG',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: false,
        lastTestMessage: msg,
      });
      return { success: false, status: 'PENDING_CONFIG', message: msg, latencyMs: Date.now() - startTime };
    }

    let client;
    try {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000,
      });

      await client.connect();
      const db = client.db(item.config.database || 'arshith_Fresh');
      const collections = await db.listCollections().toArray();
      const collNames = collections.map((c) => c.name);

      const [productCount, orderCount, userCount, supplierCount] = await Promise.all([
        collNames.includes('products') ? db.collection('products').countDocuments() : 0,
        collNames.includes('orders') ? db.collection('orders').countDocuments() : 0,
        collNames.includes('users') ? db.collection('users').countDocuments() : 0,
        collNames.includes('suppliers') ? db.collection('suppliers').countDocuments() : 0,
      ]);

      const latencyMs = Date.now() - startTime;
      const successMsg = `Successfully connected to MongoDB Atlas (${latencyMs}ms). Verified collections: ${collNames.length} available.`;

      store.updateItem('integrations', item.id, {
        status: 'CONNECTED',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: true,
        lastTestMessage: successMsg,
        stats: {
          ...item.stats,
          products: productCount,
          orders: orderCount,
          customers: userCount,
          suppliers: supplierCount,
        },
      });

      await client.close();

      return {
        success: true,
        status: 'CONNECTED',
        message: successMsg,
        latencyMs,
        details: {
          host: client.options?.hosts?.[0] || 'MongoDB Atlas Cluster',
          database: item.config.database || 'arshith_Fresh',
          collectionsFound: collNames,
          counts: {
            products: productCount,
            orders: orderCount,
            customers: userCount,
            suppliers: supplierCount,
          },
        },
      };
    } catch (err) {
      if (client) {
        try { await client.close(); } catch (_) {}
      }

      // Check if local store is present as fallback awareness
      const localStorePath = path.join(__dirname, '../../data/arshith_fresh_store.json');
      const hasLocalFallback = fs.existsSync(localStorePath);

      let fallbackInfo = '';
      if (hasLocalFallback) {
        try {
          const localData = JSON.parse(fs.readFileSync(localStorePath, 'utf8'));
          fallbackInfo = ` (Local offline cache available with ${localData.products?.length || 0} products, ${localData.orders?.length || 0} orders)`;
        } catch (_) {}
      }

      const errMsg = `Atlas Connection Failed: ${err.message}.${fallbackInfo}`;

      store.updateItem('integrations', item.id, {
        status: 'DISCONNECTED',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: false,
        lastTestMessage: errMsg,
      });

      return {
        success: false,
        status: 'DISCONNECTED',
        message: errMsg,
        latencyMs: Date.now() - startTime,
        error: err.message,
        details: {
          sourceDatabase: 'MongoDB Atlas',
          hasLocalFallback,
        },
      };
    }
  }

  async _testCodeLekho(item) {
    const startTime = Date.now();
    const url = (item.config?.supabaseUrl || process.env.CODELEKHO_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const key = item.config?.supabaseKey || process.env.CODELEKHO_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

    // Check if CodeLekho local db.json exists on machine
    const localDbPath = 'C:/Users/KRANTI/Downloads/ARSHITH-BOOT-CAMP--main/ARSHITH-BOOT-CAMP--main/server/data/db.json';
    const hasLocalStore = fs.existsSync(localDbPath);

    if (!url || !key) {
      const msg = hasLocalStore
        ? 'Supabase URL / Service Key not configured in .env. Local CodeLekho database store detected.'
        : 'Supabase URL / Service Key not configured. Please configure in settings.';

      store.updateItem('integrations', item.id, {
        status: 'PENDING_CONFIG',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: false,
        lastTestMessage: msg,
      });

      return {
        success: false,
        status: 'PENDING_CONFIG',
        message: msg,
        latencyMs: Date.now() - startTime,
        details: {
          hasLocalStore,
          note: 'Set CODELEKHO_SUPABASE_URL and CODELEKHO_SUPABASE_KEY to activate cloud sync.',
        },
      };
    }

    try {
      const headers = {
        apikey: key,
        'Content-Type': 'application/json',
      };
      headers.Authorization = `Bearer ${key}`;

      // Test Supabase rest/v1 endpoint
      const testRes = await fetch(`${url}/rest/v1/app_state?select=key&limit=5`, {
        headers,
        signal: AbortSignal.timeout(4000),
      });

      const latencyMs = Date.now() - startTime;

      if (!testRes.ok) {
        const bodyText = await testRes.text().catch(() => '');
        const errorMsg = `Supabase responded with HTTP ${testRes.status}: ${bodyText.slice(0, 150)}`;
        store.updateItem('integrations', item.id, {
          status: 'ERROR',
          lastTestAt: new Date().toISOString(),
          lastTestSuccess: false,
          lastTestMessage: errorMsg,
        });
        return {
          success: false,
          status: 'ERROR',
          message: errorMsg,
          latencyMs,
        };
      }

      const rows = await testRes.json();
      const keys = rows.map((r) => r.key);
      const successMsg = `Connected to CodeLekho Supabase (${latencyMs}ms). Available state keys: ${keys.join(', ') || 'Connected'}.`;

      store.updateItem('integrations', item.id, {
        status: 'CONNECTED',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: true,
        lastTestMessage: successMsg,
      });

      return {
        success: true,
        status: 'CONNECTED',
        message: successMsg,
        latencyMs,
        details: {
          endpoint: url,
          stateKeys: keys,
        },
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      const errMsg = `Supabase Connection Failed: ${err.message}.`;

      store.updateItem('integrations', item.id, {
        status: 'DISCONNECTED',
        lastTestAt: new Date().toISOString(),
        lastTestSuccess: false,
        lastTestMessage: errMsg,
      });

      return {
        success: false,
        status: 'DISCONNECTED',
        message: errMsg,
        latencyMs,
        error: err.message,
      };
    }
  }
}

const integrationService = new IntegrationService();

module.exports = {
  integrationService,
  DEFAULT_INTEGRATIONS,
};

