import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Leaf 
} from 'lucide-react';
import CommandCenter from './admin/CommandCenter';
import UserManagement from './admin/UserManagement';
import LogisticsOversight from './admin/LogisticsOversight';
import AdminReports from './admin/AdminReports';
import ComplaintsSupport from './admin/ComplaintsSupport';
import './FarmerDashboard.css'; // Reusing base layout styles

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Command Center', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { label: 'Logistics', icon: <Truck size={20} />, path: '/admin/logistics' },
    { label: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
    { label: 'Complaints', icon: <MessageSquare size={20} />, path: '/admin/complaints' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
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
          <span style={{ fontSize: '0.7rem', fontWeight: '400', opacity: '0.7', display: 'block', marginTop: '0.2rem' }}>Admin Portal</span>
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
          <div className="nav-item" onClick={() => navigate('/portals')}>
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
              <span className="user-name">Admin Sharma</span>
              <span className="user-role" style={{ background: '#f1f5f9', color: '#475569' }}>Admin</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Demo session</span>
            </div>
            <div className="avatar" style={{ background: '#475569' }}>A</div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/logistics" element={<LogisticsOversight />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/complaints" element={<ComplaintsSupport />} />
        </Routes>
      </main>
    </div>
  );
}
