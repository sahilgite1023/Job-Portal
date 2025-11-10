import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus } from '../controllers/applicationController.js';

const router = Router();

router.post('/:jobId/apply', auth, permit('student'), applyToJob);
router.get('/my', auth, permit('student'), getMyApplications);
router.get('/job/:jobId/applicants', auth, permit('recruiter'), getApplicantsForJob);
router.patch('/:applicationId/status', auth, permit('recruiter'), updateApplicationStatus);

export default router;
