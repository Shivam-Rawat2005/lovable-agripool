import React from 'react';

export default function LogisticsOversight() {
  const requests = [
    { id: 'REQ-1041', farmer: 'Ravi Kumar', crop: 'Tomatoes', route: 'Nashik → Mumbai APMC', weight: '800 kg', status: 'Matched' },
    { id: 'REQ-1042', farmer: 'Ravi Kumar', crop: 'Onions', route: 'Nashik → Pune Market', weight: '1200 kg', status: 'Pending' },
    { id: 'REQ-1043', farmer: 'Anita Desai', crop: 'Mangoes', route: 'Ratnagiri → Mumbai APMC', weight: '450 kg', status: 'In-Transit' },
    { id: 'REQ-1038', farmer: 'Ravi Kumar', crop: 'Grapes', route: 'Nashik → Mumbai APMC', weight: '600 kg', status: 'Completed' },
    { id: 'REQ-1044', farmer: 'Suresh Patil', crop: 'Sugarcane', route: 'Kolhapur → Pune Mill', weight: '2500 kg', status: 'Pending' },
  ];

  const pools = [
    { id: 'POOL-22', route: 'Nashik → Mumbai APMC', farmers: 4, weight: '3200/5000 kg', date: '2026-05-18' },
    { id: 'POOL-23', route: 'Ratnagiri → Mumbai APMC', farmers: 3, weight: '2900/3500 kg', date: '2026-05-19' },
    { id: 'POOL-24', route: 'Kolhapur → Pune', date: '2026-05-22' },
  ];

  const fleet = [
    { id: 'VH-01', name: 'Truck · MH-12-AB-3421', capacity: '5,000 kg', status: 'On-Trip' },
    { id: 'VH-02', name: 'Van · MH-12-CD-9981', capacity: '1,500 kg', status: 'Available' },
    { id: 'VH-03', name: 'Tractor · MH-15-EF-2210', capacity: '2,500 kg', status: 'Maintenance' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Logistics oversight</h1>
        <p style={{ color: 'var(--text-muted)' }}>All requests, pools, and vehicles in one place.</p>
      </div>

      <div className="section-card" style={{ padding: 0, marginBottom: '2.5rem' }}>
        <div style={{ padding: '2rem' }}>
          <h2>Transport requests</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID</th>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Farmer</th>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Crop</th>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Route</th>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weight</th>
              <th style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.id}</td>
                <td style={{ padding: '1rem 2rem', fontWeight: '500' }}>{r.farmer}</td>
                <td style={{ padding: '1rem 2rem' }}>{r.crop}</td>
                <td style={{ padding: '1rem 2rem' }}>{r.route}</td>
                <td style={{ padding: '1rem 2rem' }}>{r.weight}</td>
                <td style={{ padding: '1rem 2rem' }}>
                  <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="section-card">
          <h2>Active pools</h2>
          <div style={{ marginTop: '2rem' }}>
            {pools.map((p) => (
              <div key={p.id} className="request-item" style={{ padding: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{p.route} <span className="req-id">{p.id}</span></div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{p.farmers} farmers · {p.weight}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2>Fleet</h2>
          <div style={{ marginTop: '2rem' }}>
            {fleet.map((v) => (
              <div key={v.id} className="request-item" style={{ padding: '1.25rem' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{v.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{v.capacity} · {v.id}</div>
                </div>
                <div className={`status-badge ${v.status === 'Available' ? 'status-matched' : v.status === 'On-Trip' ? 'status-pending' : 'status-completed'}`} style={{ fontSize: '0.7rem' }}>
                  {v.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
