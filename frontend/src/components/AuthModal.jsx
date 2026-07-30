import { useState } from 'react';

function AuthModal({ onClose, onAuthSuccess, forceLanding = false }) {
  const [isLogin, setIsLogin] = useState(!forceLanding);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isLogin ? '/api/users/login' : '/api/users/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        onAuthSuccess(data.data);
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${forceLanding ? 'landing-overlay' : ''}`}>
      <div className={`modal-box auth-modal ${isLogin ? 'login-mode' : ''} ${forceLanding ? 'landing-box' : ''}`}>
        <div className="modal-header">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          {!forceLanding && <button className="close-btn" onClick={onClose}>✕</button>}
        </div>

        <p className="auth-subtitle">
          {isLogin ? 'Enter your details to continue' : 'Join us for authentic homemade delicacies'}
        </p>

        {error && <div className="error-msg" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}

        <form className="order-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                required
                placeholder="Full address for delivery"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "New to Diwali Store?" : "Already have an account?"}
            <button 
              className="toggle-auth-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? ' Create account' : ' Sign In'}
            </button>
          </p>

          <button className="skip-btn" onClick={onClose}>
            Skip for now & browse products →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
