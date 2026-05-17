import React from 'react';

export default function ComplaintsSupport() {
  const tickets = [
    { id: 'TKT-991', user: 'Ravi Kumar', category: 'Late pickup', date: '2026-05-15', status: 'Open', priority: 'High' },
    { id: 'TKT-988', user: 'Anita Desai', category: 'Damaged crates', date: '2026-05-12', status: 'Resolved', priority: 'Medium' },
    { id: 'TKT-985', user: 'Vikram Singh', category: 'Payment delay', date: '2026-05-08', status: 'Resolved', priority: 'Low' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Complaints & support</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage user issues and platform support tickets.</p>
      </div>

      <div className="section-card" style={{ padding: 0 }}>
        <div style={{ padding: '2rem' }}>
          <h2>Support tickets</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket ID</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>User</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.25rem 2rem', fontWeight: '600' }}>{t.id}</td>
                <td style={{ padding: '1.25rem 2rem' }}>{t.user}</td>
                <td style={{ padding: '1.25rem 2rem' }}>{t.category}</td>
                <td style={{ padding: '1.25rem 2rem' }}>{t.date}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: t.priority === 'High' ? '#991b1b' : t.priority === 'Medium' ? '#854d0e' : '#475569',
                    fontWeight: '700'
                  }}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span className={`status-badge ${t.status === 'Open' ? 'status-pending' : 'status-completed'}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <button style={{ background: 'transparent', color: 'var(--primary-emerald)', fontWeight: '600', fontSize: '0.85rem' }}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
