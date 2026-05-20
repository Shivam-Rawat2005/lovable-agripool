import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AssignedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'pools'
  
  // Rejection states
  const [rejectingReq, setRejectingReq] = useState(null); // { reqId, poolId, farmerName }
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchTrips = async () => {
    try {
      const [reqRes, poolRes] = await Promise.all([
        api.get('/requests'),
        api.get('/pools')
      ]);
      
      // Filter direct trips: requests accepted by driver where pool_id is empty
      const assignedReqs = reqRes.data
        .filter(r => r.status !== 'Pending' && !r.pool_id)
        .map(r => ({...r, type: 'request'}));
      
      // Driver's scheduled pools
      const assignedPools = poolRes.data.map(p => ({...p, type: 'pool'}));
      
      setTrips([...assignedReqs, ...assignedPools]);
    } catch (error) {
      console.error('Failed to fetch assigned trips', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleStartTrip = async (id, type) => {
    try {
      await api.post(`/jobs/${id}/${type}/start`);
      alert('Trip started successfully! Drive safe. 🚛');
      fetchTrips();
    } catch (error) {
      alert('Failed to start trip');
    }
  };

  const handleComplete = async (id, type) => {
    try {
      await api.post(`/jobs/${id}/${type}/complete`);
      alert('Trip completed! Payout is pending admin verification.');
      fetchTrips();
    } catch (error) {
      alert('Failed to complete job');
    }
  };

  const handleRejectFarmer = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    
    setIsRejecting(true);
    try {
      await api.post(`/pools/${rejectingReq.poolId}/reject/${rejectingReq.reqId}`, {
        reason: rejectReason
      });
      alert(`Farmer request rejected successfully.`);
      setRejectingReq(null);
      setRejectReason('');
      fetchTrips();
    } catch (error) {
      alert('Failed to reject request: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading assigned trips...</div>;

  const directTrips = trips.filter(t => t.type === 'request');
  const poolTrips = trips.filter(t => t.type === 'pool');
  const activeTripsList = activeTab === 'direct' ? directTrips : poolTrips;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assigned trips</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time control for active and recent deliveries.</p>
      </div>

      {/* 🧭 Tab Switcher */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
        <button
          onClick={() => setActiveTab('direct')}
          style={{
            background: activeTab === 'direct' ? 'var(--primary-emerald)' : 'transparent',
            color: activeTab === 'direct' ? 'white' : 'var(--text-muted)',
            border: activeTab === 'direct' ? 'none' : '1px solid var(--border-light)',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Private Shipments ({directTrips.length})
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          style={{
            background: activeTab === 'pools' ? 'var(--primary-emerald)' : 'transparent',
            color: activeTab === 'pools' ? 'white' : 'var(--text-muted)',
            border: activeTab === 'pools' ? 'none' : '1px solid var(--border-light)',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Scheduled Pools ({poolTrips.length})
        </button>
      </div>

      {/* 📋 Trips Render Grid */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {activeTripsList.length > 0 ? activeTripsList.map((trip) => {
          const isRequest = trip.type === 'request';
          const title = isRequest ? `${trip.crop_type} · ${trip.weight}kg` : `${trip.route_start} → ${trip.route_end}`;
          
          // Fallback support for snake_case and camelCase serialization
          const poolRequests = trip.transport_requests || trip.transportRequests || [];

          // Calculate payout dynamically
          const payout = isRequest 
            ? (trip.payout || 0) 
            : (poolRequests.reduce((sum, r) => sum + (r.payout || 0), 0) || 0);

          return (
            <div key={trip._id || trip.id} className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {title} 
                    <span className="req-id" style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                      {(trip._id || trip.id)?.substring(0, 8).toUpperCase()}
                    </span>
                    {trip.vehicle && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f0fdf4', color: 'var(--primary-emerald)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #dcfce7' }}>
                        🚛 {trip.vehicle.type} ({trip.vehicle.plate_number})
                      </span>
                    )}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {isRequest && trip.farmer?.name && (
                      <span style={{ color: '#0284c7', fontWeight: '600' }}>Farmer: {trip.farmer.name} | </span>
                    )}
                    {isRequest ? `${trip.pickup_location} → ${trip.dropoff_location}` : 'Pooled Capacity Trip'} · {trip.preferred_date || trip.date}
                  </p>
                </div>
                <span className={`status-badge status-${trip.status?.toLowerCase() || 'pending'}`} style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                  {trip.status === 'Completed' && trip.escrow_status === 'pending_release' ? 'Pending Payout' : trip.status}
                </span>
              </div>

              {/* 📊 Pool Capacity Metrics */}
              {!isRequest && (
                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <span>Capacity Filled</span>
                    <span style={{ color: 'var(--primary-emerald)' }}>
                      {trip.current_weight}kg / {trip.total_capacity}kg ({Math.min(100, Math.round((trip.current_weight / trip.total_capacity) * 100))}% filled)
                    </span>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '10px', width: '100%', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        background: 'var(--primary-emerald)', 
                        width: `${Math.min(100, Math.round((trip.current_weight / trip.total_capacity) * 100))}%`, 
                        height: '100%', 
                        borderRadius: '999px', 
                        transition: 'width 0.3s ease' 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 💸 Trip details overview */}
              <div className="trip-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '1.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="trip-stat-box">
                  <div className="trip-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Payout</div>
                  <div className="trip-stat-value" style={{ fontWeight: '800', color: 'var(--primary-emerald)', fontSize: '1.2rem' }}>₹{payout.toLocaleString()}</div>
                </div>
                <div className="trip-stat-box">
                  <div className="trip-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type</div>
                  <div className="trip-stat-value" style={{ fontWeight: '700' }}>{isRequest ? 'Private Booking' : 'Pooling Offer'}</div>
                </div>
                <div className="trip-stat-box">
                  <div className="trip-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stops</div>
                  <div className="trip-stat-value" style={{ fontWeight: '700' }}>{isRequest ? '1' : (poolRequests.length || 0)}</div>
                </div>
                {trip.vehicle && (
                  <div className="trip-stat-box">
                    <div className="trip-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle</div>
                    <div className="trip-stat-value" style={{ fontWeight: '700', color: '#1e293b' }}>
                      {trip.vehicle.type} <span style={{ fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-muted)' }}>({trip.vehicle.plate_number})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 🌾 Nested Passenger Farmers (Exclusive for Pools) */}
              {!isRequest && (
                <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🌾 Joined Passengers ({poolRequests.length || 0})
                  </h4>
                  {poolRequests.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {poolRequests.map((req) => (
                        <div key={req._id || req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{req.farmer?.name || 'Farmer'}</span>
                            <span style={{ color: 'var(--text-muted)' }}> · {req.crop_type}</span>
                            <div style={{ fontWeight: '700', color: 'var(--primary-emerald)', marginTop: '0.2rem' }}>
                              {req.weight} kg · ₹{(req.payout || (req.weight * (trip.price_per_kg ?? 5.5))).toLocaleString()}
                            </div>
                          </div>
                          {(trip.status === 'Open' || trip.status === 'Pending') && (
                            <button
                              onClick={() => setRejectingReq({ reqId: req._id || req.id, poolId: trip._id || trip.id, farmerName: req.farmer?.name || 'Farmer' })}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseOver={(e) => e.target.style.background = '#dc2626'}
                              onMouseOut={(e) => e.target.style.background = '#ef4444'}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No farmers have joined this pool yet.</p>
                  )}
                </div>
              )}

              {/* 🛠️ Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                {(trip.status === 'Open' || trip.status === 'Pending') && (
                  <button 
                    style={{ background: '#0284c7', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', border: 'none' }}
                    onClick={() => handleStartTrip(trip._id || trip.id, trip.type)}
                  >
                    Start Trip
                  </button>
                )}

                {trip.status === 'In-Transit' && (
                  <button 
                    style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', border: 'none' }}
                    onClick={() => handleComplete(trip._id || trip.id, trip.type)}
                  >
                    Complete Job
                  </button>
                )}

                {trip.status === 'Completed' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#fef3c7', borderRadius: 'var(--radius-md)', color: '#d97706', fontSize: '0.85rem', fontWeight: '600' }}>
                    🕒 Escrow Payout Pending Admin Approval
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>
            No {activeTab === 'direct' ? 'individual shipments' : 'scheduled pools'} assigned yet.
          </div>
        )}
      </div>

      {/* 🛑 Rejection Reason Modal */}
      {rejectingReq && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.25rem', width: '90%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>Reject Joined Farmer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Are you sure you want to reject <strong style={{ color: '#0f172a' }}>{rejectingReq.farmerName}</strong> from this pooling trip? Please provide a clear reason for the farmer.
            </p>
            
            <form onSubmit={handleRejectFarmer}>
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea 
                  required
                  placeholder="e.g. Overweight crop request or route schedule mismatch..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setRejectingReq(null);
                    setRejectReason('');
                  }}
                  disabled={isRejecting}
                  style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isRejecting}
                  style={{ flex: 1, padding: '0.85rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
