import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Admin Dashboard</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchUsers}><i className="bi bi-arrow-clockwise me-1"></i>Refresh</button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td className="text-muted small">{u.email}</td>
                <td><span className="badge text-bg-secondary text-capitalize">{u.role}</span></td>
                <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="text-end">
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(u._id)}>
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
