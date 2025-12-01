import express from 'express';
import { auth, permit } from '../middleware/auth.js';
import { getAllUsers, getAllJobs, deleteUser, deleteJob } from '../controllers/adminController.js';

const router = express.Router();

router.use(auth, permit('admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllJobs);
router.delete('/users/:id', deleteUser);
router.delete('/jobs/:id', deleteJob);

export default router;
