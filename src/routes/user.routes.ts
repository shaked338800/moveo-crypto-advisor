import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { savePreferences, getMe } from '../controllers/user.controller';

const router = Router();

router.get('/me', authenticate, getMe);
router.post('/preferences', authenticate, savePreferences);

export default router;
