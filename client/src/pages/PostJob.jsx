import React, { useMemo, useState } from 'react';
import api from '../services/api.js';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salaryRange: '', description: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const validators = useMemo(() => ({
    title: (v) => v.trim().length >= 3 || 'Title must be at least 3 characters',
    company: (v) => v.trim().length >= 2 || 'Company is required',
    location: (v) => v.trim().length >= 2 || 'Location is required',
    salaryRange: (v) => (v.trim() === '' || /\d/.test(v)) || 'Include at least one number',
    description: (v) => v.trim().length >= 30 || 'Description must be at least 30 characters',
  }), []);

  const errors = useMemo(() => ({
    title: validators.title(form.title) === true ? '' : validators.title(form.title),
    company: validators.company(form.company) === true ? '' : validators.company(form.company),
    location: validators.location(form.location) === true ? '' : validators.location(form.location),
    salaryRange: validators.salaryRange(form.salaryRange) === true ? '' : validators.salaryRange(form.salaryRange),
    description: validators.description(form.description) === true ? '' : validators.description(form.description),
  }), [form, validators]);

  const formValid = !errors.title && !errors.company && !errors.location && !errors.description && !errors.salaryRange;

  const submit = async (e) => {
    e.preventDefault();
    if (!formValid) { setError('Please fix the errors'); return; }
    setSubmitting(true);
    try {
      const res = await api.post('/jobs', form);
      navigate(`/recruiter/jobs/${res.data.job._id}/applicants`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to post job');
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <h3>Post Job</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title</label>
            <input className={`form-control ${errors.title? 'is-invalid': (form.title? 'is-valid':'')}`} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Company</label>
            <input className={`form-control ${errors.company? 'is-invalid': (form.company? 'is-valid':'')}`} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required />
            {errors.company && <div className="invalid-feedback">{errors.company}</div>}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Location</label>
            <input className={`form-control ${errors.location? 'is-invalid': (form.location? 'is-valid':'')}`} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Salary Range</label>
            <input className={`form-control ${errors.salaryRange? 'is-invalid': (form.salaryRange? 'is-valid':'')}`} placeholder="e.g. 50k-70k" value={form.salaryRange} onChange={e => setForm({ ...form, salaryRange: e.target.value })} />
            {errors.salaryRange && <div className="invalid-feedback">{errors.salaryRange}</div>}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className={`form-control ${errors.description? 'is-invalid': (form.description? 'is-valid':'')}`} rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        <button className="btn btn-primary" disabled={!formValid || submitting}>{submitting ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
  );
}
