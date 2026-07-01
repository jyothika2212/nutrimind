import { Router } from 'express';
import {
  getProgressByDate,
  logMeal,
  logWater,
  logWorkout,
  logVitals,
  getProgressHistory
} from '../controllers/progress.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/today', getProgressByDate);
router.post('/meal', logMeal);
router.post('/water', logWater);
router.post('/workout', logWorkout);
router.post('/vitals', logVitals);
router.get('/history', getProgressHistory);

export default router;
