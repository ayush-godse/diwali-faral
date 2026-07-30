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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diwali-faral';

if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI is not set. Falling back to local MongoDB at', MONGO_URI);
}

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// simple request logger to help debug which server instance handles requests
app.use((req, res, next) => {
  console.log(`➡️ [${process.pid}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🪔 Diwali Faral API is running!' });
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      await seedProductsIfEmpty();
      await seedAdminIfNotExists();
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT} (pid ${process.pid})`);
  });
}

module.exports = app;
