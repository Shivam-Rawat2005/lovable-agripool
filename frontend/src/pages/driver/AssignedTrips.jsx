import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AssignedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const [reqRes, poolRes] = await Promise.all([
        api.get('/requests'),
        api.get('/pools')
      ]);
      
      const assignedReqs = reqRes.data.filter(r => r.status !== 'Pending').map(r => ({...r, type: 'request'}));
      // Include all pools returned by the backend for this driver (backend filters by driver_id)
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
      alert('Trip started successfully!');
      fetchTrips();
    } catch (error) {
      alert('Failed to start trip');
    }
  };

  const handleComplete = async (id, type) => {
    try {
      await api.post(`/jobs/${id}/${type}/complete`);
      alert('Job completed! Earnings added to your wallet.');
      fetchTrips();
    } catch (error) {
      alert('Failed to complete job');
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading assigned trips...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assigned trips</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time control for active and recent deliveries.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {Array.isArray(trips) && trips.length > 0 ? trips.map((trip) => {
          const isRequest = trip.type === 'request';
          const title = isRequest ? `${trip.crop_type} · ${trip.weight}kg` : `${trip.route_start} → ${trip.route_end}`;
          const payout = isRequest ? (trip.weight * 6.5) : (trip.current_weight * 5.5);
          
          return (
            <div key={trip._id || trip.id} className="section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title} <span className="req-id">{(trip._id || trip.id)?.substring(0, 8).toUpperCase()}</span></h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {isRequest && trip.farmer?.name && <span style={{ color: '#075985', fontWeight: '500' }}>From: {trip.farmer.name} | </span>}
                    {isRequest ? `${trip.pickup_location} → ${trip.dropoff_location}` : 'Pooled Shipment'} · {trip.preferred_date || trip.date}
                  </p>
                </div>
                <span className={`status-badge status-${trip.status?.toLowerCase() || 'pending'}`}>
                  {trip.status}
                </span>
              </div>

              <div className="trip-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '2rem 0' }}>
                <div className="trip-stat-box">
                  <div className="trip-stat-label">Estimated Payout</div>
                  <div className="trip-stat-value" style={{ fontWeight: '700', color: 'var(--primary-emerald)' }}>₹{payout.toLocaleString()}</div>
                </div>
                <div className="trip-stat-box">
                  <div className="trip-stat-label">Type</div>
                  <div className="trip-stat-value">{isRequest ? 'Individual' : 'Pool'}</div>
                </div>
                <div className="trip-stat-box">
                  <div className="trip-stat-label">Stops</div>
                  <div className="trip-stat-value">{isRequest ? '1' : '3+'}</div>
                </div>
              </div>

              {trip.status === 'Open' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    style={{ background: '#0284c7', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                    onClick={() => handleStartTrip(trip._id || trip.id, trip.type)}
                  >
                    Start Trip
                  </button>
                </div>
              )}

              {trip.status === 'In-Transit' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                    onClick={() => handleComplete(trip._id || trip.id, trip.type)}
                  >
                    Complete Job
                  </button>
                </div>
              )}
            </div>
          );
        }) : (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
            No assigned trips yet. Check "Available" to pick up work.
          </div>
        )}
      </div>
    </div>
  );
}
