import React, { useState, useEffect } from 'react';
import { Wallet, Share2, TrendingUp, Truck, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function DriverOverview() {
  const [showForm, setShowForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    route_start: '',
    route_end: '',
    date: '',
    total_capacity: 5000,
    price_per_kg: 5.5
  });

  const [data, setData] = useState({
    stats: {
      earnings: '₹0',
      active_trips: 0,
      total_trips: 0,
      vehicles: 0
    },
    recent_trips: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard/driver');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch driver dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pools', newTrip);
      alert('Trip scheduled! Farmers can now see and join your route.');
      setShowForm(false);
      fetchDashboard();
    } catch (error) {
      alert('Failed to schedule trip');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const statsList = [
    { label: 'This Month', value: data.stats.earnings, icon: <Wallet size={20} /> },
    { label: 'Active Trips', value: data.stats.active_trips, icon: <Share2 size={20} /> },
    { label: 'Total Trips', value: data.stats.total_trips, icon: <TrendingUp size={20} /> },
    { label: 'Vehicles', value: data.stats.vehicles, icon: <Truck size={20} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hi, Driver</h1>
          <p style={{ color: 'var(--text-muted)' }}>Your fleet at a glance.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ Schedule New Trip'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTrip} className="section-card" style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end', background: '#f8fafc', border: '2px solid var(--primary-emerald)' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: 'var(--emerald-deep)', fontSize: '0.85rem' }}>Start Location</label>
            <input type="text" placeholder="e.g. Nashik" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setNewTrip({...newTrip, route_start: e.target.value})} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: 'var(--emerald-deep)', fontSize: '0.85rem' }}>End Location</label>
            <input type="text" placeholder="e.g. Mumbai" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setNewTrip({...newTrip, route_end: e.target.value})} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: 'var(--emerald-deep)', fontSize: '0.85rem' }}>Date</label>
            <input type="date" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setNewTrip({...newTrip, date: e.target.value})} />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', color: 'var(--emerald-deep)', fontSize: '0.85rem' }}>Price (₹/kg)</label>
            <input type="number" step="0.1" defaultValue="5.5" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} onChange={e => setNewTrip({...newTrip, price_per_kg: e.target.value})} />
          </div>
          <button type="submit" style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.85rem', borderRadius: '8px', fontWeight: '700', border: 'none', height: '48px' }}>
            Publish Trip
          </button>
        </form>
      )}

      <div className="stats-grid">
        {statsList.map((stat, i) => (
          <div key={i} className="stat-card">
            <div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-icon" style={{ background: i === 0 ? '#f0fdf4' : '#f8fafc', color: i === 0 ? 'var(--primary-emerald)' : 'var(--text-muted)' }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Active & recent trips</h2>
          <button className="btn-demo" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Find loads <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="requests-list">
          {data.recent_trips.length > 0 ? data.recent_trips.map((trip) => {
            const isRequest = trip.type === 'Request';
            const route = isRequest ? `${trip.pickup_location} → ${trip.dropoff_location}` : `${trip.route_start} → ${trip.route_end}`;
            const date = isRequest ? trip.preferred_date : trip.date;
            const payout = isRequest ? (trip.weight * 6.5) : (trip.current_weight * (trip.price_per_kg || 5.5));
            return (
            <div key={trip._id} className="request-item">
              <div className="request-main">
                <div className="request-title">
                  {route} <span className="req-id">{trip._id?.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="request-meta">
                  {isRequest && trip.farmer?.name && <span style={{ color: '#075985', fontWeight: '500' }}>{trip.farmer.name} • </span>}
                  {trip.type} • {date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontWeight: '600', color: 'var(--primary-emerald)' }}>+₹{payout.toLocaleString()}</div>
                <div className={`status-badge status-${trip.status?.toLowerCase() || 'pending'}`}>{trip.status}</div>
              </div>
            </div>
            );
          }) : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recent trips found.</div>}
        </div>
      </div>
    </div>
  );
}
