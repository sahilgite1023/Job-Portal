import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data.job));
  }, [id]);

  const apply = async () => {
    try {
      await api.post(`/applications/${id}/apply`);
      setApplied(true);
    } catch (e) {
      alert(e.response?.data?.message || 'Apply failed');
    }
  };

  if (!job) return <div>Loading...</div>;
  return (
    <div>
      <h3>{job.title}</h3>
      <p className="text-muted">{job.company} • {job.location} • {job.type}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
      {user?.role === 'student' && (
        <button className="btn btn-primary" onClick={apply} disabled={applied}>{applied ? 'Applied' : 'Apply Now'}</button>
      )}
    </div>
  );
}
