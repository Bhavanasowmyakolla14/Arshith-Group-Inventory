const { store } = require('./dataStore');

class CentralAnalyticsService {
  /**
   * Get consolidated or company-filtered business overview
   * @param {string} company - 'all' | 'arshithfresh' | 'codelekho' | 'arshith_infotech'
   * @param {object} filters - { startDate, endDate }
   */
  getOverview(company = 'all', filters = {}) {
    const integrations = store.getCollection('integrations') || [];
    const syncedRecords = store.getCollection('synced_records') || [];
    const internalProjects = store.getCollection('projects') || [];
    const internalClients = store.getCollection('clients') || [];
    const syncJobs = store.getCollection('integration_sync_jobs') || [];

    // Filter synced records by company if not 'all'
    let records = syncedRecords;
    if (company && company !== 'all') {
      records = records.filter((r) => r.sourceSystem === company);
    }

    // Date filtering if provided
    if (filters.startDate) {
      records = records.filter((r) => new Date(r.recordDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      records = records.filter((r) => new Date(r.recordDate) <= new Date(filters.endDate));
    }

    // 1. ArshithFresh Metrics (strictly from synced records with sourceSystem === 'arshithfresh')
    const freshRecords = syncedRecords.filter((r) => r.sourceSystem === 'arshithfresh');
    const freshIntegration = integrations.find((i) => i.key === 'arshithfresh');
    const freshOrders = freshRecords.filter((r) => r.entityType === 'order');
    const freshProducts = freshRecords.filter((r) => r.entityType === 'product');
    const freshCustomers = freshRecords.filter((r) => r.entityType === 'customer');
    const freshSuppliers = freshRecords.filter((r) => r.entityType === 'supplier');
    const freshRevenue = freshOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    const freshSummary = {
      companyId: 'arshithfresh',
      companyName: 'ArshithFresh',
      industry: 'E-Commerce & Supply Chain',
      database: 'MongoDB Atlas',
      connectionStatus: freshIntegration?.status || 'DISCONNECTED',
      lastSyncAt: freshIntegration?.lastSyncAt || null,
      lastSyncStatus: freshIntegration?.lastSyncStatus || null,
      dataAvailable: freshRecords.length > 0,
      metrics: {
        totalRevenue: freshOrders.length > 0 ? freshRevenue : 0,
        totalOrders: freshOrders.length,
        deliveredOrders: freshOrders.filter((o) => o.status === 'DELIVERED').length,
        pendingOrders: freshOrders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length,
        totalProducts: freshProducts.length,
        inStockProducts: freshProducts.filter((p) => p.status === 'IN_STOCK').length,
        outOfStockProducts: freshProducts.filter((p) => p.status === 'OUT_OF_STOCK').length,
        totalCustomers: freshCustomers.length,
        totalSuppliers: freshSuppliers.length,
      },
    };

    // 2. CodeLekho Metrics (strictly from synced records with sourceSystem === 'codelekho')
    const lekhoRecords = syncedRecords.filter((r) => r.sourceSystem === 'codelekho');
    const lekhoIntegration = integrations.find((i) => i.key === 'codelekho');
    const lekhoCourses = lekhoRecords.filter((r) => r.entityType === 'course');
    const lekhoLearners = lekhoRecords.filter((r) => r.entityType === 'learner');
    const lekhoCertificates = lekhoRecords.filter((r) => r.entityType === 'certificate');
    const lekhoSubmissions = lekhoRecords.filter((r) => r.entityType === 'submission');
    const lekhoRevenue = lekhoCourses.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const lekhoSummary = {
      companyId: 'codelekho',
      companyName: 'CodeLekho',
      industry: 'Academic LMS & Bootcamps',
      database: 'Supabase (PostgreSQL)',
      connectionStatus: lekhoIntegration?.status || 'DISCONNECTED',
      lastSyncAt: lekhoIntegration?.lastSyncAt || null,
      lastSyncStatus: lekhoIntegration?.lastSyncStatus || null,
      dataAvailable: lekhoRecords.length > 0,
      metrics: {
        totalRevenue: lekhoRevenue,
        totalCourses: lekhoCourses.length,
        enrolledLearners: lekhoLearners.length,
        certificatesIssued: lekhoCertificates.length,
        projectSubmissions: lekhoSubmissions.length,
      },
    };

    // 3. Arshith Infotech Metrics (internal projects & client portfolio)
    const infotechIntegration = integrations.find((i) => i.key === 'arshith_infotech');
    const totalProposedBudget = internalProjects.reduce((s, p) => s + (Number(p.proposedBudget) || 0), 0);
    const totalReceived = internalProjects.reduce((s, p) => s + (Number(p.totalReceived) || 0), 0);

    const infotechSummary = {
      companyId: 'arshith_infotech',
      companyName: 'Arshith Infotech',
      industry: 'Bespoke Software & Client Delivery',
      database: 'External DB (Pending Integration)',
      connectionStatus: 'PENDING_INTEGRATION',
      lastSyncAt: null,
      lastSyncStatus: 'NOT_STARTED',
      dataAvailable: internalProjects.length > 0,
      metrics: {
        totalProjects: internalProjects.length,
        activeProjects: internalProjects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'ASSIGNED').length,
        completedProjects: internalProjects.filter((p) => p.status === 'COMPLETED' || p.status === 'DELIVERED').length,
        totalClients: internalClients.length,
        portfolioProposedBudget: totalProposedBudget,
        portfolioReceivedRevenue: totalReceived,
      },
    };

    // Consolidated Totals (Traceable and non-duplicated)
    const totalConsolidatedRevenue = freshSummary.metrics.totalRevenue + infotechSummary.metrics.portfolioReceivedRevenue;
    const totalTransactions = freshSummary.metrics.totalOrders + infotechSummary.metrics.totalProjects;
    const totalEntitiesCatalog = freshSummary.metrics.totalProducts + lekhoSummary.metrics.totalCourses + infotechSummary.metrics.totalProjects;
    const totalUsersBase = freshSummary.metrics.totalCustomers + lekhoSummary.metrics.enrolledLearners;

    // Monthly performance trend aggregation
    const monthlyMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group synced orders and projects into months
    freshOrders.forEach((o) => {
      const d = new Date(o.recordDate);
      if (!isNaN(d.getTime())) {
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyMap[key]) monthlyMap[key] = { month: key, freshRevenue: 0, infotechRevenue: 0, orderCount: 0 };
        monthlyMap[key].freshRevenue += Number(o.amount) || 0;
        monthlyMap[key].orderCount += 1;
      }
    });

    internalProjects.forEach((p) => {
      const d = new Date(p.actualStartDate || p.createdAt);
      if (!isNaN(d.getTime())) {
        const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
        if (!monthlyMap[key]) monthlyMap[key] = { month: key, freshRevenue: 0, infotechRevenue: 0, orderCount: 0 };
        monthlyMap[key].infotechRevenue += Number(p.totalReceived) || 0;
      }
    });

    const monthlyTrends = Object.values(monthlyMap).slice(-6);

    // Recent activity stream from real sync jobs
    const recentSyncActivity = syncJobs.slice(0, 10).map((j) => ({
      id: j.id,
      sourceSystem: j.sourceSystem,
      status: j.status,
      created: j.created,
      updated: j.updated,
      skipped: j.skipped,
      failed: j.failed,
      time: j.startTime,
    }));

    return {
      selectedCompany: company,
      consolidated: {
        totalRevenue: totalConsolidatedRevenue,
        totalTransactions,
        totalEntitiesCatalog,
        totalUsersBase,
        activeIntegrationsCount: integrations.filter((i) => i.status === 'CONNECTED').length,
        totalIntegrationsCount: integrations.length,
      },
      companies: {
        arshithfresh: freshSummary,
        codelekho: lekhoSummary,
        arshith_infotech: infotechSummary,
      },
      monthlyTrends,
      recentSyncActivity,
      dataFreshness: {
        lastUpdated: new Date().toISOString(),
        totalSyncedRecords: syncedRecords.length,
      },
    };
  }

  /**
   * Search / Filter synchronized records with pagination
   */
  getSyncedRecords(filters = {}) {
    const { sourceSystem, entityType, search, page = 1, limit = 25 } = filters;
    let records = store.getCollection('synced_records') || [];

    if (sourceSystem && sourceSystem !== 'ALL') {
      records = records.filter((r) => r.sourceSystem === sourceSystem);
    }

    if (entityType && entityType !== 'ALL') {
      records = records.filter((r) => r.entityType === entityType);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      records = records.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.sourceRecordId && r.sourceRecordId.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.compositeKey && r.compositeKey.toLowerCase().includes(q))
      );
    }

    const total = records.length;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;
    const data = records.slice(offset, offset + limitNum);

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  }
}

const centralAnalyticsService = new CentralAnalyticsService();

module.exports = {
  centralAnalyticsService,
};

