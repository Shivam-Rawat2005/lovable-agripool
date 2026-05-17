import React, { useState, useEffect } from 'react';
import { Package, Users, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function FarmerOverview() {
  const [data, setData] = useState({
    stats: {
      active_requests: 0,
      pools_joined: 0,
      cost_saved: '₹0',
      total_trips: 0
    },
    recent_requests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/farmer');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const statsList = [
    { label: 'Active Requests', value: data?.stats?.active_requests || 0, icon: <Package size={20} /> },
    { label: 'Pools Joined', value: data?.stats?.pools_joined || 0, icon: <Users size={20} /> },
    { label: 'Cost Saved', value: data?.stats?.cost_saved || '₹0', icon: <Wallet size={20} /> },
    { label: 'Total Trips', value: data?.stats?.total_trips || 0, icon: <TrendingUp size={20} /> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Here's an overview of your transport activity.</p>

      <div className="stats-grid">
        {statsList.map((stat, i) => (
          <div key={i} className="stat-card">
            <div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Recent requests</h2>
          <button style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View all <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="requests-list">
          {Array.isArray(data?.recent_requests) && data.recent_requests.length > 0 ? data.recent_requests.map((req) => (
            <div key={req._id} className="request-item">
              <div className="request-main">
                <div className="request-title">
                  {req.crop_type} <span className="req-id">{req._id?.substring(0, 8).toUpperCase()}</span>
                  {req.pool_id && <span className="pool-badge-sm">Pooled</span>}
                </div>
                <div className="request-meta">
                  {req.pickup_location} → {req.dropoff_location} • {req.weight}kg • {req.preferred_date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div className={`status-badge status-${req.status?.toLowerCase() || 'pending'}`}>{req.status}</div>
              </div>
            </div>
          )) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No requests found. Start by creating one!</div>}
        </div>
      </div>
    </div>
  );
}
