const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Chakli',
    slug: 'chakli',
    description: 'Crispy spiral-shaped snack made from rice flour with carom seeds. A Diwali must-have!',
    price: 180,
    unit: '250g',
    emoji: '🌀',
    category: 'Snacks',
    avgRating: 4.8,
    reviews: [{ user: 'Rahul', rating: 5, comment: 'Best chakli ever!' }],
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
    reviews: [{ user: 'Sita', rating: 4, comment: 'Very fresh.' }],
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

async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`🌱 Seeded ${sampleProducts.length} sample products.`);
  } else {
    console.log(`ℹ️  Found ${count} product(s), skipping sample seed.`);
  }
}

module.exports = { seedProductsIfEmpty };
