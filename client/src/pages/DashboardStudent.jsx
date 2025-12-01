import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import StatCard from '../components/StatCard.jsx';

export default function DashboardStudent() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApps(res.data.applications))
      .finally(() => setLoading(false));
    api.get('/notifications/my')
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const total = apps.length;
    const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
    const rejected = apps.filter(a => a.status === 'rejected').length;
    return { total, shortlisted, rejected };
  }, [apps]);

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <h3 className="mb-0">Student Dashboard</h3>
        <span className="badge badge-soft ms-3">Beta</span>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Total Applications" value={stats.total} icon="bi-send-fill" subtext="All time" /></div>
        <div className="col-md-4"><StatCard title="Shortlisted" value={stats.shortlisted} icon="bi-check2-circle" variant="success" /></div>
        <div className="col-md-4"><StatCard title="Rejected" value={stats.rejected} icon="bi-x-octagon" variant="danger" /></div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <strong>Recent Applications</strong>
          <span className="text-muted small">{stats.total} items</span>
        </div>
        <div className="list-group list-group-flush">
          {loading && <div className="p-3 text-muted small">Loading...</div>}
          {!loading && apps.length === 0 && <div className="p-3 text-muted">No applications yet. Go apply to jobs!</div>}
          {apps.map(a => (
            <div key={a._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="fw-semibold">{a.job?.title}</div>
                  <div className="text-muted small">{a.job?.company} • {a.job?.location}</div>
                </div>
                <div className="text-end">
                  <div className="small text-muted">{new Date(a.createdAt).toLocaleDateString()}</div>
                  <span className={`badge bg-${a.status === 'applied' ? 'secondary' : a.status === 'shortlisted' ? 'success' : 'danger'} mt-1`}>{a.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <strong>Notifications</strong>
          <span className="text-muted small">{notifications.length} items</span>
        </div>
        <div className="list-group list-group-flush">
          {notifications.length === 0 && <div className="p-3 text-muted">No notifications yet.</div>}
          {notifications.map(n => (
            <div key={n._id} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <div>{n.message}</div>
                <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <span className={`badge ${n.isRead ? 'text-bg-secondary' : 'text-bg-primary'}`}>{n.isRead ? 'Read' : 'New'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
