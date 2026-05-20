import React, { useState } from 'react';
import { Truck, MapPin, Calendar, FileText, Info, Package as PackageIcon, TrendingUp as TrendingUpIcon, Leaf, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
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
    if (!formData.preferred_date) {
      alert("Please select a preferred date first.");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await requestService.create(formData);
      setMessage('Request submitted successfully! Go to My Bookings to pay once a driver accepts your trip.');
      setFormData({
        ...formData,
        preferred_date: '',
        notes: ''
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit request.';
      setMessage(`Error: ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const escrowCost = formData.weight * 10; // Standard Direct Payout is ₹10/kg

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create transport request</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tell us what you need to ship and we'll find the best route.</p>
      </div>

      <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Shipment details</h2>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem',
            background: message.includes('successfully') ? '#ecfdf5' : '#fee2e2',
            color: message.includes('successfully') ? '#047857' : '#991b1b',
            border: message.includes('successfully') ? '1px solid #a7f3d0' : '1px solid #fecaca',
            fontWeight: '600'
          }}>
            {message}
          </div>
        )}        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} onSubmit={handleSubmit}>
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

          <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Escrow Amount Required</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>₹{escrowCost.toLocaleString()}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated standard rate of ₹10 per kg</span>
            </div>
            <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #a7f3d0' }}>
              <Leaf size={14} /> Pool eligible
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit"
              disabled={loading}
              style={{ flex: 1, background: 'var(--primary-emerald)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Submitting...' : 'Book Delivery Request'}
            </button>
            <button 
              type="button"
              style={{ background: 'white', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--border-light)', cursor: 'pointer' }}
            >
              Save draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
