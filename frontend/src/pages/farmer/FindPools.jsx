import React, { useState, useEffect } from 'react';
import { Search, Share2, Users, Calendar, ShieldCheck, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function FindPools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  
  // 📥 Join states
  const [kgInput, setKgInput] = useState('1000');
  const [paymentStep, setPaymentStep] = useState('weight'); // 'weight' | 'checkout' | 'paying' | 'success'
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
    setPaymentStep('weight');
  };

  const handleWeightConfirm = () => {
    let cleanKg = kgInput.replace(/[^0-9.]/g, '');
    if (!cleanKg || isNaN(cleanKg) || Number(cleanKg) <= 0) {
      alert("Please enter a valid numeric weight.");
      return;
    }
    
    // Check remaining capacity of selected pool
    if (activePool) {
      const remainingCapacity = activePool.total_capacity - (activePool.current_weight || 0);
      if (Number(cleanKg) > remainingCapacity) {
        alert(`Capacity exceeded! Only ${remainingCapacity} kg left in this pool.`);
        return;
      }
    }
    
    setPaymentStep('checkout');
  };

  const submitJoin = async () => {
    let cleanKg = kgInput.replace(/[^0-9.]/g, '');
    const pool = pools.find(p => (p._id || p.id) === selectedPoolId);
    if (!pool) return;

    // Check remaining capacity of pool again before submitting
    const remainingCapacity = pool.total_capacity - (pool.current_weight || 0);
    if (Number(cleanKg) > remainingCapacity) {
      alert(`Capacity exceeded! Only ${remainingCapacity} kg left in this pool.`);
      setPaymentStep('weight');
      return;
    }

    setPaymentStep('paying');
    setIsJoining(true);
    
    // Simulate payment processing (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Create request with new fields, linking it to the pool
      const reqRes = await api.post('/requests', {
        crop_type: 'Mixed Goods',
        weight: Number(cleanKg),
        pickup_location: 'My Farm',
        dropoff_location: `${pool.route_end} via Pool`,
        preferred_date: pool.date,
        notes: 'Joined pool'
      });
      
      const newReq = reqRes.data.request;
      await api.post(`/pools/${selectedPoolId}/join`, { request_id: newReq._id || newReq.id });
      
      setPaymentStep('success');
      
      setTimeout(() => {
        setSelectedPoolId(null);
        fetchPools();
      }, 1800);

    } catch (error) {
      alert('Failed to join pool: ' + (error.response?.data?.message || error.message));
      setPaymentStep('weight');
    } finally {
      setIsJoining(false);
    }
  };

  // Find currently selected pool object
  const activePool = pools.find(p => (p._id || p.id) === selectedPoolId);
  const remainingCapacity = activePool ? Math.max(0, activePool.total_capacity - (activePool.current_weight || 0)) : 0;
  const isOverCapacity = Number(kgInput.replace(/[^0-9.]/g, '')) > remainingCapacity;
  const poolPrice = activePool ? (activePool.price_per_kg ?? 5.5) : 5.5;
  const escrowCost = activePool ? (Number(kgInput) * poolPrice) : 0;

  return (
    <div>
      {/* 💳 Join and payment checkout dialog modal */}
      {selectedPoolId && activePool && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.25rem', width: '90%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
            
            {/* Step 1: Input weight */}
            {paymentStep === 'weight' && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0f172a' }}>Join Pool</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>How many kilograms of crops do you want to contribute to this pooling truck?</p>
                
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={kgInput}
                    onChange={(e) => setKgInput(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', fontWeight: '600', fontSize: '1.1rem', textAlign: 'center' }}
                  />
                  <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>kg</span>
                </div>

                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    Remaining capacity: <strong style={{ color: '#0f172a' }}>{remainingCapacity.toLocaleString()} kg</strong>
                  </span>
                  {isOverCapacity && (
                    <div style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', background: '#fef2f2', padding: '0.5rem', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                      ⚠️ Total capacity exceeded! (Only {remainingCapacity.toLocaleString()} kg left)
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setSelectedPoolId(null)}
                    style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleWeightConfirm}
                    disabled={isOverCapacity}
                    style={{ 
                      flex: 1, 
                      padding: '0.85rem', 
                      background: isOverCapacity ? '#cbd5e1' : 'var(--primary-emerald)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: '700', 
                      cursor: isOverCapacity ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Escrow Checkout Summary */}
            {paymentStep === 'checkout' && (
              <div>
                <div style={{ margin: '0 auto 1.25rem auto', background: '#ecfdf5', color: 'var(--primary-emerald)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>AgriPool Escrow</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Funds are held safely in escrow. They are only released to the driver after delivery confirmation.</p>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #f1f5f9', textAlign: 'left', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pool Shared Route</span>
                    <span style={{ fontWeight: '700' }}>{activePool.route_start} → {activePool.route_end}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Contributed Weight</span>
                    <span style={{ fontWeight: '700' }}>{kgInput} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rate per kg</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary-emerald)' }}>₹{poolPrice}/kg</span>
                  </div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '0.6rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Escrow Payout</span>
                    <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>₹{escrowCost.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setPaymentStep('weight')}
                    style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                  <button 
                    onClick={submitJoin}
                    disabled={isJoining}
                    style={{ flex: 2, padding: '0.85rem', background: 'var(--primary-emerald)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <CreditCard size={18} /> Confirm Escrow
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Paying spinner */}
            {paymentStep === 'paying' && (
              <div style={{ padding: '2rem 0' }}>
                <Loader2 size={44} style={{ color: 'var(--primary-emerald)', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Processing Payment...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Securing ₹{escrowCost.toLocaleString()} in secure platform escrow...</p>
              </div>
            )}

            {/* Step 4: Success checkmark */}
            {paymentStep === 'success' && (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ margin: '0 auto 1.5rem auto', background: '#dcfce7', color: '#047857', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={36} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#047857', marginBottom: '0.5rem' }}>Joined Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Funds secured in AgriPool Escrow. Driver's remaining capacity has been updated!</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Find pools</h1>
        <p style={{ color: 'var(--text-muted)' }}>Share a truck with other farmers headed your way.</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by route..." 
          style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', outline: 'none', background: 'white' }}
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading pools...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {Array.isArray(pools) && pools.length > 0 ? pools.map((pool) => {
            const fillPercentage = Math.round(((pool.current_weight || 0) / (pool.total_capacity || 1)) * 100);
            return (
              <div key={pool._id || pool.id} className="section-card" style={{ marginBottom: 0, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Share2 size={16} /> POOL-{(pool._id || pool.id)?.substring(0, 4).toUpperCase()}
                  </div>
                  <div style={{ background: 'var(--bg-accent)', color: 'var(--primary-emerald)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: '700', fontSize: '0.9rem' }}>
                    ₹{pool.price_per_kg || 5.5}/kg
                  </div>
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{pool.route_start} → {pool.route_end}</h3>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> {pool.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: '600' }}>
                    <Users size={16} /> Driver: {pool.driver?.name || 'Driver'}
                  </div>
                </div>

                <div className="progress-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{pool.current_weight || 0} / {pool.total_capacity || 0} kg</span>
                    <span style={{ fontWeight: '700', color: 'var(--primary-emerald)' }}>{fillPercentage}% full</span>
                  </div>
                  <div className="progress-bar" style={{ background: '#f1f5f9' }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, fillPercentage)}%`, background: 'var(--primary-emerald)' }}></div>
                  </div>
                </div>

                {pool.current_weight >= pool.total_capacity ? (
                  <button 
                    disabled
                    style={{ width: '100%', background: '#cbd5e1', color: 'var(--text-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', marginTop: '2rem', cursor: 'not-allowed', border: 'none' }}
                  >
                    Total Capacity Exceeded
                  </button>
                ) : (
                  <button 
                    style={{ width: '100%', background: 'var(--primary-emerald)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', marginTop: '2rem', cursor: 'pointer', border: 'none' }}
                    onClick={() => handleJoinClick(pool._id || pool.id)}
                  >
                    Join pool
                  </button>
                )}
              </div>
            );
          }) : (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              No active pools found for your routes.
            </div>
          )}
        </div>
      )}
      
      {/* Embedded Spinner Keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
