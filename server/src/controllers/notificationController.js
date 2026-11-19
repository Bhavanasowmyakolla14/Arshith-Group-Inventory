const { store } = require('../services/dataStore');

const getNotifications = (req, res) => {
  try {
    const notifications = store.getCollection('notifications');
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      notifications: notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateItem('notifications', id, { isRead: true });
    return res.json({ success: true, notification: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const markAllAsRead = (req, res) => {
  try {
    const notifications = store.getCollection('notifications');
    notifications.forEach((n) => {
      n.isRead = true;
    });
    store.save();
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };

