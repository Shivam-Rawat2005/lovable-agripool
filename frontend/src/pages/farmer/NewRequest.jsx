import React, { useState } from 'react';
import { Truck, MapPin, Calendar, FileText, Info, Package as PackageIcon, TrendingUp as TrendingUpIcon, Leaf } from 'lucide-react';
import requestService from '../../services/requestService';

export default function NewRequest() {
  const [formData, setFormData] = useState({
    crop_type: 'Tomatoes',
    weight: '800',
    pickup_location: 'Nashik',
    dropoff_location: 'Mumbai APMC',
    preferred_date: '',
    notes: ''
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
      await requestService.create(formData);
      setMessage('Request submitted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit request.';
      setMessage(`Error: ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create transport request</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tell us what you need to ship and we'll find the best route.</p>
      </div>

      <div className="section-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Shipment details</h2>
        
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

        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <PackageIcon size={16} /> Crop type
            </label>
            <input 
              type="text" 
              name="crop_type"
              value={formData.crop_type}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <TrendingUpIcon size={16} /> Weight (kg)
            </label>
            <input 
              type="number" 
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <MapPin size={16} /> Pickup location
            </label>
            <input 
              type="text" 
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <MapPin size={16} /> Drop-off location
            </label>
            <input 
              type="text" 
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <Calendar size={16} /> Preferred date
            </label>
            <input 
              type="date" 
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <FileText size={16} /> Notes (optional)
            </label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special handling instructions, packaging, etc."
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated cost</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹{(formData.weight * 5.25).toLocaleString()} – ₹{(formData.weight * 7.25).toLocaleString()}</div>
            </div>
            <div style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={14} /> Pool eligible
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit"
              disabled={loading}
              style={{ flex: 1, background: 'var(--primary-emerald)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Submitting...' : 'Submit request'}
            </button>
            <button 
              type="button"
              style={{ background: 'white', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--border-light)' }}
            >
              Save draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
