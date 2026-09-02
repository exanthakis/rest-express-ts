import express from 'express';
import type { Router } from 'express';
import { googleAuth, googleAuthCallback } from '@/controllers/auth';

const router: Router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

export default router;
