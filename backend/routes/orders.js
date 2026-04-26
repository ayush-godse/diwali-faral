const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const os = require('os');
const fs = require('fs');
const generateInvoice = require('../utils/generatePDF');

// POST order success - Save order and return PDF invoice
router.post('/order-success', async (req, res) => {
  try {
    const orderData = req.body;
    orderData.orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

    const order = new Order(orderData);
    await order.save();

    const fileName = `invoice_${order.orderId}.pdf`;
    const filePath = path.join(os.tmpdir(), fileName);

    // Generate PDF
    await generateInvoice(order, filePath);

    // Send file for download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Could not download invoice' });
        }
      }
      // Optional: Delete file after download to save space
      // fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error('Order/PDF Error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Original POST route (optional, but keeping for compatibility)
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    orderData.orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
