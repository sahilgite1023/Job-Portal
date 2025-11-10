import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', company: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(() => ({
    name: (v) => v.trim().length >= 2 || 'Name must be at least 2 characters',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
    password: (v) => (v.length >= 8 && /\d/.test(v)) || 'Min 8 chars and include a number',
    company: (v, role) => (role !== 'recruiter' || v.trim().length >= 2) || 'Company is required for recruiters',
  }), []);

  const errors = useMemo(() => ({
    name: validators.name(form.name) === true ? '' : validators.name(form.name),
    email: validators.email(form.email) === true ? '' : validators.email(form.email),
    password: validators.password(form.password) === true ? '' : validators.password(form.password),
    company: validators.company(form.company, form.role) === true ? '' : validators.company(form.company, form.role),
  }), [form, validators]);

  const formValid = useMemo(() => {
    const baseValid = !errors.name && !errors.email && !errors.password;
    if (form.role === 'recruiter') return baseValid && !errors.company;
    return baseValid;
  }, [errors, form.role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return setError('Please fix the errors in the form');
    setSubmitting(true);
    const ok = await register(form);
    if (!ok) setError('Registration failed');
    else navigate(form.role === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard');
    setSubmitting(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <h3>Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name</label>
              <input className={`form-control ${errors.name? 'is-invalid': (form.name? 'is-valid':'')}`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                <input className={`form-control ${errors.email? 'is-invalid': (form.email? 'is-valid':'')}`} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-white"><i className="bi bi-shield-lock"></i></span>
                <input className={`form-control ${errors.password? 'is-invalid': (form.password? 'is-valid':'')}`} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 chars, 1 number" required />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>
          {form.role === 'recruiter' && (
            <div className="mb-3">
              <label className="form-label">Company</label>
              <input className={`form-control ${errors.company? 'is-invalid': (form.company? 'is-valid':'')}`} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              {errors.company && <div className="invalid-feedback">{errors.company}</div>}
            </div>
          )}
          <button className="btn btn-primary" disabled={!formValid || submitting}>{submitting ? 'Please wait...' : 'Register'}</button>
          <span className="ms-3">Have an account? <Link to="/login">Login</Link></span>
        </form>
      </div>
    </div>
  );
}
