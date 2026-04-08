import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getVotes, submitVote } from '../controllers/votes.controller';

const router = Router();

router.get('/', authenticate, getVotes);
router.post('/', authenticate, submitVote);

export default router;
