import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authService.register(formData);
      const user = data.user;
      
      if (user.role === 'driver') navigate('/driver');
      else navigate('/farmer');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1>Join AgriPool</h1>
          <p>The future of agricultural logistics</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#fecaca', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Ravi Kumar" 
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

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
            <label>Create Password</label>
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

          <div className="form-group">
            <label>I am a...</label>
            <div className="role-selector">
              <div 
                className={`role-option ${formData.role === 'farmer' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'farmer' })}
              >
                Farmer
              </div>
              <div 
                className={`role-option ${formData.role === 'driver' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'driver' })}
              >
                Driver
              </div>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>Already have an account? <Link to="/login">Sign in</Link></div>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
