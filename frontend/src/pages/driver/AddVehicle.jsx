import React, { useState } from 'react';
import { Truck, Hash, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function AddVehicle() {
  const [formData, setFormData] = useState({
    type: 'Truck',
    plate_number: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/vehicles', formData);
      setMessage('Vehicle added successfully!');
      setFormData({ type: 'Truck', plate_number: '', capacity: '' });
    } catch (error) {
      setMessage('Failed to add vehicle. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Add new vehicle</h1>
        <p style={{ color: 'var(--text-muted)' }}>Register a vehicle to start accepting transport requests.</p>
      </div>

      <div className="section-card">
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem',
            background: message.includes('success') ? '#dcfce7' : '#fee2e2',
            color: message.includes('success') ? '#166534' : '#991b1b',
            fontWeight: '600'
          }}>
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', color: '#075985', fontSize: '0.9rem' }}>Vehicle type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', width: '100%', outline: 'none' }}
            >
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Tractor">Tractor</option>
              <option value="Mini-truck">Mini-truck</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '600', color: '#075985', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={16} /> Plate number
            </label>
            <input 
              type="text" 
              name="plate_number"
              placeholder="e.g. MH-12-AB-3421" 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', width: '100%', outline: 'none' }}
              value={formData.plate_number}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            <label style={{ fontWeight: '600', color: '#075985', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} /> Max capacity (kg)
            </label>
            <input 
              type="number" 
              name="capacity"
              placeholder="e.g. 5000" 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', width: '100%', outline: 'none' }}
              value={formData.capacity}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading} style={{ background: '#075985' }}>
            {loading ? 'Adding...' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
}
