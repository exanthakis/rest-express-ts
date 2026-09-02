import express from 'express';
import type { Router } from 'express';
import authRoutes from '@/routes/auth';

const router: Router = express.Router();

router.use('/auth', authRoutes);

export default router;
