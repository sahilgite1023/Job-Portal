import express from 'express';
import { auth, permit } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get current student's notifications
router.get('/my', auth, permit('student'), asyncHandler(async (req, res) => {
  const list = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.json({ notifications: list });
}));

export default router;
