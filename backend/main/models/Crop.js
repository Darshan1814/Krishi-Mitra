const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true
  },
  variety: {
    type: String,
    required: [true, 'Please provide crop variety']
  },
  category: {
    type: String,
    required: [true, 'Please provide crop category'],
    enum: ['cereals', 'pulses', 'oilseeds', 'cash_crops', 'vegetables', 'fruits', 'spices', 'fodder']
  },
  quantity: {
    value: {
      type: Number,
      required: [true, 'Please provide quantity']
    },
    unit: {
      type: String,
      required: [true, 'Please provide unit'],
      enum: ['kg', 'quintal', 'ton', 'bags', 'pieces']
    }
  },
  price: {
    value: {
      type: Number,
      required: [true, 'Please provide price']
    },
    unit: {
      type: String,
      required: [true, 'Please provide price unit'],
      enum: ['per_kg', 'per_quintal', 'per_ton', 'per_bag', 'per_piece']
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  videos: [{
    url: String,
    caption: String,
    thumbnail: String
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  harvestDate: {
    type: Date,
    required: [true, 'Please provide harvest date']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide expiry date']
  },
  location: {
    state: String,
    district: String,
    village: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  qualityGrade: {
    type: String,
    enum: ['premium', 'standard', 'basic'],
    default: 'standard'
  },
  organicCertified: {
    type: Boolean,
    default: false
  },
  certificates: [{
    name: String,
    url: String,
    issuer: String,
    validTill: Date
  }],
  soilType: String,
  farmingMethod: {
    type: String,
    enum: ['organic', 'conventional', 'natural'],
    default: 'conventional'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPreBooking: {
    type: Boolean,
    default: false
  },
  preBookingDate: Date,
  minimumOrder: {
    value: Number,
    unit: String
  },
  transportationAvailable: {
    type: Boolean,
    default: false
  },
  packagingDetails: {
    type: String,
    maxlength: 500
  },
  storageConditions: {
    type: String,
    maxlength: 500
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: [{
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search optimization
cropSchema.index({ name: 'text', variety: 'text', description: 'text' });
cropSchema.index({ 'location.state': 1, 'location.district': 1 });
cropSchema.index({ category: 1, isAvailable: 1 });
cropSchema.index({ farmer: 1, createdAt: -1 });

module.exports = mongoose.model('Crop', cropSchema);
