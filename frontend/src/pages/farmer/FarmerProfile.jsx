import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FarmerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your farm details and contact info.</p>
      </div>

      <div className="section-card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>Account</h2>
        
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full name</label>
            <input 
              type="text" 
              defaultValue={user?.name || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Phone</label>
            <input 
              type="text" 
              defaultValue={user?.phone || '+91 98765 43210'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              defaultValue={user?.email || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Farm size (acres)</label>
            <input 
              type="number" 
              defaultValue={user?.farm_size || '12'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Farm location</label>
            <input 
              type="text" 
              defaultValue={user?.location || 'Pimpalgaon, Nashik, Maharashtra'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Primary crops</label>
            <input 
              type="text" 
              defaultValue={user?.primary_crops || 'Tomatoes, Onions, Grapes'}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="button"
              style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
              onClick={() => alert('Profile update saved!')}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
