import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Leaf, 
  Share2, 
  TrendingUp, 
  Users, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  ChevronDown,
  Star,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  CreditCard,
  Globe2
} from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  // Newsletter State
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const faqData = [
    {
      q: "When and how does a farmer pay for a transport request?",
      a: "In AgriPool, farmers do not pay immediately upon request creation. Payment is deferred! Once a driver accepts your Private or Pooled request, a 'Pay' option is unlocked directly in your 'My Bookings' panel, allowing you to complete payment via our secure mock payment gateway."
    },
    {
      q: "How does the global real-time chat widget operate?",
      a: "Every dashboard portal (Farmer, Driver, and Admin) is globally connected to our schema-less MongoDB chat stream. Click the green floating icon in the bottom-right corner of any portal to send instant messages. The widget actively displays a pulsing green dot when connected to active servers and shifts to red if disconnected."
    },
    {
      q: "How does the platform block vehicles already in use?",
      a: "To prevent operational issues, when a driver accepts a private or pooled transport request, the vehicle is marked as occupied for that date. The platform blocks other drivers from accepting overlapping trips with that same vehicle, displaying a warning notification."
    },
    {
      q: "Who manages money releases and escrow holds?",
      a: "When a farmer pays for an accepted trip, the funds are held securely by the platform. The Admin dashboard provides dedicated controls to group pooled trips together and manage private trips separately, allowing the administrator to release escrow payouts to driver accounts."
    }
  ];

  const testimonials = [
    {
      name: "Ramesh Patil",
      role: "Farmer User",
      loc: "Nashik, Maharashtra",
      quote: "Creating a booking is completely free, and I only have to pay once a driver actually accepts my crop request. The real-time support chat connected to the Admin panel is extremely fast!",
      initial: "R"
    },
    {
      name: "Vikram Chauhan",
      role: "Driver User",
      loc: "Pune, Maharashtra",
      quote: "The system automatically prevents double-booking my transport vehicle. If I'm already assigned to a private job, other trips are instantly locked to prevent overlapping on the same day.",
      initial: "V"
    },
    {
      name: "Sanjay Deshmukh",
      role: "Platform Administrator",
      loc: "Nagpur, Maharashtra",
      quote: "Grouping pool trips separately from private bookings makes releasing driver payouts incredibly straightforward. I can review active logistics and complete payouts in seconds.",
      initial: "S"
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="landing-container">
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Leaf size={22} />
          </div>
          AgriPool
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Platform Features</a>
          <a href="#timeline" className="nav-link">How It Works</a>
          <a href="#faq" className="nav-link">Help & FAQs</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button className="btn-signin" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-demo" onClick={() => navigate('/portals')}>Launch Demo</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="pool-badge" style={{ 
            color: '#047857', 
            width: 'fit-content', 
            marginBottom: '2rem', 
            background: '#ecfdf5', 
            border: '1px solid #a7f3d0',
            fontSize: '0.85rem',
            padding: '0.5rem 1.1rem',
            borderRadius: '99px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '700'
          }}>
            <Sparkles size={14} style={{ color: '#10b981' }} />
            AgriPool Transport Hub
          </div>
          <h1>Decentralized Crop Pooling & <span>Private Freight Bookings.</span></h1>
          <p className="hero-description">
            A state-of-the-art agricultural logistics platform that matches farmers with local freight drivers, manages secure admin escrows, and provides live unified support chat widgets.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/portals')}>
              Try Platform Demo <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Login to Account
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>Private</h3>
              <p>Direct Bookings</p>
            </div>
            <div className="stat-item">
              <h3>Pool</h3>
              <p>Shared Logistics</p>
            </div>
            <div className="stat-item">
              <h3>Live</h3>
              <p>Unified Support Chat</p>
            </div>
          </div>
        </div>

        {/* Live Pool Display Widget */}
        <div className="live-pool-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="card-header">
            <div className="pool-badge">
              <Share2 size={16} className="animate-pulse" style={{ color: '#34d399' }} /> Live Sharing Hub
            </div>
            <div className="pool-id" style={{ background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>POOL-ACTIVE</div>
          </div>

          <div className="route-info">
            <div className="route-label">Active Capacity Hub</div>
            <div className="route-text" style={{ fontSize: '2rem' }}>Nashik → Mumbai APMC</div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '74%' }}></div>
            </div>
            <div className="progress-stats">
              <span style={{ color: '#34d399', fontWeight: '800' }}>3,700 / 5,000 kg occupied</span>
              <span>5 Farmers Joined</span>
            </div>
          </div>

          <div className="crop-tags">
            <div className="crop-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>🍅 Tomatoes 1,800kg</div>
            <div className="crop-tag" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>🧅 Onions 1,200kg</div>
            <div className="crop-tag" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>🥭 Grapes 700kg</div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" style={{ padding: '8rem 6%', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>Our Operational Features</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 5rem auto' }}>AgriPool removes logistics bottlenecks through active, integrated portal tools.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
          
          <div className="feature-card">
            <div style={{ background: '#ecfdf5', color: 'var(--primary-emerald)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 2rem auto', justifyContent: 'center' }}>
              <TrendingUp size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Private & Shared Pooling</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.5' }}>
              Farmers can choose direct private transport requests or join collective shared community pools to maximize shipment rates and load efficiency.
            </p>
          </div>
          
          <div className="feature-card">
            <div style={{ background: '#ecfdf5', color: 'var(--primary-emerald)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 2rem auto', justifyContent: 'center' }}>
              <CreditCard size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Post-Acceptance Escrow</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.5' }}>
              Create crop requests at zero initial cost. Payment triggers only after a certified driver accepts. Funds are held in escrow until successful transit.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ background: '#ecfdf5', color: 'var(--primary-emerald)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 2rem auto', justifyContent: 'center' }}>
              <MessageSquare size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Unified Live Support Chat</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', lineHeight: '1.5' }}>
              Communicate instantly using the bottom floating chat widget. Connects Farmers, Drivers, and Admin support panels statefully with live servers.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / STEP WORKFLOW */}
      <section id="timeline" className="timeline-section">
        <div className="section-title">
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--bg-accent)', color: 'var(--primary-emerald-light)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.25rem', border: '1px solid #dcfce7', gap: '0.4rem', alignItems: 'center' }}>
            <Clock size={14} /> Platform Operations
          </div>
          <h2>Seamless Logistics Journey</h2>
          <p>Moving your harvest from field to wholesale market centers in 3 simple digital steps.</p>
        </div>

        <div className="timeline-steps">
          <div className="timeline-step">
            <span className="step-num">1</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>Create Request Free</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Post your crop shipment details (crop type, weight, and location) under either private request or collective route pooling forms.
            </p>
          </div>

          <div className="timeline-step">
            <span className="step-num">2</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>Driver Accept & Pay</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              A certified driver reviews the shipment and accepts the job. Once matched, the farmer completes checkout from the 'My Bookings' panel.
            </p>
          </div>

          <div className="timeline-step">
            <span className="step-num">3</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>Live Chat & Admin Release</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Coordinate route details using the unified chat widget. Once delivery completes, the platform Admin releases escrow securely to the driver's wallet.
            </p>
          </div>
        </div>
      </section>

      {/* CUSTOMER STORY SECTION */}
      <section className="testimonials-section">
        <div className="section-title">
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--bg-accent)', color: 'var(--primary-emerald-light)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.25rem', border: '1px solid #dcfce7', gap: '0.4rem', alignItems: 'center' }}>
            <Users size={14} /> Real Farmer Stories
          </div>
          <h2>Trusted By Rural Communities</h2>
          <p>Hear from real agricultural cultivators and transport drivers saving money and time with AgriPool.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card">
              <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
                <Star size={16} fill="#f59e0b" />
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              
              <div className="testimonial-user">
                <div className="user-avatar-circle">{t.initial}</div>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' }}>{t.name}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>{t.role} · {t.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section id="faq" className="faq-section">
        <div className="section-title">
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--bg-accent)', color: 'var(--primary-emerald-light)', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.25rem', border: '1px solid #dcfce7', gap: '0.4rem', alignItems: 'center' }}>
            <HelpCircle size={14} /> Knowledge Hub
          </div>
          <h2>Frequently Asked Questions</h2>
          <p>Get instant answers regarding platform logistics, cargo pooling rules, security, and payouts.</p>
        </div>

        <div className="faq-container">
          {faqData.map((item, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                <button 
                  className="faq-header"
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="faq-arrow" style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {isActive && (
                  <div className="faq-body">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* NEWSLETTER SUBSCRIBE CARD */}
      <section className="newsletter-section">
        <div className="newsletter-glass-card">
          <div style={{ display: 'inline-flex', padding: '0.4rem 1.25rem', background: 'rgba(255,255,255,0.12)', color: '#34d399', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '1.75rem', gap: '0.4rem', alignItems: 'center' }}>
            <Globe2 size={14} /> Newsletter signup
          </div>
          
          {subscribed ? (
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle size={52} style={{ color: '#34d399', animation: 'scaleUp 0.3s' }} />
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>You're Subscribed!</h3>
              <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>We will send you monthly reports on optimized highway routes and cargo pools in your region.</p>
            </div>
          ) : (
            <>
              <h2 className="newsletter-title">Subscribe for Route Updates</h2>
              <p className="newsletter-subtitle">Get immediate notifications once a high-saving shipping pool opens along your regular highway corridors.</p>
              
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input 
                  type="email" 
                  className="newsletter-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                />
                <button type="submit" className="btn-subscribe">
                  Notify Me
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', padding: '5rem 6% 4rem 6%', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'white', fontWeight: '800', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary-emerald)', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
            <Leaf size={18} />
          </div>
          AgriPool Logistics Inc.
        </div>
        <p>© 2026 AgriPool Logistics. Delivering smart agricultural connectivity, cost reductions, and greener transport solutions.</p>
      </footer>

    </div>
  );
}
