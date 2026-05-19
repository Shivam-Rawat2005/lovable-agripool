import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, Share2 } from 'lucide-react';
import api from '../../services/api';

export default function AvailableWork() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [pools, setPools] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, poolRes, vehRes] = await Promise.all([
          api.get('/requests'),
          api.get('/pools'),
          api.get('/vehicles')
        ]);
        setRequests(reqRes.data.filter(r => r.status === 'Pending'));
        setPools(poolRes.data.filter(p => p.status === 'Open'));
        setVehicles(vehRes.data);
      } catch (error) {
        console.error('Failed to fetch work', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAcceptClick = (id) => {
    if (vehicles.length === 0) {
      if (window.confirm('You must register vehicle details before accepting any work! Would you like to add a vehicle now?')) {
        navigate('/driver/vehicles/new');
      }
      return;
    }
    setSelectedReqId(id);
    setSelectedVehicleId(vehicles[0]?._id || vehicles[0]?.id || '');
    setModalError('');
    setShowModal(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedVehicleId) {
      setModalError('Please select a vehicle');
      return;
    }
    setModalError('');
    try {
      await api.post(`/jobs/request/${selectedReqId}/accept`, { vehicle_id: selectedVehicleId });
      alert('Job accepted! It is now in your Assigned Trips.');
      setShowModal(false);
      
      // Refresh data
      const reqRes = await api.get('/requests');
      setRequests(reqRes.data.filter(r => r.status === 'Pending'));
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      setModalError(errMsg);
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
              {vehicles.length === 0 ? (
                <button 
                  style={{ background: '#f59e0b', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', border: 'none' }}
                  onClick={() => handleAcceptClick(req._id || req.id)}
                >
                  Add Vehicle to Accept
                </button>
              ) : (
                <button 
                  style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', border: 'none' }}
                  onClick={() => handleAcceptClick(req._id || req.id)}
                >
                  Accept
                </button>
              )}
              <button style={{ background: 'white', color: 'var(--text-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--border-light)' }}>Details</button>
            </div>
          </div>
        )) : <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No open requests currently.</div>}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="section-card" style={{
            width: '100%',
            maxWidth: '450px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '2rem',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Select Trip Vehicle</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose which vehicle you will use to fulfill this delivery request.</p>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', color: 'var(--emerald-deep)', fontSize: '0.85rem' }}>Select Vehicle</label>
              <select 
                value={selectedVehicleId}
                onChange={e => setSelectedVehicleId(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '0.95rem' }}
              >
                {vehicles.map(v => (
                  <option key={v._id || v.id} value={v._id || v.id}>
                    {v.type} ({v.plate_number}) - {v.capacity} kg {v.status === 'On-Trip' ? '• (In Use)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {modalError && (
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fee2e2', 
                color: '#ef4444', 
                padding: '0.8rem 1rem', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ {modalError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'white', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', border: '1px solid var(--border-light)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAccept}
                style={{ background: 'var(--primary-emerald)', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
