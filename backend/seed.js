const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
  {
    name: 'Chakli',
    slug: 'chakli',
    description: 'Crispy spiral-shaped snack made from rice flour with carom seeds. A Diwali must-have!',
    price: 180,
    unit: '250g',
    emoji: '🌀',
    category: 'Snacks',
    avgRating: 4.8,
    reviews: [{ user: 'Rahul', rating: 5, comment: 'Best chakli ever!' }]
  },
  {
    name: 'Ladoo',
    slug: 'ladoo',
    description: 'Soft, melt-in-mouth besan ladoos flavored with cardamom and topped with cashews.',
    price: 220,
    unit: '250g',
    emoji: '🍡',
    category: 'Sweets',
    avgRating: 4.5,
    reviews: [{ user: 'Sita', rating: 4, comment: 'Very fresh.' }]
  },
  {
    name: 'Shankarpale',
    slug: 'shankarpale',
    description: 'Sweet & savory diamond-shaped biscuits made with maida and ghee. Perfect festive treat.',
    price: 160,
    unit: '250g',
    emoji: '🍘',
    category: 'Snacks',
    avgRating: 4.2,
  },
  {
    name: 'Chivda',
    slug: 'chivda',
    description: 'Spicy flattened rice mix with peanuts, curry leaves and green chillies. Utterly addictive.',
    price: 140,
    unit: '250g',
    emoji: '🥜',
    category: 'Snacks',
    avgRating: 4.7,
  },
  {
    name: 'Combo Pack (Small)',
    slug: 'combo-small',
    description: 'The regular Diwali faral set: 250g Chakli, 250g Ladoo, 250g Shev.',
    price: 550,
    unit: 'Combo',
    emoji: '🎁',
    category: 'Combo Packs',
    avgRating: 4.9,
  },
  {
    name: 'Premium Gift Box',
    slug: 'gift-box-large',
    description: 'Large assortment of premium sweets and snacks in a beautiful box.',
    price: 1250,
    unit: 'Box',
    emoji: '🏮',
    category: 'Gift Boxes',
    avgRating: 5.0,
  },
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diwali-faral';
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI is not set. Falling back to local MongoDB at', MONGO_URI);
    }
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop collection entirely to remove stale indexes
    try { await mongoose.connection.db.dropCollection('products'); } catch(_) {}
    console.log('🗑️  Dropped products collection');

    await Product.insertMany(products);
    console.log('🌱 Seeded', products.length, 'products');

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
