import React, { useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const { user } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (file && file.type !== 'application/pdf') { setMsg('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { setMsg('File must be <= 5MB'); return; }
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post('/auth/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Uploaded successfully');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div>
      <h3>Resume Upload</h3>
      {user?.resumeUrl && <p>Current: <a href={user.resumeUrl} target="_blank" rel="noreferrer">View Resume</a></p>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <input type="file" accept="application/pdf" className="form-control" onChange={e => setFile(e.target.files[0])} />
          <div className="form-text">PDF • Max 5MB</div>
        </div>
        <button className="btn btn-primary" disabled={!file}>Upload</button>
      </form>
      {msg && <div className="mt-3 alert alert-info">{msg}</div>}
    </div>
  );
}
