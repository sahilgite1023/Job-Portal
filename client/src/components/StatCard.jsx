import React from 'react';

export default function StatCard({ title, value, icon, variant = 'primary', subtext }) {
  return (
    <div className={`card kpi-card border-0 card-hover h-100`}> 
      <div className="card-body d-flex align-items-center">
        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3`} style={{width:48,height:48, background:`rgba(13,110,253,.08)`}}>
          <i className={`bi ${icon || 'bi-graph-up'} text-${variant}`} />
        </div>
        <div>
          <div className="text-muted small">{title}</div>
          <div className="fs-4 fw-semibold">{value}</div>
          {subtext && <div className="small text-muted">{subtext}</div>}
        </div>
      </div>
    </div>
  );
}
