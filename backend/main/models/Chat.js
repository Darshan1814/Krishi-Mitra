const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['farmer', 'vendor', 'admin']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  chatType: {
    type: String,
    enum: ['direct', 'group', 'support'],
    default: 'direct'
  },
  relatedCrop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'location', 'system'],
      default: 'text'
    },
    attachments: [{
      type: String,
      url: String,
      size: Number,
      mimeType: String
    }],
    isRead: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editHistory: [{
      content: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }],
    reactions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      emoji: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    archivedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    tags: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    category: String
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSchema.index({ 'participants.user': 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });
chatSchema.index({ relatedCrop: 1 });
chatSchema.index({ relatedOrder: 1 });

module.exports = mongoose.model('Chat', chatSchema);
