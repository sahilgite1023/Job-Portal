import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';

export default function ApplicantsRecruiter() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [workingId, setWorkingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get(`/applications/job/${id}/applicants`);
      setApps(res.data.applications);
      if (res.data.applications[0]?.job?.title) setJobTitle(res.data.applications[0].job.title);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (applicationId, status) => {
    try {
      setWorkingId(applicationId);
      const { data } = await api.patch(`/applications/${applicationId}/status`, { status });
      // Optimistic update; fallback to server response if present
      const updated = data?.application?.status || status;
      setApps(prev => prev.map(a => a._id === applicationId ? { ...a, status: updated } : a));
      alert(`Status updated to "${updated}"`);
    } catch (e) {
      console.error('Status update failed:', e);
      const msg = e?.response?.data?.message || 'Update failed';
      alert(msg);
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div>
      <h3>Applicants {jobTitle && `- ${jobTitle}`}</h3>
      <table className="table align-middle">
        <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Resume</th><th>Actions</th></tr></thead>
        <tbody>
          {apps.map(a => (
            <tr key={a._id}>
              <td>{a.student?.name}</td>
              <td>{a.student?.email}</td>
              <td><span className={`badge bg-${a.status === 'applied' ? 'secondary' : a.status === 'shortlisted' ? 'success' : 'danger'}`}>{a.status}</span></td>
              <td>{a.student?.resumeUrl ? <a href={a.student.resumeUrl} target="_blank" rel="noreferrer">Download</a> : 'None'}</td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-success"
                    disabled={a.status==='shortlisted' || workingId===a._id}
                    onClick={() => updateStatus(a._id,'shortlisted')}
                  >
                    {workingId===a._id ? 'Working…' : 'Shortlist'}
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    disabled={a.status==='rejected' || workingId===a._id}
                    onClick={() => updateStatus(a._id,'rejected')}
                  >
                    {workingId===a._id ? 'Working…' : 'Reject'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {apps.length === 0 && <div className="text-muted">No applicants yet or unauthorized.</div>}
    </div>
  );
}
