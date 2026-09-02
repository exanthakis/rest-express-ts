import express from 'express';
import type { Router } from 'express';
import authRoutes from '@/routes/auth';
import profileRoutes from '@/routes/profile';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

export default router;
