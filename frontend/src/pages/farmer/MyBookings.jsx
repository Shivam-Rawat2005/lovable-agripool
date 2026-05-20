import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💳 Secure payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentStep, setPaymentStep] = useState('summary'); // 'summary' | 'paying' | 'success'
  const [payLoading, setPayLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/requests');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayAndConfirm = async () => {
    if (!selectedBooking) return;
    setPaymentStep('paying');
    setPayLoading(true);
    
    // Simulate premium secure payment delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await api.post(`/requests/${selectedBooking._id || selectedBooking.id}/pay`);
      setPaymentStep('success');
      
      // Refresh bookings list
      await fetchBookings();

      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
      }, 1800);
    } catch (error) {
      alert('Payment failed: ' + (error.response?.data?.message || error.message));
      setPaymentStep('summary');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My bookings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track all your shipments past and present.</p>
      </div>

      <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Request ID</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Crop</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Route</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Weight</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '600' }}>{booking._id?.substring(0, 8).toUpperCase()}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div>{booking.crop_type}</div>
                    {booking.vehicle && (
                      <div style={{ marginTop: '0.25rem', display: 'inline-block', color: '#16a34a', fontSize: '0.75rem', fontWeight: '600', background: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #dcfce7' }}>
                        🚛 {booking.vehicle.type} ({booking.vehicle.plate_number}) · Driver: {booking.driver?.name || 'Assigned'}
                      </div>
                    )}
                    {booking.rejection_reason && (
                      <div style={{ marginTop: '0.25rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: '500', background: '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #fee2e2', display: 'inline-block' }}>
                        ⚠️ Rejected: "{booking.rejection_reason}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.pickup_location} → {booking.dropoff_location}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.preferred_date}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.weight} kg</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span className={`status-badge status-${booking.status?.toLowerCase() || 'pending'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    {booking.escrow_status === 'unpaid' ? (
                      booking.status === 'Matched' ? (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setPaymentStep('summary');
                            setShowPaymentModal(true);
                          }}
                          style={{
                            background: 'var(--primary-emerald)',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'background 0.2s'
                          }}
                        >
                          💳 Pay ₹{(booking.payment_amount || (booking.weight * 10)).toLocaleString()}
                        </button>
                      ) : (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '999px',
                          background: '#f1f5f9',
                          color: '#64748b',
                          border: '1px dashed #cbd5e1',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}>
                          ⏳ Unpaid (Pay on accept)
                        </span>
                      )
                    ) : (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        background: booking.escrow_status === 'released' ? '#ecfdf5' : booking.escrow_status === 'pending_release' ? '#eff6ff' : '#f0fdf4',
                        color: booking.escrow_status === 'released' ? '#047857' : booking.escrow_status === 'pending_release' ? '#1d4ed8' : '#059669',
                        border: '1px solid currentColor',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        🛡️ {booking.escrow_status === 'released' ? 'Paid & Released' : booking.escrow_status === 'pending_release' ? 'Held (Pending Release)' : 'Paid (Held in Escrow)'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bookings found. Try creating a new transport request.
          </div>
        )}
      </div>

      {/* 💳 simulated Secure Escrow Checkout Modal */}
      {showPaymentModal && selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1.25rem', width: '90%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-light)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            
            {/* Payment Summary View */}
            {paymentStep === 'summary' && (
              <div>
                <div style={{ margin: '0 auto 1.25rem auto', background: '#ecfdf5', color: 'var(--primary-emerald)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>AgriPool Escrow</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Your payment is held safely by the system. It is only released to the driver upon your confirmation of delivery.</p>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #f1f5f9', textAlign: 'left', marginBottom: '2rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Crops to Ship</span>
                    <span style={{ fontWeight: '700' }}>{selectedBooking.crop_type} ({selectedBooking.weight} kg)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Route</span>
                    <span style={{ fontWeight: '700' }}>{selectedBooking.pickup_location} → {selectedBooking.dropoff_location}</span>
                  </div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>Escrow Total</span>
                    <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-emerald)' }}>₹{(selectedBooking.payment_amount || (selectedBooking.weight * 10)).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedBooking(null);
                    }}
                    style={{ flex: 1, padding: '0.85rem', background: '#f1f5f9', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePayAndConfirm}
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
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Securing ₹{(selectedBooking.payment_amount || (selectedBooking.weight * 10)).toLocaleString()} in the AgriPool logistics vault.</p>
              </div>
            )}

            {/* Success Animation View */}
            {paymentStep === 'success' && (
              <div style={{ padding: '1.5rem 0' }}>
                <div style={{ margin: '0 auto 1.5rem auto', background: '#dcfce7', color: '#047857', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
