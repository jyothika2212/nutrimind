import { Router } from 'express';
import { getChatHistory } from '../controllers/chat.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/history/:chatId', getChatHistory);

export default router;
