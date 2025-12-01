import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 }).populate('createdBy', 'name email role');
  res.json({ jobs });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Remove applications by this user (as student)
  await Application.deleteMany({ student: user._id });

  // If recruiter/admin created jobs, remove their jobs and related applications
  const jobs = await Job.find({ createdBy: user._id }).select('_id');
  const jobIds = jobs.map(j => j._id);
  if (jobIds.length) {
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ _id: { $in: jobIds } });
  }

  await User.findByIdAndDelete(user._id);
  res.json({ message: 'User deleted' });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  await Application.deleteMany({ job: job._id });
  await Job.findByIdAndDelete(job._id);
  res.json({ message: 'Job deleted' });
});
