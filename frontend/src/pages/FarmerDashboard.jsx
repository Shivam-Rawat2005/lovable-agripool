import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  Package, 
  User, 
  LogOut, 
  Leaf 
} from 'lucide-react';
import FarmerOverview from './farmer/FarmerOverview';
import NewRequest from './farmer/NewRequest';
import FindPools from './farmer/FindPools';
import MyBookings from './farmer/MyBookings';
import FarmerProfile from './farmer/FarmerProfile';
import authService from '../services/authService';
import api from '../services/api';
import ChatWidget from '../components/ChatWidget';
import './FarmerDashboard.css';

export default function FarmerDashboard() {
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
        console.error('Failed to sync user in FarmerDashboard', error);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/farmer' },
    { label: 'New Request', icon: <PlusCircle size={20} />, path: '/farmer/new-request' },
    { label: 'Find Pools', icon: <Search size={20} />, path: '/farmer/find-pools' },
    { label: 'My Bookings', icon: <Package size={20} />, path: '/farmer/bookings' },
    { label: 'Profile', icon: <User size={20} />, path: '/farmer/profile' },
  ];

  const isActive = (path) => {
    if (path === '/farmer') {
      return location.pathname === '/farmer' || location.pathname === '/farmer/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Leaf size={20} />
          </div>
          AgriPool
          <span style={{ fontSize: '0.7rem', fontWeight: '400', opacity: '0.7', display: 'block', marginTop: '0.2rem' }}>Farmer Portal</span>
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
              <span className="user-name">{user?.name || 'Ravi Kumar'}</span>
              <span className="user-role" style={{ textTransform: 'capitalize' }}>farmer</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.email?.includes('demo.com') ? 'Demo session' : 'Registered session'}
              </span>
            </div>
            <div className="avatar">
              {(user?.name || 'Ravi Kumar').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<FarmerOverview />} />
          <Route path="/new-request" element={<NewRequest />} />
          <Route path="/find-pools" element={<FindPools />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<FarmerProfile />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  );
}
