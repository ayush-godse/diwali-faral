const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    default: '250g',
  },
  emoji: {
    type: String,
    default: '🪔',
  },
  category: {
    type: String,
    required: true,
    enum: ['Sweets', 'Snacks', 'Gift Boxes', 'Combo Packs', 'Other'],
    default: 'Snacks',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  reviews: [
    {
      user: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  avgRating: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
