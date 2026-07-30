function PolicyModal({ type, onClose }) {
  const policies = {
    terms: {
      title: 'Terms & Conditions',
      content: `Welcome to Gauri Godse's Diwali Faral Store. By ordering from us, you agree to:
      1. All items are homemade and prepared following hygiene standards.
      2. Prices are subject to change based on ingredient costs.
      3. Orders must be placed at least 2 days in advance for large quantities.
      4. We reserve the right to cancel orders in case of unforeseen circumstances.`
    },
    refund: {
      title: 'Refund & Cancellation',
      content: `Due to the perishable nature of homemade food items:
      1. Cancellations are only accepted within 2 hours of placing the order.
      2. No refunds will be provided once the preparation of the faral has started.
      3. In case of damage during delivery, please contact us immediately for a resolution.`
    },
    privacy: {
      title: 'Privacy Policy',
      content: `We value your privacy:
      1. We only collect your name, phone, and address to process your orders.
      2. Your data is never shared with third parties.
      3. We use your phone number only for order-related updates and communication.`
    },
    contact: {
      title: 'Contact Us',
      content: `Gauri Godse Homemade Faral
      Address: plotno 32 Ashok Nagar Savedi, Ahilyanagar, Maharashtra.
      Phone: 9860257564
      Email: gaurigodse19777@gmail.com
      Business Hours: 10:00 AM - 8:00 PM`
    }
  };

  const policy = policies[type] || { title: 'Policy', content: '' };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box policy-box">
        <div className="modal-header">
          <h2>{policy.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="policy-content" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
          {policy.content}
        </div>
      </div>
    </div>
  );
}

export default PolicyModal;
