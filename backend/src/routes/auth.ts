import express from 'express';
import type { Router } from 'express';
import {
  googleAuth,
  googleAuthCallback,
  logoutHandler,
} from '@/controllers/auth';

const router: Router = express.Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.post('/logout', logoutHandler);

export default router;
