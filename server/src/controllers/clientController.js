const { store } = require('../services/dataStore');

const getClients = (req, res) => {
  try {
    const clients = store.getCollection('clients');
    const projects = store.getCollection('projects');

    const enriched = clients.map((c) => {
      const cliProjects = projects.filter((p) => p.clientId === c.id);
      return {
        ...c,
        totalProjects: cliProjects.length,
        totalContractValue: cliProjects.reduce((sum, p) => sum + (Number(p.approvedBudget) || 0), 0),
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      clients: enriched,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createClient = (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, address, industry, notes } = req.body;

    if (!companyName || !contactPerson || !email) {
      return res.status(400).json({ success: false, message: 'Company name, contact person and email are required' });
    }

    const clients = store.getCollection('clients');
    const clientId = `CLI-${String(clients.length + 1001).padStart(4, '0')}`;

    const newClient = store.addItem('clients', {
      clientId,
      companyName,
      contactPerson,
      email,
      phone: phone || '',
      address: address || '',
      industry: industry || '',
      notes: notes || '',
    });

    store.addItem('auditLogs', {
      entityType: 'CLIENT',
      entityId: newClient.id,
      action: 'CREATE',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { clientId, companyName },
    });

    return res.status(201).json({
      success: true,
      message: `Client ${companyName} created successfully`,
      client: newClient,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getClients, createClient };

