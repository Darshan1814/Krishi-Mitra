const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400'
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);