import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authService.login(formData);
      const user = data.user;
      
      // Role-based redirection
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'driver') navigate('/driver');
      else navigate('/farmer');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Leaf size={32} />
            </div>
          </div>
          <h1>AgriPool</h1>
          <p>Login to your account</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#fecaca', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@farm.in" 
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>Don't have an account? <Link to="/register">Create one</Link></div>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            ← Back to Home
          </Link>
        </div>
        
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          ADMIN: admin@gmail.com / 1234567890
        </div>
      </div>
    </div>
  );
}
