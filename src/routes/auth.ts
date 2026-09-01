import express from 'express';
import type { Router } from 'express';
import { googleAuth } from '@/controllers/auth';

const router: Router = express.Router();

router.get('/google', googleAuth);

export default router;
