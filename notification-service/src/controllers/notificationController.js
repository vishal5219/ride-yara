const NotificationService = require('../services/notificationService');

// Notification Controller for Uber-like app
exports.sendNotification = async (req, res) => {
  // TODO: Implement send notification
  res.json({ message: 'Notification sent' });
};

exports.getNotifications = async (req, res) => {
  // TODO: Implement get notifications
  res.json({ message: 'List of notifications' });
};

exports.markAsRead = async (req, res) => {
  // TODO: Implement mark notification as read
  res.json({ message: 'Notification marked as read' });
}; 