import { Router } from 'express';
import {
  getDietRecommendation,
  getWeeklyDietPlan,
  generateRecipe,
  analyzeFoodDesc,
  chatWithNutritionist
} from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/diet-recommendation', getDietRecommendation);
router.post('/weekly-diet', getWeeklyDietPlan);
router.post('/recipe-generator', generateRecipe);
router.post('/analyze-food', analyzeFoodDesc);
router.post('/chat', chatWithNutritionist);

export default router;
