import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9); // cards per page
  const [loading, setLoading] = useState(false);

  const load = async (resetPage=false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const res = await api.get('/jobs', { params: { q, location, type, page: currentPage, limit } });
      setJobs(res.data.jobs);
      setPages(res.data.pages);
      setTotal(res.data.total);
      if(resetPage) setPage(1);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const search = (e) => { e.preventDefault(); load(true); };

  const changePage = (p) => { if(p>=1 && p<=pages && p!==page){ setPage(p); } };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h3 className="mb-0 me-3">Jobs</h3>
        <span className="text-muted small">{total} results</span>
      </div>
      <form className="row g-2 mb-4" onSubmit={search}>
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
            <input className="form-control" placeholder="Search title or company" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Location" value={location} onChange={e=> setLocation(e.target.value)} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={type} onChange={e=> setType(e.target.value)}>
            <option value="">Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Remote</option>
            <option>Contract</option>
          </select>
        </div>
        <div className="col-md-2"><button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button></div>
      </form>
      <div className="row g-3">
        {jobs.map(j => (
          <div key={j._id} className="col-md-6 col-lg-4">
            <Link to={`/jobs/${j._id}`} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{j.title}</h5>
                  <div className="text-muted small mb-2">{j.company} • {j.location}</div>
                  <span className="badge bg-info-subtle text-info-emphasis align-self-start mb-2">{j.type}</span>
                  <div className="mt-auto small text-muted">Posted {new Date(j.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {!loading && jobs.length === 0 && <div className="text-muted">No jobs found.</div>}
        {loading && <div className="text-muted">Loading...</div>}
      </div>
      {pages > 1 && (
        <nav className="mt-4">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${page===1?'disabled':''}`}><button type="button" className="page-link" onClick={()=>changePage(page-1)}>Prev</button></li>
            {Array.from({length: pages}).map((_,i)=>(
              <li key={i} className={`page-item ${page===i+1?'active':''}`}>
                <button type="button" className="page-link" onClick={()=>changePage(i+1)}>{i+1}</button>
              </li>
            ))}
            <li className={`page-item ${page===pages?'disabled':''}`}><button type="button" className="page-link" onClick={()=>changePage(page+1)}>Next</button></li>
          </ul>
        </nav>
      )}
    </div>
  );
}
