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
    inStock: true,
  },
  {
    name: 'Ladoo',
    slug: 'ladoo',
    description: 'Soft, melt-in-mouth besan ladoos flavored with cardamom and topped with cashews.',
    price: 220,
    unit: '250g',
    emoji: '🍡',
    inStock: true,
  },
  {
    name: 'Shankarpale',
    slug: 'shankarpale',
    description: 'Sweet & savory diamond-shaped biscuits made with maida and ghee. Perfect festive treat.',
    price: 160,
    unit: '250g',
    emoji: '🍘',
    inStock: true,
  },
  {
    name: 'Chivda',
    slug: 'chivda',
    description: 'Spicy flattened rice mix with peanuts, curry leaves and green chillies. Utterly addictive.',
    price: 140,
    unit: '250g',
    emoji: '🥜',
    inStock: true,
  },
  {
    name: 'Anarse',
    slug: 'anarse',
    description: 'Traditional rice flour cookies coated with sesame seeds. A classic Diwali delicacy.',
    price: 200,
    unit: '250g',
    emoji: '🍪',
    inStock: true,
  },
  {
    name: 'Karanji',
    slug: 'karanji',
    description: 'Deep-fried crescent pastries stuffed with coconut and dry fruits. Festive favourite!',
    price: 240,
    unit: '250g',
    emoji: '🥮',
    inStock: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
