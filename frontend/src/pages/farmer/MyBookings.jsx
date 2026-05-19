import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchBookings();
  }, []);

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
    </div>
  );
}
