import React from 'react';

export default function Footer(){
  return (
    <footer className="mt-5 py-4 text-center text-muted">
      <div className="container">
        <div className="small mb-2">Founders: <strong>Sahil Gite</strong> &amp; <strong>Anushka Shinde</strong></div>
        <div className="d-flex gap-4 justify-content-center mb-2 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span className="small fw-semibold">Sahil:</span>
            <a className="text-reset" href="#" target="_blank" rel="noopener noreferrer" aria-label="Sahil GitHub"><i className="bi bi-github"></i></a>
            <a className="text-reset" href="#" target="_blank" rel="noopener noreferrer" aria-label="Sahil LinkedIn"><i className="bi bi-linkedin"></i></a>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small fw-semibold">Anushka:</span>
            <a className="text-reset" href="#" target="_blank" rel="noopener noreferrer" aria-label="Anushka GitHub"><i className="bi bi-github"></i></a>
            <a className="text-reset" href="#" target="_blank" rel="noopener noreferrer" aria-label="Anushka LinkedIn"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
        <div className="small">© {new Date().getFullYear()} JobPortal</div>
      </div>
    </footer>
  );
}
