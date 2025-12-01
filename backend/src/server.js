import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import morgan from 'morgan'; // it show api request in console 
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(express.json());
console.log('Booting Job Portal API server...');

const rawOrigins = process.env.CORS_ORIGINS || process.env.CLIENT_ORIGIN || '';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // non-browser requests
    if (allowedOrigins.includes('*')) return cb(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(morgan('dev'));
console.log('Middlewares initialized. Registering routes...');

// static for resumes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads/resumes', express.static(path.join(__dirname, '../uploads/resumes')));
import { verifyEmailTransport } from './utils/emailService.js';

app.get('/', (req, res) => res.json({ message: 'Job Portal API' }));
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));
app.get('/api/health/email', async (req, res) => {
  try {
    await verifyEmailTransport();
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'SMTP not ready' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

connectDB(MONGODB_URI).then(() => {
  console.log('DB connected. Starting HTTP server...');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
