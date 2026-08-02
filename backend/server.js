require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const { seedProductsIfEmpty } = require('./utils/seedProducts');
const { seedAdminIfNotExists } = require('./utils/seedAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow configuring the frontend origin via env var for production deployments
const FRONTEND_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diwali-faral';

if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI is not set. Falling back to local MongoDB at', MONGO_URI);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || FRONTEND_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Ensure MongoDB is connected for serverless environments
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.json({ message: '🪔 Diwali Faral API is running!' });
});
app.get('/', (req, res) => {
  res.json({ message: '🪔 Diwali Faral API is running!' });
});

// Seed data on startup if needed
connectDB().then(async () => {
  if (process.env.NODE_ENV !== 'production') {
    await seedProductsIfEmpty();
    await seedAdminIfNotExists();
  }
});

// Start server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} (pid ${process.pid})`);
  });
}

// Export the app for Vercel Serverless
module.exports = app;
