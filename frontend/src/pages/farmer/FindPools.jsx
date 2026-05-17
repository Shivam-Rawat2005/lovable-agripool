import React, { useState, useEffect } from 'react';
import { Search, Share2, Users, Calendar, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function FindPools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [kgInput, setKgInput] = useState('1000');
  const [isJoining, setIsJoining] = useState(false);

  const fetchPools = async () => {
    try {
      const response = await api.get('/pools');
      setPools(response.data);
    } catch (error) {
      console.error('Failed to fetch pools', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleJoinClick = (poolId) => {
    setSelectedPoolId(poolId);
    setKgInput('1000');
  };

  const submitJoin = async () => {
    let cleanKg = kgInput.replace(/[^0-9.]/g, '');
    
    if (!cleanKg || isNaN(cleanKg) || Number(cleanKg) <= 0) {
      alert("Please enter a valid numeric weight.");
      return;
    }

    setIsJoining(true);
    try {
      const reqRes = await api.post('/requests', {
        crop_type: 'Mixed Goods',
        weight: Number(cleanKg),
        pickup_location: 'My Farm',
        dropoff_location: 'Pool Destination',
        preferred_date: new Date().toISOString().split('T')[0],
        notes: 'Joining pool'
      });
      
      const newReq = reqRes.data.request;
      await api.post(`/pools/${selectedPoolId}/join`, { request_id: newReq._id || newReq.id });
      
      alert(`Successfully added ${cleanKg}kg to the pool!`);
      setSelectedPoolId(null);
      fetchPools();
    } catch (error) {
      alert('Failed to join pool: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
      {/* Modal for Joining Pool */}
      {selectedPoolId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Join Pool</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>How many kilograms do you want to add to this pool?</p>
            <input 
              type="text" 
              value={kgInput}
              onChange={(e) => setKgInput(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setSelectedPoolId(null)}
                style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
              >
                Cancel
              </button>
              <button 
                onClick={submitJoin}
                disabled={isJoining}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--primary-emerald)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
              >
                {isJoining ? 'Joining...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Find pools</h1>
        <p style={{ color: 'var(--text-muted)' }}>Share a truck with other farmers headed your way.</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by route..." 
          style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', outline: 'none', background: 'white' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading pools...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {Array.isArray(pools) && pools.length > 0 ? pools.map((pool) => {
            const fillPercentage = Math.round(((pool.current_weight || 0) / (pool.total_capacity || 1)) * 100);
            return (
              <div key={pool._id || pool.id} className="section-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Share2 size={16} /> POOL-{(pool._id || pool.id)?.substring(0, 4).toUpperCase()}
                  </div>
                  <div style={{ background: 'var(--bg-accent)', color: 'var(--primary-emerald)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: '700', fontSize: '0.9rem' }}>
                    ₹{pool.price_per_kg || 5.2}/kg
                  </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{pool.route_start} → {pool.route_end}</h3>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> {pool.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#075985', fontWeight: '500' }}>
                    <Users size={16} /> Driver: {pool.driver?.name || 'Driver'}
                  </div>
                </div>

                <div className="progress-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500' }}>{pool.current_weight || 0} / {pool.total_capacity || 0} kg</span>
                    <span style={{ fontWeight: '700' }}>{fillPercentage}% full</span>
                  </div>
                  <div className="progress-bar" style={{ background: '#f1f5f9' }}>
                    <div className="progress-fill" style={{ width: `${fillPercentage}%`, background: 'var(--primary-emerald)' }}></div>
                  </div>
                </div>

                <button 
                  style={{ width: '100%', background: 'var(--primary-emerald)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '600', marginTop: '2rem' }}
                  onClick={() => handleJoinClick(pool._id || pool.id)}
                >
                  Join pool
                </button>
              </div>
            );
          }) : (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              No active pools found for your routes.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
