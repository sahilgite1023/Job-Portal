import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto pt-5 pb-4 bg-body-tertiary border-top">
      <div className="container">
        <div className="row g-4">
          {/* Brand / Mission */}
          <div className="col-12 col-md-4">
            <h5 className="fw-semibold mb-2">JobPortal</h5>
            <p className="text-muted small mb-3">
              Helping students discover opportunities and enabling recruiters to hire faster.
            </p>
            <div className="d-flex gap-3">
              <a href="/" className="text-decoration-none text-muted small">Privacy</a>
              <a href="/" className="text-decoration-none text-muted small">Terms</a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-semibold mb-2">Explore</h6>
            <ul className="list-unstyled small m-0">
              <li><Link to="/jobs" className="text-decoration-none text-muted">Jobs</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted">Login</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted">Register</Link></li>
            </ul>
          </div>
          {/* Resources */}
          <div className="col-6 col-md-2">
            <h6 className="fw-semibold mb-2">Resources</h6>
            <ul className="list-unstyled small m-0">
              <li><a href="#" className="text-decoration-none text-muted">Guides</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Support</a></li>
              <li><a href="#" className="text-decoration-none text-muted">FAQ</a></li>
            </ul>
          </div>
          {/* Contact */}
            <div className="col-12 col-md-4">
              <h6 className="fw-semibold mb-2">Contact</h6>
              <p className="small text-muted mb-1">Email: support@jobportal.example</p>
              <p className="small text-muted mb-3">We respond within 24 hours.</p>
              <div className="d-flex gap-3">
                <a href="#" aria-label="GitHub" className="text-reset"><i className="bi bi-github fs-5"></i></a>
                <a href="#" aria-label="LinkedIn" className="text-reset"><i className="bi bi-linkedin fs-5"></i></a>
                <a href="#" aria-label="Twitter" className="text-reset"><i className="bi bi-twitter fs-5"></i></a>
              </div>
            </div>
        </div>
        <hr className="my-4" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="small text-muted">© {year} JobPortal. All rights reserved.</div>
          <div className="d-flex gap-3 small">
            <a href="#" className="text-decoration-none text-muted">Status</a>
            <a href="#" className="text-decoration-none text-muted">API</a>
            <a href="#" className="text-decoration-none text-muted">Changelog</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
