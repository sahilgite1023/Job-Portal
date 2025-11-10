import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { login, register, me, uploadResume } from '../controllers/authController.js';
import { resumeUpload } from '../middleware/upload.js';

const router = Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
  body('role').isIn(['student', 'recruiter']).withMessage('Invalid role'),
  body('company').if(body('role').equals('recruiter')).trim().isLength({ min: 2 }).withMessage('Company is required for recruiters')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.get('/me', auth, me);

router.post('/resume', auth, resumeUpload.single('resume'), uploadResume);

export default router;
