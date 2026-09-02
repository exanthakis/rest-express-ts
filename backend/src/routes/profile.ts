import express from 'express';
import type { Router } from 'express';
import { getProfile } from '@/controllers/profile';

const router: Router = express.Router();

router.get('/', getProfile);

export default router;
