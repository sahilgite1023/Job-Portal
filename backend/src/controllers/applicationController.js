import { asyncHandler } from '../middleware/errorHandler.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const app = await Application.create({ job: jobId, student: req.user.id });
  res.status(201).json({ application: app });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ student: req.user.id }).populate('job');
  res.json({ applications: apps });
});

export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (String(job.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  const apps = await Application.find({ job: jobId }).populate('student', '-password');
  res.json({ applications: apps });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // shortlisted | rejected | applied
  const app = await Application.findById(req.params.applicationId).populate('job');
  if (!app) return res.status(404).json({ message: 'Application not found' });
  if (String(app.job.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  app.status = status;
  await app.save();
  res.json({ application: app });
});
