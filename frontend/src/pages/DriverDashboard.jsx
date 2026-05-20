import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Search, 
  Map, 
  Wallet, 
  LogOut, 
  Leaf 
} from 'lucide-react';
import DriverOverview from './driver/DriverOverview';
import MyVehicles from './driver/MyVehicles';
import AvailableWork from './driver/AvailableWork';
import AssignedTrips from './driver/AssignedTrips';
import DriverEarnings from './driver/DriverEarnings';
import AddVehicle from './driver/AddVehicle';
import authService from '../services/authService';
import api from '../services/api';
import ChatWidget from '../components/ChatWidget';
import './FarmerDashboard.css'; // Reusing base layout styles
import './DriverDashboard.css';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to sync user in DriverDashboard', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/driver' },
    { label: 'My Vehicles', icon: <Truck size={20} />, path: '/driver/vehicles' },
    { label: 'Available', icon: <Search size={20} />, path: '/driver/available' },
    { label: 'Trips', icon: <Map size={20} />, path: '/driver/trips' },
    { label: 'Earnings', icon: <Wallet size={20} />, path: '/driver/earnings' },
  ];

  const isActive = (path) => {
    if (path === '/driver') {
      return location.pathname === '/driver' || location.pathname === '/driver/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar - Reusing styles from farmer sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Leaf size={20} />
          </div>
          AgriPool
          <span style={{ fontSize: '0.7rem', fontWeight: '400', opacity: '0.7', display: 'block', marginTop: '0.2rem' }}>Driver Portal</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div 
              key={item.path} 
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            Sign out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="farmer-content">
        <header className="top-bar">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user?.name || 'Vikram Singh'}</span>
              <span className="user-role" style={{ background: '#e0f2fe', color: '#075985', textTransform: 'capitalize' }}>{user?.role || 'driver'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.email?.includes('demo.com') ? 'Demo session' : 'Registered session'}
              </span>
            </div>
            <div className="avatar" style={{ background: '#0ea5e9' }}>
              {(user?.name || 'Vikram Singh').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DriverOverview />} />
          <Route path="/vehicles" element={<MyVehicles />} />
          <Route path="/vehicles/new" element={<AddVehicle />} />
          <Route path="/available" element={<AvailableWork />} />
          <Route path="/trips" element={<AssignedTrips />} />
          <Route path="/earnings" element={<DriverEarnings />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  );
}
