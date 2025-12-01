import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const genToken = (user) => jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role, company } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role, company });
  const token = genToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = genToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, resumeUrl: user.resumeUrl } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Resume file required (PDF)' });

  const resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`;

  // === ATS Resume Scoring ===
  // 1) Load PDF text
  let text = '';
  try {
    const buffer = await fs.readFile(req.file.path);
    const parsed = await pdfParse(buffer);
    text = (parsed.text || '').toLowerCase();
  } catch (err) {
    // If parsing fails, proceed with score 0
    text = '';
  }

  // 2) Build keyword set (job-specific if jobId provided, else common set)
  const COMMON_KEYWORDS = [
    'javascript','react','node','express','mongodb','mongoose','rest','api','html','css','bootstrap','git','github','jwt','oauth','typescript','vite','redux','hooks','sql','nosql','docker','aws','netlify','render','unit testing','jest','cypress','vercel','agile'
  ];

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const extractJobKeywords = (job) => {
    if (!job) return [];
    const base = `${job.title || ''} ${job.company || ''} ${job.location || ''} ${job.type || ''} ${job.description || ''}`.toLowerCase();
    const tokens = base.match(/[a-zA-Z+#.][a-zA-Z0-9.+#-]+/g) || [];
    const set = Array.from(new Set(tokens)).filter(t => t.length > 2);
    return set.slice(0, 60);
  };

  let keywords = COMMON_KEYWORDS;
  let keywordSource = 'common';
  const jobId = req.query.jobId;
  if (jobId) {
    try {
      const job = await Job.findById(jobId).lean();
      const jobKeywords = extractJobKeywords(job);
      if (jobKeywords.length) { keywords = jobKeywords; keywordSource = 'job'; }
    } catch { /* ignore */ }
  }

  const matchedKeywords = [];
  for (const kwRaw of keywords) {
    const kw = kwRaw.toLowerCase().trim();
    const pattern = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
    if (pattern.test(text)) matchedKeywords.push(kw);
  }
  const total = keywords.length || 1;
  const uniqueMatched = Array.from(new Set(matchedKeywords));
  const missingKeywords = keywords.filter(k => !uniqueMatched.includes(k.toLowerCase()));
  const atsScore = Math.round((uniqueMatched.length / total) * 100);

  // Persist resumeUrl and atsScore on user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { resumeUrl, atsScore },
    { new: true }
  ).select('-password');

  res.json({
    message: 'Resume uploaded',
    user,
    atsScore,
    matchedKeywords: uniqueMatched,
    missingKeywords,
    totalKeywords: total,
    keywordSource
  });
});
