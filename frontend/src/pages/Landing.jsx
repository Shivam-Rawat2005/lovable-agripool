import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Share2, TrendingUp, Users, Clock } from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Leaf size={24} />
          </div>
          AgriPool
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#roles" className="nav-link">Roles</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
        </div>
        <button className="btn-demo" onClick={() => navigate('/portals')}>Open demo</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="pool-badge" style={{ color: 'var(--primary-emerald)', width: 'fit-content', marginBottom: '1.5rem', background: 'white', border: '1px solid var(--border-light)' }}>
            <span style={{ height: 8, width: 8, borderRadius: '50%', background: 'var(--primary-emerald)' }}></span>
            AI-powered pooling
          </div>
          <h1>Move crops smarter. <span>Together.</span></h1>
          <p className="hero-description">
            AgriPool connects farmers with drivers and intelligently groups shipments 
            along shared routes — so trucks travel full and farmers pay less.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/portals')}>
              Try the demo <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/portals')}>
              Choose a role
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>32%</h3>
              <p>Avg cost saved</p>
            </div>
            <div className="stat-item">
              <h3>1.8k</h3>
              <p>Trips pooled</p>
            </div>
            <div className="stat-item">
              <h3>97%</h3>
              <p>On-time rate</p>
            </div>
          </div>
        </div>

        {/* Live Pool Card */}
        <div className="live-pool-card">
          <div className="card-header">
            <div className="pool-badge">
              <Share2 size={16} /> Live pool
            </div>
            <div className="pool-id">POOL-22</div>
          </div>

          <div className="route-info">
            <div className="route-label">Route</div>
            <div className="route-text">Nashik → Mumbai APMC</div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-stats">
              <span>3,200 / 5,000 kg filled</span>
              <span>4 farmers</span>
            </div>
          </div>

          <div className="crop-tags">
            <div className="crop-tag">Tomatoes 800kg</div>
            <div className="crop-tag">Onions 1,200kg</div>
            <div className="crop-tag">Mangoes 450kg</div>
          </div>
        </div>
      </section>

      {/* Feature Section Preview */}
      <section id="features" style={{ padding: '6rem 5%', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>Optimized for the entire ecosystem</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          <div className="feature-card">
            <TrendingUp color="var(--primary-emerald)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3>Maximize Earnings</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Drivers earn more by filling empty space and reducing idle time between trips.</p>
          </div>
          <div className="feature-card">
            <Users color="var(--primary-emerald)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3>Community Pooling</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Small farmers gain access to large-scale logistics at a fraction of the cost.</p>
          </div>
          <div className="feature-card">
            <Clock color="var(--primary-emerald)" size={40} style={{ marginBottom: '1.5rem' }} />
            <h3>Real-time Tracking</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Know exactly where your crops are with live updates and ETAs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
