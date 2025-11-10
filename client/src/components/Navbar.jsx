import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const handleLogout = () => { logout(); navigate('/'); };

  const themeClass = theme === 'dark' ? 'navbar-dark' : 'navbar-light';
  return (
    <nav className={`navbar navbar-expand-lg ${themeClass} bg-body border-bottom shadow-sm sticky-top`}>
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">JobPortal<span className="brand-dot">.</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/jobs">Jobs</NavLink></li>
            {user?.role === 'student' && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/student/dashboard">Dashboard</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/student/applications">Applications</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/student/resume">Resume</NavLink></li>
              </>
            )}
            {user?.role === 'recruiter' && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/recruiter/dashboard">Recruiter</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/recruiter/post-job">Post Job</NavLink></li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item me-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={toggle} aria-label="Toggle theme">
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
            </li>
            {!user ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            ) : (
              <>
                <li className="nav-item"><span className="navbar-text me-2">Hi, {user.name}</span></li>
                <li className="nav-item"><button className="btn btn-outline-danger btn-sm" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
