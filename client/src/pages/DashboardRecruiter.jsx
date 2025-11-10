import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import StatCard from '../components/StatCard.jsx';

export default function DashboardRecruiter() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/me/listed')
      .then(res => setJobs(res.data.jobs))
      .finally(()=> setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: jobs.length,
    remote: jobs.filter(j => j.type === 'Remote').length,
    internship: jobs.filter(j => j.type === 'Internship').length,
  }), [jobs]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Recruiter Dashboard</h3>
        <Link to="/recruiter/post-job" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Post Job</Link>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard title="Total Jobs" value={stats.total} icon="bi-briefcase-fill" /></div>
        <div className="col-md-4"><StatCard title="Remote" value={stats.remote} icon="bi-wifi" variant="info" /></div>
        <div className="col-md-4"><StatCard title="Internships" value={stats.internship} icon="bi-mortarboard-fill" variant="warning" /></div>
      </div>
      <div className="row g-3">
        {jobs.map(j => (
          <div key={j._id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title mb-1">{j.title}</h5>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">{j.type}</span>
                </div>
                <div className="text-muted small mb-2">{j.company} • {j.location}</div>
                <p className="small text-muted flex-grow-1" style={{minHeight:'48px'}}>{(j.description||'').slice(0,90)}{j.description&&j.description.length>90?'...':''}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <Link className="btn btn-outline-primary btn-sm" to={`/recruiter/jobs/${j._id}/applicants`}><i className="bi bi-people-fill me-1"></i>Applicants</Link>
                  <small className="text-muted">{new Date(j.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && jobs.length === 0 && <div className="text-muted">No jobs posted yet. Create your first job.</div>}
        {loading && <div className="text-muted">Loading...</div>}
      </div>
    </div>
  );
}
