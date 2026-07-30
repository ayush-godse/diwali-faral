const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { protect } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    
    // Check if user exists by phone OR email
    const userExists = await User.findOne({ $or: [{ phone }, { email }] });
    if (userExists) {
      const field = userExists.phone === phone ? 'phone number' : 'email address';
      return res.status(400).json({ success: false, message: `User with this ${field} already exists` });
    }

    // Initial address becomes the first saved address
    const addresses = address ? [{ fullAddress: address, label: 'Home', isDefault: true }] : [];
    
    const user = await User.create({ name, phone, email, addresses });
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        addresses: user.addresses,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, email } = req.body;
    // Allow login by phone OR email
    const query = phone ? { phone } : { email };
    if (!phone && !email) return res.status(400).json({ success: false, message: 'Please provide phone or email' });
    
    const user = await User.findOne(query);
    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          addresses: user.addresses,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get User Profile & Order History
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: {
        user,
        orders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add New Address
router.post('/addresses', protect, async (req, res) => {
  try {
    const { label, fullAddress, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ label, fullAddress, isDefault });
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete Address
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
