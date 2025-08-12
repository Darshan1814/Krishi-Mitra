const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  items: [{
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  gstDetails: {
    gstNumber: String,
    gstAmount: Number,
    cgst: Number,
    sgst: Number,
    igst: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'bank_transfer', 'upi']
  },
  notes: String
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Invoice').countDocuments() + 1;
    this.invoiceNumber = `INV-${year}${month}-${String(count).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
