const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      // Pipe to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc
        .fillColor('#ff5722')
        .fontSize(25)
        .text('INVOICE', { align: 'center' })
        .moveDown();

      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Gauri Godse Diwali Faral Store', { align: 'center' })
        .fontSize(10)
        .text('Ashok Nagar, Ahilyanagar', { align: 'center' })
        .moveDown();

      doc.moveTo(50, 160).lineTo(550, 160).stroke('#eeeeee');

      // Order Info
      doc
        .fontSize(12)
        .fillColor('#000000')
        .text(`Order ID: ${order.orderId}`, 50, 180)
        .text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 50, 195)
        .moveDown();

      // Customer Info
      doc
        .fontSize(14)
        .text('Bill To:', 50, 220)
        .fontSize(12)
        .text(`Name: ${order.customerName}`, 50, 240)
        .text(`Phone: ${order.phone}`, 50, 255)
        .text(`Address: ${order.address}`, 50, 270)
        .moveDown();

      doc.moveTo(50, 300).lineTo(550, 300).stroke('#eeeeee');

      // Table Header
      let currentHeight = 320;
      doc
        .fontSize(12)
        .text('Product Name', 50, currentHeight)
        .text('Qty', 350, currentHeight)
        .text('Price', 400, currentHeight)
        .text('Total', 500, currentHeight);

      doc.moveTo(50, currentHeight + 15).lineTo(550, currentHeight + 15).stroke('#eeeeee');

      // Table Items
      currentHeight += 25;
      order.items.forEach(item => {
        doc
          .fontSize(10)
          .text(item.name, 50, currentHeight)
          .text(item.quantity.toString(), 350, currentHeight)
          .text(`Rs. ${item.price}`, 400, currentHeight)
          .text(`Rs. ${item.price * item.quantity}`, 500, currentHeight);
        currentHeight += 20;
      });

      doc.moveTo(50, currentHeight + 5).lineTo(550, currentHeight + 5).stroke('#eeeeee');

      // Grand Total
      doc
        .fontSize(14)
        .fillColor('#ff5722')
        .text(`Grand Total: Rs. ${order.totalAmount}`, 400, currentHeight + 20, { align: 'right' });

      // Footer
      doc
        .fillColor('#888888')
        .fontSize(10)
        .text('Thank you for shopping with us!', 50, 700, { align: 'center', width: 500 });

      doc.end();

      stream.on('finish', () => {
        console.log(`✅ PDF Generated: ${filePath}`);
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoice;
