const { store } = require('../services/dataStore');

const getDocuments = (req, res) => {
  try {
    const { projectId, docType } = req.query;
    let documents = store.getCollection('documents');
    const projects = store.getCollection('projects');
    const users = store.getCollection('users');

    if (projectId) {
      documents = documents.filter((d) => d.projectId === projectId);
    }
    if (docType && docType !== 'ALL') {
      documents = documents.filter((d) => d.docType === docType);
    }

    const enriched = documents.map((d) => {
      const prj = projects.find((p) => p.id === d.projectId) || null;
      const uploader = users.find((u) => u.id === d.uploadedById) || null;
      return {
        ...d,
        project: prj ? { id: prj.id, projectId: prj.projectId, title: prj.title } : null,
        uploadedBy: uploader ? { id: uploader.id, name: uploader.name } : null,
      };
    });

    return res.json({
      success: true,
      count: enriched.length,
      documents: enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createDocument = (req, res) => {
  try {
    const { projectId, docType, title, fileName, fileUrl, fileSize, fileType, version = 'v1.0', description } = req.body;

    if (!projectId || !title || !docType) {
      return res.status(400).json({ success: false, message: 'Project ID, document type, and title are required' });
    }

    const newDoc = store.addItem('documents', {
      projectId,
      docType,
      title,
      fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
      fileUrl: fileUrl || `/uploads/documents/${fileName || 'document.pdf'}`,
      fileSize: fileSize || 1024000,
      fileType: fileType || 'application/pdf',
      version,
      uploadedById: req.user ? req.user.id : 'usr-001',
      description: description || '',
    });

    store.addItem('auditLogs', {
      entityType: 'DOCUMENT',
      entityId: newDoc.id,
      action: 'UPLOAD',
      performedById: req.user ? req.user.id : 'usr-001',
      changes: { title, docType, version },
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and logged successfully',
      document: newDoc,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDocuments, createDocument };

