import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
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
  const user = await User.findByIdAndUpdate(req.user.id, { resumeUrl: `/${req.file.path.replace(/\\/g, '/')}` }, { new: true }).select('-password');
  res.json({ message: 'Resume uploaded', user });
});
