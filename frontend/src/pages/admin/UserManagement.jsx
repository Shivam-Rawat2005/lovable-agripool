import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users'); // I need to add this route
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User management</h1>
        <p style={{ color: 'var(--text-muted)' }}>Approve and manage farmers and drivers.</p>
      </div>

      <div className="section-card" style={{ padding: 0 }}>
        <div style={{ padding: '2rem' }}>
          <h2>All users</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Role</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '1.25rem 2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.25rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user._id?.substring(0, 8).toUpperCase()}</td>
                <td style={{ padding: '1.25rem 2rem', fontWeight: '600' }}>{user.name}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: 'var(--primary-emerald)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>{user.email}</td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span className={`status-badge status-matched`}>Approved</span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <button style={{ background: 'transparent', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem' }}>View</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No users found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
