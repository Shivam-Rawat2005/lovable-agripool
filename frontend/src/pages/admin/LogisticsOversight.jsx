import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, RefreshCw, Layers, Truck } from 'lucide-react';
import api from '../../services/api';

export default function LogisticsOversight() {
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, poolRes, setRes] = await Promise.all([
        api.get('/requests'),
        api.get('/pools'),
        api.get('/admin/settlements')
      ]);

      // Admin index route or general requests list
      setRequests(reqRes.data);
      // All active pools
      setPools(poolRes.data);
      // Payouts waiting for approval
      setSettlements(setRes.data);
    } catch (error) {
      console.error('Failed to fetch admin logistics oversight data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRelease = async (requestId) => {
    setBtnLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      await api.post(`/admin/settlements/${requestId}/approve`);
      alert('Settlement approved and funds released to the driver! 💸');
      fetchData();
    } catch (error) {
      alert('Failed to release funds: ' + (error.response?.data?.message || error.message));
    } finally {
      setBtnLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading && requests.length === 0) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Logistics Command Center...</div>;
  }

  const directSettlements = settlements.filter(s => !s.pool_id);
  const pooledSettlements = settlements.filter(s => s.pool_id);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Logistics oversight</h1>
          <p style={{ color: 'var(--text-muted)' }}>All live requests, active pools, and escrow settlements in real-time.</p>
        </div>
        <button 
          onClick={fetchData}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border-light)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Sync Data
        </button>
      </div>

      {/* 🔒 Escrow Settlements release ledger */}
      <div className="section-card" style={{ border: '1px solid #fcd34d', background: '#fffbeb', marginBottom: '3rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#92400e' }}>🔒 Escrow Payout Releases ({settlements.length})</h2>
            <p style={{ fontSize: '0.85rem', color: '#b45309' }}>Completed trips awaiting final Admin sign-off to release funds to the Driver.</p>
          </div>
        </div>

        {settlements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 🤝 Private Deliveries Section */}
            {directSettlements.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#b45309', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🤝 Private Deliveries ({directSettlements.length})
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {directSettlements.map((s) => {
                    const amount = s.payout || (s.weight * 8.5);
                    return (
                      <div key={s._id || s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a', boxShadow: '0 2px 4px rgba(251, 191, 36, 0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>
                            TRIP-{(s._id || s.id)?.substring(0, 8).toUpperCase()}
                            <span style={{ fontSize: '0.75rem', background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#16a34a', fontWeight: 'bold' }}>
                              Direct
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                            <span style={{ fontWeight: '600', color: '#0369a1' }}>Driver: {s.driver?.name || 'Driver'}</span>
                            <span style={{ color: '#6b7280' }}> • Farmer: {s.farmer?.name || 'Farmer'}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>
                            {s.crop_type} · {s.weight}kg · {s.pickup_location} → {s.dropoff_location}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payout Amount</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-emerald)' }}>₹{amount.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => handleApproveRelease(s._id || s.id)}
                            disabled={btnLoading[s._id || s.id]}
                            style={{
                              background: 'var(--primary-emerald)',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              opacity: btnLoading[s._id || s.id] ? 0.7 : 1,
                              transition: 'background 0.2s'
                            }}
                          >
                            <CheckSquare size={16} /> Approve & Release
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 👥 Pooled Deliveries Section */}
            {pooledSettlements.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#b45309', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  👥 Pooled Deliveries ({pooledSettlements.length})
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {pooledSettlements.map((s) => {
                    const amount = s.payout || (s.weight * 8.5);
                    return (
                      <div key={s._id || s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a', boxShadow: '0 2px 4px rgba(251, 191, 36, 0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#1e293b' }}>
                            TRIP-{(s._id || s.id)?.substring(0, 8).toUpperCase()}
                            <span style={{ fontSize: '0.75rem', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#3b82f6', fontWeight: 'bold' }}>
                              Pooled
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                            <span style={{ fontWeight: '600', color: '#0369a1' }}>Driver: {s.driver?.name || 'Driver'}</span>
                            <span style={{ color: '#6b7280' }}> • Farmer: {s.farmer?.name || 'Farmer'}</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>
                            {s.crop_type} · {s.weight}kg · {s.pickup_location} → {s.dropoff_location}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payout Amount</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-emerald)' }}>₹{amount.toLocaleString()}</div>
                          </div>
                          <button
                            onClick={() => handleApproveRelease(s._id || s.id)}
                            disabled={btnLoading[s._id || s.id]}
                            style={{
                              background: 'var(--primary-emerald)',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              opacity: btnLoading[s._id || s.id] ? 0.7 : 1,
                              transition: 'background 0.2s'
                            }}
                          >
                            <CheckSquare size={16} /> Approve & Release
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', border: '1px dashed #fcd34d', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No pending payouts at this time. All driver wallets are up to date! ✅
          </div>
        )}
      </div>

      {/* 🧾 Transport requests list */}
      <div className="section-card" style={{ padding: 0, marginBottom: '2.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Active Transport Requests</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Farmer</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Crop</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Route</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Weight</th>
                <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id || r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {(r._id || r.id)?.substring(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '1rem 2rem', fontWeight: '600' }}>{r.farmer?.name || 'Farmer'}</td>
                  <td style={{ padding: '1rem 2rem' }}>{r.crop_type}</td>
                  <td style={{ padding: '1rem 2rem', color: 'var(--text-muted)' }}>{r.pickup_location} → {r.dropoff_location}</td>
                  <td style={{ padding: '1rem 2rem', fontWeight: '600' }}>{r.weight} kg</td>
                  <td style={{ padding: '1rem 2rem' }}>
                    <span className={`status-badge status-${r.status?.toLowerCase() || 'pending'}`} style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚛 Active Pools list */}
      {/* 🚛 Active Pools list */}
      <div style={{ width: '100%' }}>
        <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} style={{ color: 'var(--primary-emerald)' }} /> Active Pools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {pools.map((p) => {
              const fillPercent = Math.round(((p.current_weight || 0) / (p.total_capacity || 1)) * 100);
              return (
                <div key={p._id || p.id} className="request-item" style={{ padding: '1.25rem', border: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                        {p.route_start} → {p.route_end} 
                        <span className="req-id" style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          {(p._id || p.id)?.substring(0, 4).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                        Driver: {p.driver?.name || 'Driver'} · Date: {p.date}
                      </div>
                    </div>
                    <span className={`status-badge status-${p.status?.toLowerCase()}`} style={{ fontSize: '0.7rem', fontWeight: '700' }}>
                      {p.status}
                    </span>
                  </div>

                  <div style={{ width: '100%', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span>{p.current_weight || 0} / {p.total_capacity || 0} kg filled</span>
                      <span>{fillPercent}%</span>
                    </div>
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ background: 'var(--primary-emerald)', width: `${Math.min(100, fillPercent)}%`, height: '100%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
