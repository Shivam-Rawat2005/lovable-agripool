import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FarmerProfile() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [location, setLocation] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Sync state when user object loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setFarmSize(user.farm_size || '');
      setLocation(user.location || '');
      setPrimaryCrops(user.primary_crops || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/user/profile', {
        name,
        phone,
        farm_size: farmSize,
        location,
        primary_crops: primaryCrops
      });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your farm details and contact info.</p>
      </div>

      <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Account</h2>
        
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Full name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#ffffff', color: '#1e293b' }}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#ffffff', color: '#1e293b' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              disabled
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#f8fafc', color: 'var(--text-muted)', cursor: 'not-allowed' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Farm size (acres)</label>
            <input 
              type="number" 
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder="e.g. 10"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#ffffff', color: '#1e293b' }}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Farm location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Pimpalgaon, Nashik, Maharashtra"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#ffffff', color: '#1e293b' }}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Primary crops</label>
            <input 
              type="text" 
              value={primaryCrops}
              onChange={(e) => setPrimaryCrops(e.target.value)}
              placeholder="Tomatoes, Onions, Grapes"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', background: '#ffffff', color: '#1e293b' }}
            />
          </div>

          <div style={{ marginTop: '1rem', gridColumn: 'span 2' }}>
            <button 
              type="submit"
              disabled={saving}
              style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: 'none', cursor: 'pointer' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
