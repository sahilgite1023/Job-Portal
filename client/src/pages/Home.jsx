import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero p-5 rounded-4 mb-4">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold">Land your next role faster</h1>
            <p className="lead text-muted">Discover curated opportunities, apply in one click, and track your progress with a clean dashboard.</p>
            <div className="d-flex gap-2">
              <Link to="/jobs" className="btn btn-primary btn-lg"><i className="bi bi-search me-2"></i>Browse Jobs</Link>
              <Link to="/register" className="btn btn-outline-primary btn-lg">Get Started</Link>
            </div>
          </div>
          <div className="col-lg-5 mt-4 mt-lg-0 text-center">
            <div className="card border-0 rounded-4 shadow-sm card-hover text-start">
              <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-bar-chart-fill text-primary fs-3 me-3"></i>
                <div>
                  <div className="fw-semibold">Smart Tracking</div>
                  <div className="text-muted small">Keep tabs on your applications in real-time.</div>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-file-earmark-pdf-fill text-danger fs-3 me-3"></i>
                <div>
                  <div className="fw-semibold">Upload your resume</div>
                  <div className="text-muted small">One secure place, accessible to recruiters.</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-briefcase-fill text-success fs-3 me-3"></i>
                <div>
                  <div className="fw-semibold">Quality listings</div>
                  <div className="text-muted small">New jobs added by trusted recruiters.</div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <div className="row g-3">
          {[{icon:'bi-stars',title:'Easy apply',text:'Apply with one click and let recruiters come to you.'},
            {icon:'bi-speedometer',title:'Fast',text:'Snappy interface powered by Vite + React.'},
            {icon:'bi-shield-lock',title:'Secure',text:'JWT-based auth and protected routes.'}].map((f,idx)=> (
              <div key={idx} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 card-hover">
                  <div className="card-body">
                    <i className={`bi ${f.icon} text-primary fs-4`}></i>
                    <h5 className="mt-2">{f.title}</h5>
                    <p className="text-muted mb-0">{f.text}</p>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>
    </>
  );
}
