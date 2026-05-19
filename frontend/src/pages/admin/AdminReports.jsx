import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminReports() {
  const [data, setData] = useState({
    stats: {
      co2_saved: '0.0 t',
      avg_cost_saved: '₹0',
      utilization: '0%'
    },
    reports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/dashboard/admin');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading reports...</div>;

  const maxVal = data.reports.length > 0 ? Math.max(...data.reports.map(r => r.total), 1) : 1;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reports & analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Platform usage and pooling efficiency.</p>
      </div>

      {/* 📊 Live bar chart */}
      <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <h2>Trips per month</h2>
        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginTop: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          {data.reports.map((report, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '200px' }}>
                <div style={{ flex: 1, height: `${(report.total / maxVal) * 100}%`, background: '#d1fae5', borderRadius: '4px', minHeight: report.total > 0 ? '5px' : 0 }}></div>
                <div style={{ flex: 1, height: `${(report.pooled / maxVal) * 100}%`, background: '#059669', borderRadius: '4px', minHeight: report.pooled > 0 ? '5px' : 0 }}></div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{report.month}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 12, height: 12, background: '#d1fae5', borderRadius: '2px' }}></div> Total trips
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 12, height: 12, background: '#059669', borderRadius: '2px' }}></div> Pooled trips
          </div>
        </div>
      </div>

      {/* 📊 Live analytics stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>CO2 saved est.</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{data.stats.co2_saved}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>vs solo trips</div>
        </div>
        <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>Avg cost saved/farmer</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{data.stats.avg_cost_saved}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>this month</div>
        </div>
        <div className="section-card" style={{ border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>Driver utilization</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{data.stats.utilization}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>fleet-wide</div>
        </div>
      </div>
    </div>
  );
}
