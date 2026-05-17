import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Award } from 'lucide-react';
import api from '../../services/api';

export default function DriverEarnings() {
  const [data, setData] = useState({
    stats: { earnings: '₹0', active_trips: 0, total_trips: 0 },
    history: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const [dashRes, reqRes, poolRes] = await Promise.all([
          api.get('/dashboard/driver'),
          api.get('/requests'),
          api.get('/pools')
        ]);
        
        const assignedReqs = reqRes.data.filter(r => r.status !== 'Pending').map(r => ({...r, type: 'request'}));
        const assignedPools = poolRes.data.filter(p => p.status !== 'Open').map(p => ({...p, type: 'pool'}));
        
        setData({
          stats: dashRes.data.stats,
          history: [...assignedReqs, ...assignedPools].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        });
      } catch (error) {
        console.error('Failed to fetch earnings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading earnings...</div>;

  const totalPaid = data.history.filter(h => h.status === 'Completed').length * 4500; // Average for mock visual if needed, but we use dash stats

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Earnings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of payments and incentives.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">This Month</div>
            <div className="stat-value">{data.stats.earnings}</div>
          </div>
          <div className="stat-icon"><Wallet size={20} /></div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Jobs</div>
            <div className="stat-value">{data.stats.total_trips}</div>
          </div>
          <div className="stat-icon"><TrendingUp size={20} /></div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label">Active Jobs</div>
            <div className="stat-value">{data.stats.active_trips}</div>
            <div className="stat-change" style={{ color: 'var(--text-muted)' }}>Currently in-transit</div>
          </div>
          <div className="stat-icon"><Award size={20} /></div>
        </div>
      </div>

      <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <h2>Payment history</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trip ID</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Route</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.history) && data.history.length > 0 ? data.history.map((e) => {
                const isRequest = e.type === 'request';
                const amount = isRequest ? (e.weight * 6.5) : (e.current_weight * 5.5);
                return (
                  <tr key={e._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '600' }}>{e._id?.substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>{e.preferred_date || e.date}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>{isRequest ? `${e.pickup_location} → ${e.dropoff_location}` : `${e.route_start} → ${e.route_end}`}</td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '700' }}>₹{amount.toLocaleString()}</td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span className={`status-badge status-${e.status?.toLowerCase() || 'pending'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
