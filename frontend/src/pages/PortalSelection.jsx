import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Truck, ShieldCheck, ArrowRight, Loader } from 'lucide-react';
import authService from '../services/authService';
import './PortalSelection.css';

export default function PortalSelection() {
  const navigate = useNavigate();
  const [loadingPortal, setLoadingPortal] = useState(null);

  const handlePortalClick = async (portalId, path) => {
    const user = authService.getCurrentUser();
    
    // If they are already logged in (maybe as a real user), just let them through
    if (user) {
      navigate(path, { replace: true });
      return;
    }

    // Auto-login logic for demo mode
    setLoadingPortal(portalId);
    try {
      if (portalId === 'farmer') {
        await authService.login({ email: 'farmer@demo.com', password: 'password' });
        navigate(path, { replace: true });
      } else if (portalId === 'driver') {
        await authService.login({ email: 'driver@demo.com', password: 'password' });
        navigate(path, { replace: true });
      } else if (portalId === 'admin') {
        // Admin shouldn't really have a public demo, but let's redirect them to login
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Demo login failed', error);
      navigate('/login', { replace: true });
    } finally {
      setLoadingPortal(null);
    }
  };

  const portals = [
    {
      id: 'farmer',
      title: 'Farmer',
      description: 'Post crops, join pools, save on transport.',
      icon: <Leaf size={32} />,
      path: '/farmer',
    },
    {
      id: 'driver',
      title: 'Driver',
      description: 'Find loads, manage trips, grow earnings.',
      icon: <Truck size={32} />,
      path: '/driver',
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Oversee users, logistics, and reports.',
      icon: <ShieldCheck size={32} />,
      path: '/admin',
    },
  ];

  return (
    <div className="portal-selection-container">
      <header className="portal-header">
        <h1>Pick your portal</h1>
        <p>Three tailored experiences. One connected platform.</p>
      </header>

      <div className="portals-grid">
        {portals.map((portal) => (
          <div 
            key={portal.id} 
            className="portal-card"
            onClick={() => handlePortalClick(portal.id, portal.path)}
            style={{ opacity: loadingPortal === portal.id ? 0.7 : 1, pointerEvents: loadingPortal ? 'none' : 'auto' }}
          >
            <div className="portal-icon-wrapper">
              {portal.icon}
            </div>
            <h2>{portal.title}</h2>
            <p>{portal.description}</p>
            <div className="enter-link">
              {loadingPortal === portal.id ? 'Entering demo...' : (
                <>Enter portal <ArrowRight size={18} /></>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '4rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
