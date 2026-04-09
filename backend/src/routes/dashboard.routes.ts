import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getDashboard, getChart } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', authenticate, getDashboard);
router.get('/chart/:coinId', authenticate, getChart);

export default router;
