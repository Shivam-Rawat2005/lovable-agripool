import React, { useState, useEffect } from 'react';
import { Users, Truck, Wallet, Activity } from 'lucide-react';
import api from '../../services/api';

export default function CommandCenter() {
  const [data, setData] = useState({
    stats: {
      total_users: 0,
      active_trips: 0,
      revenue: '₹0',
      pool_fill_rate: '0%'
    },
    recent_activity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const response = await api.get('/dashboard/admin');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Command Center...</div>;

  const statsList = [
    { label: 'Total Users', value: data.stats.total_users, icon: <Users size={20} /> },
    { label: 'Active Trips', value: data.stats.active_trips, icon: <Truck size={20} /> },
    { label: 'Revenue', value: data.stats.revenue, icon: <Wallet size={20} /> },
    { label: 'Pool Fill Rate', value: data.stats.pool_fill_rate, icon: <Activity size={20} /> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Command center</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Platform health at a glance.</p>

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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="section-card">
          <h2>Recent platform activity</h2>
          <div style={{ marginTop: '2rem' }}>
            {Array.isArray(data?.recent_activity) && data.recent_activity.length > 0 ? data.recent_activity.map((item) => (
              <div key={item._id} className="request-item" style={{ padding: '1rem' }}>
                <div className="request-main">
                  <div className="request-title">
                    {item._id?.substring(0, 8).toUpperCase()} · {item.crop_type}
                  </div>
                  <div className="request-meta">
                    {item.pickup_location} → {item.dropoff_location}
                  </div>
                </div>
                <div className={`status-badge status-${item.status?.toLowerCase() || 'pending'}`}>{item.status}</div>
              </div>
            )) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent activity.</div>}
          </div>
        </div>

        <div className="section-card">
          <h2>Quick stats</h2>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avg trip cost</div>
              <div style={{ fontWeight: '700' }}>{data.stats.avg_trip_cost || '₹0'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Completed trips</div>
              <div style={{ fontWeight: '700', color: 'var(--primary-emerald)' }}>{data.stats.completed_trips || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
