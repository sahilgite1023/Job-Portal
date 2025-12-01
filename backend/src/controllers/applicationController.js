import { asyncHandler } from '../middleware/errorHandler.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { sendEmail } from '../utils/emailService.js';

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

  // If shortlisted, notify the candidate by email (gracefully handle errors)
  if (status === 'shortlisted') {
    try {
      const populated = await Application.findById(app._id)
        .populate('student', 'name email')
        .populate('job', 'title company');
      const candidateName = populated.student?.name || 'Candidate';
      const candidateEmail = populated.student?.email;
      const jobTitle = populated.job?.title || 'the position';
      const companyName = populated.job?.company || 'the company';

      if (candidateEmail) {
        const subject = `Shortlisted for ${jobTitle} at ${companyName}`;
        const text = `Dear ${candidateName},\n\nWe are pleased to inform you that you have been shortlisted for the position of ${jobTitle}.\n\nAfter reviewing your profile and resume, our hiring panel believes that you are a strong match for this opportunity.\nYou will receive further details regarding the next interview steps shortly.\n\nCongratulations once again, and we wish you success ahead.\n\nWarm regards,\nRecruitment Team\n${companyName}`;
        const html = `<p>Dear ${candidateName},</p>
<p>We are pleased to inform you that you have been shortlisted for the position of <strong>${jobTitle}</strong>.</p>
<p>After reviewing your profile and resume, our hiring panel believes that you are a strong match for this opportunity.<br/>You will receive further details regarding the next interview steps shortly.</p>
<p>Congratulations once again, and we wish you success ahead.</p>
<p>Warm regards,<br/>Recruitment Team<br/>${companyName}</p>`;
        await sendEmail({ to: candidateEmail, subject, text, html });
      }
    } catch (mailErr) {
      // Log and continue without failing the status update
      console.error('Email sending failed:', mailErr?.message || mailErr);
    }
  }
  res.json({ application: app });
});
