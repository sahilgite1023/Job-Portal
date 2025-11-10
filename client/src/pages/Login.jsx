import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validators = useMemo(() => ({
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email',
    password: (v) => v.length >= 6 || 'Password required',
  }), []);

  const errors = useMemo(() => ({
    email: validators.email(form.email) === true ? '' : validators.email(form.email),
    password: validators.password(form.password) === true ? '' : validators.password(form.password),
  }), [form, validators]);

  const formValid = !errors.email && !errors.password;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return setError('Please fix the errors');
    setSubmitting(true);
    const ok = await login(form.email, form.password);
    if (!ok) setError('Invalid credentials');
    else navigate(user?.role === 'recruiter' ? '/recruiter/dashboard' : '/student/dashboard');
    setSubmitting(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h3>Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group has-validation">
              <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
              <input className={`form-control ${errors.email? 'is-invalid': (form.email? 'is-valid':'')}`} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group has-validation">
              <span className="input-group-text bg-white"><i className="bi bi-shield-lock"></i></span>
              <input className={`form-control ${errors.password? 'is-invalid': (form.password? 'is-valid':'')}`} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </div>
          <button className="btn btn-primary" disabled={!formValid || submitting}>{submitting ? 'Please wait...' : 'Login'}</button>
          <span className="ms-3">No account? <Link to="/register">Register</Link></span>
        </form>
      </div>
    </div>
  );
}
