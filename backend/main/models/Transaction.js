const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  type: {
    type: String,
    enum: [
      'order_payment',
      'commission_deduction', 
      'wallet_credit',
      'wallet_debit',
      'refund',
      'withdrawal',
      'bonus',
      'penalty'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'upi', 'bank_transfer', 'cash', 'card', 'net_banking']
  },
  paymentGateway: {
    name: String,
    transactionId: String,
    response: mongoose.Schema.Types.Mixed
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    commissionRate: Number,
    originalAmount: Number,
    platformFee: Number,
    gstAmount: Number,
    additionalCharges: Number
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  invoice: {
    number: String,
    url: String
  },
  refundDetails: {
    reason: String,
    refundedAt: Date,
    refundTransactionId: String
  },
  failureReason: String,
  processedAt: Date,
  notes: String
}, {
  timestamps: true
});

// Pre-save middleware to generate transaction ID
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN${Date.now()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for faster queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ order: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
