import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, User, Share2 } from 'lucide-react';
import api from '../../services/api';

export default function AvailableWork() {
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, poolRes] = await Promise.all([
          api.get('/requests'),
          api.get('/pools')
        ]);
        setRequests(reqRes.data.filter(r => r.status === 'Pending'));
        setPools(poolRes.data.filter(p => p.status === 'Open'));
      } catch (error) {
        console.error('Failed to fetch work', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAcceptRequest = async (id) => {
    try {
      await api.post(`/jobs/request/${id}/accept`);
      alert('Job accepted! It is now in your Assigned Trips.');
      // Refresh data
      const reqRes = await api.get('/requests');
      setRequests(reqRes.data.filter(r => r.status === 'Pending'));
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAcceptPool = async (id) => {
    try {
      await api.post(`/jobs/pool/${id}/accept`);
      alert('Pool claimed successfully!');
      const poolRes = await api.get('/pools');
      setPools(poolRes.data.filter(p => p.status === 'Open'));
    } catch (error) {
      alert('Failed to claim pool: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading available work...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Available work</h1>
        <p style={{ color: 'var(--text-muted)' }}>Pick up open requests or take on a full pool.</p>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Open Requests</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {Array.isArray(requests) && requests.length > 0 ? requests.map((req) => (
          <div key={req._id || req.id} className="work-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{(req._id || req.id)?.substring(0, 8).toUpperCase()}</div>
                <h3 style={{ fontSize: '1.25rem' }}>{req.crop_type} · {req.weight} kg</h3>
                <div style={{ fontSize: '0.85rem', color: '#075985', fontWeight: '500', marginTop: '0.25rem' }}>From: {req.farmer?.name || 'Farmer'}</div>
              </div>
              <div style={{ background: '#f0fdf4', color: 'var(--primary-emerald)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: '700' }}>₹{(req.weight * 6.5).toLocaleString()}</div>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {req.pickup_location} → {req.dropoff_location}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {req.preferred_date}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                onClick={() => handleAcceptRequest(req._id || req.id)}
              >
                Accept
              </button>
              <button style={{ background: 'white', color: 'var(--text-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--border-light)' }}>Details</button>
            </div>
          </div>
        )) : <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No open requests currently.</div>}
      </div>

    </div>
  );
}
