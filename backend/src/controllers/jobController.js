import { validationResult } from 'express-validator';
import Job from '../models/Job.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, company, location, type, salaryRange, description } = req.body;
  const job = await Job.create({ title, company, location, type, salaryRange, description, createdBy: req.user.id });
  res.status(201).json({ job });
});

export const getJobs = asyncHandler(async (req, res) => {
  const { q, location, type, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { company: new RegExp(q, 'i') } ];
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Job.countDocuments(filter)
  ]);
  res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ job });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json({ jobs });
});
