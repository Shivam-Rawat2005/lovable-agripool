import React, { useState } from 'react';
import { Truck, MapPin, Calendar, FileText, Info, Package as PackageIcon, TrendingUp as TrendingUpIcon, Leaf, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import requestService from '../../services/requestService';

export default function NewRequest() {
  const [formData, setFormData] = useState({
    crop_type: 'Tomatoes',
    weight: '800',
    pickup_location: 'Nashik',
    dropoff_location: 'Mumbai APMC',
    preferred_date: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // 💳 Secure payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('summary'); // 'summary' | 'paying' | 'success'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (!formData.preferred_date) {
      alert("Please select a preferred date first.");
      return;
    }
    setShowPaymentModal(true);
    setPaymentStep('summary');
  };

  const handlePayAndSubmit = async () => {
    setPaymentStep('paying');
    setLoading(true);
    setMessage('');
    
    // Simulate premium secure transaction delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await requestService.create(formData);
      setPaymentStep('success');
      
      // Auto close modal after showing checkmark
      setTimeout(() => {
        setShowPaymentModal(false);
        setMessage('Request submitted successfully! Funds are held safely in Escrow.');
        // Reset date and notes
        setFormData({
          ...formData,
          preferred_date: '',
          notes: ''
        });
      }, 1800);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to submit request.';
      setPaymentStep('summary');
      setShowPaymentModal(false);
      setMessage(`Error: ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const escrowCost = formData.weight * 10; // Standard Direct Payout is ₹10/kg

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create transport request</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tell us what you need to ship and we'll find the best route.</p>
      </div>

      <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Shipment details</h2>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2rem',
            background: message.includes('successfully') ? '#ecfdf5' : '#fee2e2',
            color: message.includes('successfully') ? '#047857' : '#991b1b',
            border: message.includes('successfully') ? '1px solid #a7f3d0' : '1px solid #fecaca',
            fontWeight: '600'
          }}>
            {message}
          </div>
        )}

        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} onSubmit={handleOpenPayment}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <PackageIcon size={16} /> Crop type
            </label>
            <input 
              type="text" 
              name="crop_type"
              value={formData.crop_type}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <TrendingUpIcon size={16} /> Weight (kg)
            </label>
            <input 
              type="number" 
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <MapPin size={16} /> Pickup location
            </label>
            <input 
              type="text" 
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <MapPin size={16} /> Drop-off location
            </label>
            <input 
              type="text" 
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <Calendar size={16} /> Preferred date
            </label>
            <input 
              type="date" 
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none' }}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              <FileText size={16} /> Notes (optional)
            </label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Special handling instructions, packaging, etc."
              style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Escrow Amount Required</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>₹{escrowCost.toLocaleString()}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated standard rate of ₹10 per kg</span>
            </div>
            <div style={{ background: '#ecfdf5', color: '#047857', padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #a7f3d0' }}>
              <Leaf size={14} /> Pool eligible
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit"
              style={{ flex: 1, background: 'var(--primary-emerald)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Continue to Escrow Payout
            </button>
            <button 
              type="button"
              style={{ background: 'white', color: 'var(--text-main)', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '600', border: '1px solid var(--border-light)', cursor: 'pointer' }}
            >
              Save draft
            </button>
          </div>
        </form>
      </div>

      {/* 💳 simulated Secure Escrow Checkout Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.25rem', width: '90%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-light)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            
            {/* Payment Summary View */}
            {paymentStep === 'summary' && (
              <div>
                <div style={{ margin: '0 auto 1.25rem auto', background: '#ecfdf5', color: 'var(--primary-emerald)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifycontent: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>AgriPool Escrow</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Your payment is held safely by the system. It is only released to the driver upon your confirmation of delivery.</p>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #f1f5f9', textAlign: 'left', marginBottom: '2rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Crops to Ship</span>
                    <span style={{ fontWeight: '700' }}>{formData.crop_type} ({formData.weight} kg)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Route</span>
                    <span style={{ fontWeight: '700' }}>{formData.pickup_location} → {formData.dropoff_location}</span>
                  </div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Escrow Total</span>
                    <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-emerald)' }}>₹{escrowCost.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayAndSubmit}
                    style={{ flex: 2, padding: '0.85rem', background: 'var(--primary-emerald)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <CreditCard size={18} /> Pay & Hold Escrow
                  </button>
                </div>
              </div>
            )}

            {/* Paying/Processing View */}
            {paymentStep === 'paying' && (
              <div style={{ padding: '2rem 0' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-emerald)', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Processing Payment...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Securing ₹{escrowCost.toLocaleString()} in the AgriPool logistics vault.</p>
              </div>
            )}

            {/* Success Animation View */}
            {paymentStep === 'success' && (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ margin: '0 auto 1.5rem auto', background: '#dcfce7', color: '#047857', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleUp 0.3s ease' }}>
                  <ShieldCheck size={42} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#047857', marginBottom: '0.5rem' }}>Payment Escrowed!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>AgriPool Secure Escrow active. Payout locked until shipment delivery is approved.</p>
              </div>
            )}

          </div>
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
