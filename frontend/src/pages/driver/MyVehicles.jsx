import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Info } from 'lucide-react';
import api from '../../services/api';

export default function MyVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getStatusClass = (status) => {
    switch(status) {
      case 'Available': return 'status-available';
      case 'On-Trip': return 'status-on-trip';
      case 'Maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My vehicles</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your fleet capacity and availability.</p>
        </div>
        <button 
          className="btn-demo" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#075985' }}
          onClick={() => navigate('/driver/vehicles/new')}
        >
          <Plus size={20} /> Add vehicle
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading vehicles...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {Array.isArray(vehicles) && vehicles.length > 0 ? vehicles.map((v) => (
            <div key={v._id} className="vehicle-card">
              <div className="vehicle-header">
                <div className="vehicle-type-icon">
                  <Truck size={24} />
                </div>
                <span className={`vehicle-status ${getStatusClass(v.status || 'Available')}`}>{v.status}</span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{v.type}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{v.plate_number}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Capacity</div>
                  <div style={{ fontWeight: '600' }}>{v.capacity} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Vehicle ID</div>
                  <div style={{ fontWeight: '600' }}>{v._id?.substring(0, 8).toUpperCase()}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.9rem', border: '1px solid var(--border-light)' }}>
                  Edit
                </button>
                <button style={{ background: 'transparent', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Logs
                </button>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
              No vehicles registered. Click "Add vehicle" to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
