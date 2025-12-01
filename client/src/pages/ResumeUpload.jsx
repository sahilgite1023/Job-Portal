import React, { useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [score, setScore] = useState(null);
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const { user } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (file && file.type !== 'application/pdf') { setMsg('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { setMsg('File must be <= 5MB'); return; }
    const formData = new FormData();
    formData.append('resume', file);
    try {
      setUploading(true);
      const res = await api.post('/auth/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Uploaded successfully');
      setResumeUrl(res.data?.user?.resumeUrl || null);
      setScore(typeof res.data?.atsScore === 'number' ? res.data.atsScore : null);
      setMatched(res.data?.matchedKeywords || []);
      setMissing(res.data?.missingKeywords || []);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Resume Upload</h3>
      {(resumeUrl || user?.resumeUrl) && (
        <p>Current: <a href={resumeUrl || user?.resumeUrl} target="_blank" rel="noreferrer">View Resume</a></p>
      )}
      <form onSubmit={submit}>
        <div className="mb-3">
          <input type="file" accept="application/pdf" className="form-control" onChange={e => setFile(e.target.files[0])} />
          <div className="form-text">PDF • Max 5MB</div>
        </div>
        <button className="btn btn-primary" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {msg && <div className="mt-3 alert alert-info">{msg}</div>}

      {typeof score === 'number' && (
        <div className="mt-4">
          <h5>ATS Score</h5>
          <div className="progress" style={{ height: '22px' }}>
            <div
              className={`progress-bar ${score >= 70 ? 'bg-success' : score >= 40 ? 'bg-warning' : 'bg-danger'}`}
              role="progressbar"
              style={{ width: `${score}%` }}
              aria-valuenow={score}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {score}%
            </div>
          </div>

          <div className="row mt-3 g-3">
            <div className="col-12 col-md-6">
              <h6 className="mb-2">Matched Keywords</h6>
              {matched.length === 0 ? (
                <p className="text-muted small m-0">No matches found.</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {matched.map(k => (
                    <span key={`m-${k}`} className="badge text-bg-success text-capitalize">{k}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <h6 className="mb-2">Suggestions (Add These)</h6>
              {missing.length === 0 ? (
                <p className="text-muted small m-0">Great! You covered the key terms.</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {missing.slice(0, 20).map(k => (
                    <span key={`x-${k}`} className="badge text-bg-secondary text-capitalize">{k}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
