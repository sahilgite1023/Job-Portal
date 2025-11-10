import React, { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function ApplicationsStudent() {
  const [apps, setApps] = useState([]);
  useEffect(() => { api.get('/applications/my').then(res => setApps(res.data.applications)); }, []);

  return (
    <div>
      <h3>My Applications</h3>
      <table className="table">
        <thead><tr><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead>
        <tbody>
          {apps.map(a => (
            <tr key={a._id}>
              <td>{a.job?.title}</td>
              <td>{a.job?.company}</td>
              <td>{a.status}</td>
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
