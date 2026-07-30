function Footer({ onOpenPolicy }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Gauri Godse</h3>
          <p>Authentic Homemade Diwali Faral</p>
          <p className="footer-address">Plot no 32, Gokarna, Ashoknagar Bhingardive Mala, near Gulmohor Road, Savedi, Ahilyanagar City</p>
        </div>
        <div className="footer-links">
          <button onClick={() => onOpenPolicy('contact')}>Contact Us</button>
          <button onClick={() => onOpenPolicy('terms')}>Terms & Conditions</button>
          <button onClick={() => onOpenPolicy('refund')}>Refund Policy</button>
          <button onClick={() => onOpenPolicy('privacy')}>Privacy Policy</button>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Gauri Godse Faral. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
