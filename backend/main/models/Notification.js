const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'order_placed',
      'order_confirmed',
      'order_delivered',
      'order_cancelled',
      'payment_received',
      'payment_pending',
      'new_message',
      'crop_inquiry',
      'crop_sold',
      'kyc_approved',
      'kyc_rejected',
      'weather_alert',
      'rating_received',
      'system_update',
      'promotion',
      'reminder'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    additionalData: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  actionText: String,
  expiresAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
