import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { submitVote } from '../controllers/votes.controller';

const router = Router();

router.post('/', authenticate, submitVote);

export default router;
