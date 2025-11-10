import { Router } from 'express';
import { body } from 'express-validator';
import { auth, permit } from '../middleware/auth.js';
import { createJob, getJobs, getJobById, getMyJobs } from '../controllers/jobController.js';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/me/listed', auth, permit('recruiter'), getMyJobs);
router.post('/', auth, permit('recruiter'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('company').trim().isLength({ min: 2 }).withMessage('Company is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('description').trim().isLength({ min: 30 }).withMessage('Description must be at least 30 characters')
], createJob);

export default router;
