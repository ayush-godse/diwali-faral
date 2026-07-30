const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const generateInvoice = require('../utils/generatePDF');
const sendEmail = require('../utils/sendEmail');
const { protect, admin } = require('../middleware/authMiddleware');

// POST order success - Save order and return PDF invoice (requires auth)
router.post('/order-success', protect, async (req, res) => {
  try {
    console.log('🧾 order-success handler - req.user:', req.user ? req.user._id : null)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    }
    const orderData = req.body;
    orderData.orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    // Associate order with authenticated user
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    }

    const order = new Order(orderData);
    await order.save();

    const fileName = `invoice_${order.orderId}.pdf`;
    const filePath = path.join(__dirname, '../invoices', fileName);

    // Generate PDF
    await generateInvoice(order, filePath);

    // Send Email Notification
    try {
      await sendEmail({
        email: order.email || orderData.email,
        subject: `Order Confirmed! ${order.orderId} - Diwali Faral Store 🪔`,
        message: `Hello ${order.customerName},\n\nYour order ${order.orderId} has been placed successfully! We have attached your invoice to this email.\n\nTotal Amount: ₹${order.totalAmount}\nDelivery Address: ${order.address}\n\nHappy Diwali!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #ff5722;">🪔 Order Confirmed!</h2>
            <p>Hello <strong>${order.customerName}</strong>,</p>
            <p>Your order <strong>${order.orderId}</strong> has been placed successfully!</p>
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
              <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${order.address}</p>
            </div>
            <p>We have attached the official invoice to this email for your records.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9em; color: #666;">Thank you for shopping with Gauri Godse's Diwali Faral Store. Have a prosperous and happy Diwali!</p>
          </div>
        `,
        attachments: [
          {
            filename: fileName,
            path: filePath
          }
        ]
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
    }

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

// POST create order (requires auth)
router.post('/', protect, async (req, res) => {
  try {
    console.log('🧾 create-order handler - req.user:', req.user ? req.user._id : null)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, please login' });
    }
    const orderData = req.body;
    orderData.orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    }
    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET all orders (admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update order status (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
