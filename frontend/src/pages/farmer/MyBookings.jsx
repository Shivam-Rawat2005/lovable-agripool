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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: '600' }}>{booking._id?.substring(0, 8).toUpperCase()}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.crop_type}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.pickup_location} → {booking.dropoff_location}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.preferred_date}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>{booking.weight} kg</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span className={`status-badge status-${booking.status?.toLowerCase() || 'pending'}`}>
                      {booking.status}
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
