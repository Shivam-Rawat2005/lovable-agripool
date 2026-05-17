import React from 'react';

export default function AdminReports() {
  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reports & analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Platform usage and pooling efficiency.</p>
      </div>

      <div className="section-card">
        <h2>Trips per month</h2>
        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginTop: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          {[
            { month: 'Jan', total: 60, pooled: 45 },
            { month: 'Feb', total: 70, pooled: 50 },
            { month: 'Mar', total: 85, pooled: 65 },
            { month: 'Apr', total: 95, pooled: 75 },
            { month: 'May', total: 110, pooled: 85 },
          ].map((data, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '100%', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '200px' }}>
                <div style={{ flex: 1, height: `${data.total}%`, background: '#d1fae5', borderRadius: '4px' }}></div>
                <div style={{ flex: 1, height: `${data.pooled}%`, background: '#059669', borderRadius: '4px' }}></div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{data.month}</div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="section-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>CO2 saved est.</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>12.4 t</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>vs solo trips</div>
        </div>
        <div className="section-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>Avg cost saved/farmer</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>₹3,120</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>this month</div>
        </div>
        <div className="section-card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>Driver utilization</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>81%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>fleet-wide</div>
        </div>
      </div>
    </div>
  );
}
