const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  quantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  platformCommission: {
    farmer: {
      type: Number,
      default: 0
    },
    vendor: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  finalAmount: {
    farmerReceives: {
      type: Number,
      required: true
    },
    vendorPays: {
      type: Number,
      required: true
    }
  },
  orderType: {
    type: String,
    enum: ['immediate', 'prebooking'],
    default: 'immediate'
  },
  expectedDeliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: Date,
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['cash_on_delivery', 'online_payment', 'wallet'],
      default: 'cash_on_delivery'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: [
      'placed',
      'confirmed',
      'processing',
      'ready_for_pickup',
      'in_transit',
      'delivered',
      'cancelled',
      'refunded',
      'disputed'
    ],
    default: 'placed'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  transportationDetails: {
    method: {
      type: String,
      enum: ['farmer_pickup', 'vendor_pickup', 'third_party', 'platform_arranged']
    },
    cost: Number,
    provider: String,
    trackingId: String,
    driverDetails: {
      name: String,
      phone: String,
      vehicleNumber: String
    }
  },
  qualityCheck: {
    isRequired: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'passed', 'failed', 'not_required'],
      default: 'not_required'
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    checkedAt: Date,
    report: String,
    images: [String]
  },
  ratings: {
    farmerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    vendorRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  },
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  cancellationDetails: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  disputeDetails: {
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    description: String,
    evidence: [String],
    status: {
      type: String,
      enum: ['open', 'in_review', 'resolved', 'closed'],
      default: 'open'
    },
    resolution: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `KB${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for faster queries
orderSchema.index({ farmer: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
