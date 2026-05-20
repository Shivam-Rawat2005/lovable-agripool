import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function DriverEarnings() {
  const [data, setData] = useState({
    stats: { earnings: '₹0', pending_earnings: '₹0', active_trips: 0, total_trips: 0 },
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
        
        // Grab requests that driver accepted directly or completed
        const assignedReqs = reqRes.data.filter(r => r.status !== 'Pending' && !r.pool_id).map(r => ({...r, type: 'request'}));
        
        // Grab pools driver created
        const assignedPools = poolRes.data.map(p => ({...p, type: 'pool'}));
        
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

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Earnings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Detailed breakdown of payments, pending escrow, and histories.</p>
      </div>

      {/* 💳 Wallet Overview Cards */}
      <div className="stats-grid" style={{ marginBottom: '3rem' }}>
        <div className="stat-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <div className="stat-label">Available Wallet</div>
            <div className="stat-value" style={{ color: 'var(--primary-emerald)' }}>{data.stats.earnings}</div>
            <div className="stat-change" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.8rem' }}>
              <CheckCircle size={12} /> Ready for withdrawal
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#ecfdf5', color: 'var(--primary-emerald)' }}><Wallet size={20} /></div>
        </div>

        <div className="stat-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <div className="stat-label">Pending Release</div>
            <div className="stat-value" style={{ color: '#b45309' }}>{data.stats.pending_earnings || '₹0'}</div>
            <div className="stat-change" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.8rem' }}>
              <Clock size={12} /> Awaiting admin approval
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#fffbeb', color: '#b45309' }}><Clock size={20} /></div>
        </div>

        <div className="stat-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <div className="stat-label">Lifetime Trips</div>
            <div className="stat-value">{data.stats.total_trips}</div>
            <div className="stat-change" style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.8rem' }}>Trips successfully processed</div>
          </div>
          <div className="stat-icon" style={{ background: '#f8fafc', color: 'var(--text-muted)' }}><TrendingUp size={20} /></div>
        </div>
      </div>

      {/* 📋 Ledger Payment History Table */}
      <div className="section-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Payment Ledger</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Trip ID</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Amount</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Escrow Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.history) && data.history.length > 0 ? data.history.map((e) => {
                const isRequest = e.type === 'request';
                const poolRequests = e.transport_requests || e.transportRequests || [];
                
                // Calculate amount dynamically
                const amount = isRequest 
                  ? (e.payout || 0) 
                  : (poolRequests.reduce((sum, r) => sum + (r.payout || 0), 0) || 0);

                // Determine display escrow status
                let statusLabel = e.status;
                let badgeClass = 'status-pending';

                if (e.status === 'Completed') {
                  const escrowStatus = isRequest 
                    ? e.escrow_status 
                    : (poolRequests[0]?.escrow_status || 'pending_release');

                  if (escrowStatus === 'released') {
                    statusLabel = 'Paid & Released';
                    badgeClass = 'status-completed'; // Green
                  } else if (escrowStatus === 'pending_release') {
                    statusLabel = 'Pending Payout';
                    badgeClass = 'status-pending'; // Amber / Orange
                  } else {
                    statusLabel = 'Held in Escrow';
                    badgeClass = 'status-matched'; // Blue
                  }
                } else if (e.status === 'In-Transit') {
                  statusLabel = 'In Transit';
                  badgeClass = 'status-matched';
                } else if (e.status === 'Open') {
                  statusLabel = 'Open / Recruiting';
                  badgeClass = 'status-pending';
                }

                return (
                  <tr key={e._id || e.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: '#1e293b' }}>
                      {(e._id || e.id)?.substring(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '500' }}>
                      {isRequest ? 'Private Booking' : 'Pool Trip'}
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>{e.preferred_date || e.date}</td>
                    <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)' }}>
                      {isRequest ? `${e.pickup_location} → ${e.dropoff_location}` : `${e.route_start} → ${e.route_end}`}
                    </td>
                    <td style={{ padding: '1.25rem 2rem', fontWeight: '800', color: 'var(--primary-emerald)' }}>
                      ₹{amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '1.25rem 2rem' }}>
                      <span className={`status-badge ${badgeClass}`} style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No transactions found in your history.
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
