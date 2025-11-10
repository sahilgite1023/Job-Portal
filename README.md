# Job Portal

Full-featured Job Portal with Student and Recruiter roles.

## Features
- Auth (JWT) for Students & Recruiters
- Recruiters: post jobs, view own jobs, view applicants, update application status, download resumes
- Students: browse jobs, view detail, upload resume (PDF), apply, track status (applied / shortlisted / rejected)
- Secure role-based route protection
- Resume upload (Multer) served as static files
- Pagination-ready job listing logic (query params in place)

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, express-validator
- Frontend: React (Vite), React Router, Axios, Bootstrap 5
- Deployment Targets: Render (API) + MongoDB Atlas + Netlify (frontend)

## Folder Structure
```
Job Portal/
  backend/
    src/
      config/db.js
      server.js
      models/{User,Job,Application}.js
      controllers/{authController,jobController,applicationController}.js
      routes/{authRoutes,jobRoutes,applicationRoutes}.js
      middleware/{auth.js,errorHandler.js,upload.js}
    uploads/resumes/  (stored resumes)
    .env.example
    package.json
  client/
    index.html
    vite.config.js
    package.json
    src/
      main.jsx
      App.jsx
      context/AuthContext.jsx
      services/api.js
      components/{Navbar,ProtectedRoute}.jsx
      pages/*.jsx
  README.md (this file)
```

## Environment Variables
Create `backend/.env` based on `.env.example`:
```
PORT=5000
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads/resumes
```
No env needed for frontend unless you later add build-time vars.

## Backend Installation & Run (PowerShell)
```powershell
cd "backend"
npm install
cp .env.example .env   # Or manually create .env
# Edit .env with real values
npm run dev
```
Server on: http://localhost:5000
Health check: GET /

## Frontend Installation & Run (PowerShell)
```powershell
cd "client"
npm install
npm run dev
```
Frontend on: http://localhost:5173 (proxy forwards /api & /uploads to backend).

## API Summary
Base URL: /api

Auth:
- POST /api/auth/register  {name,email,password,role,company?}
- POST /api/auth/login     {email,password}
- GET  /api/auth/me        (JWT) -> current user
- POST /api/auth/resume    (JWT student) multipart/form-data resume (pdf)

Jobs:
- GET  /api/jobs           ?q=&location=&type=&page=&limit=
- GET  /api/jobs/:id
- GET  /api/jobs/me/listed (JWT recruiter) own jobs
- POST /api/jobs           (JWT recruiter) create job

Applications:
- POST /api/applications/:jobId/apply                 (JWT student)
- GET  /api/applications/my                           (JWT student) own applications
- GET  /api/applications/job/:jobId/applicants        (JWT recruiter, owner of job)
- PATCH /api/applications/:applicationId/status {status} (JWT recruiter, owner)

Statuses: applied | shortlisted | rejected

### Typical Responses
Register/Login:
```json
{ "token": "<JWT>", "user": {"id":"...","name":"...","email":"...","role":"student","resumeUrl":"/uploads/resumes/...pdf"} }
```
Job list:
```json
{ "jobs": [ {"_id":"...","title":"..."} ], "total": 12, "page":1, "pages":2 }
```
Application list:
```json
{ "applications": [ {"_id":"...","status":"applied","job": {"title":"..."}} ] }
```

## Deployment Steps
### 1. MongoDB Atlas
1. Create an Atlas cluster.
2. Create database (e.g. `jobportal`) & user with password.
3. Whitelist IP (0.0.0.0/0 for dev) or use peering/VPN for prod.
4. Copy connection string into `MONGODB_URI` (replace `<password>` and append `?retryWrites=true&w=majority`).

### 2. Deploy Backend (Render)
1. Push repo to GitHub.
2. On Render: New Web Service -> pick repo.
3. Runtime Node 18+.
4. Build Command: `npm install` (Render auto-detects) Root directory: `backend`.
5. Start Command: `npm start`.
6. Add environment variables (PORT=10000 not required; Render sets PORT, so remove or override) *Important:* keep `UPLOAD_DIR=uploads/resumes`.
7. After deploy, note the service URL, e.g. https://job-portal-api.onrender.com.
8. Update frontend proxy or set VITE env variable if you later externalize base URL (currently proxy assumes local; for production build you can change `api.js`).

Static resumes on Render: ensure directory exists; Render ephemeral disks reset on redeploy. For persistent resumes consider:
- External object storage (S3, Cloudinary) OR
- Render persistent disk (paid) mounted at /data/resumes with UPLOAD_DIR pointing there.

### 3. Deploy Frontend (Netlify)
1. In `client/services/api.js`, for production you may want:
```js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
```
2. Add `.env` in `client/` with `VITE_API_URL=https://job-portal-api.onrender.com/api` before build.
3. Netlify: New Site -> from Git.
4. Build Command: `npm run build`
5. Publish directory: `client/dist`
6. Add environment variable `VITE_API_URL`.
7. Deploy.

### 4. CORS
Set `CLIENT_ORIGIN` on backend to your Netlify site URL (e.g. https://jobportal.netlify.app).

### 5. Resume URLs in Production
If backend base is https://job-portal-api.onrender.com then resume links resolve to `https://job-portal-api.onrender.com/uploads/resumes/<file>.pdf`.

## Security & Hardening Checklist
- Use strong JWT secret + rotate periodically.
- Rate-limit auth endpoints (e.g. express-rate-limit) – not yet implemented.
- Sanitize user input further (express-validator only minimal currently).
- Move file storage to cloud storage for durability.
- Add helmet middleware & HTTPS enforcement on production.

## Testing (Suggested Next Steps)
- Add Jest tests for controllers (mock Mongoose) & integration tests with supertest.
- Cypress or Playwright for e2e flows (register -> login -> apply job -> recruiter shortlist).

## Future Enhancements
(Tracked in optional extras task)
- Password reset / email verification
- Pagination UI for jobs & applications
- Server-side sorting & filtering (salary, type)
- Notification emails (shortlisted/rejected)
- Dashboard analytics (counts, charts)
- Resume text extraction & keyword match
- Admin role for moderation
- Dark mode & improved UX

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 401 Invalid token | Expired/removed token | Log in again |
| 403 Forbidden | Role mismatch | Use correct role account |
| 413 Payload too large | Resume > 5MB | Compress or reduce size |
| ECONNREFUSED / Mongo fail | Bad URI / network | Verify Atlas URI & IP whitelist |
| Resume 404 after redeploy | Ephemeral storage | Persist or externalize storage |

## License
MIT (adjust if needed).

---
Happy building! 🚀
