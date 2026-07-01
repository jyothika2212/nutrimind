import { Router } from 'express';
import { searchFoods, getFoodCategories, createFoodItem } from '../controllers/food.controller';
import { authenticateJWT, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/search', searchFoods);
router.get('/categories', getFoodCategories);
router.post('/create', restrictTo('Admin'), createFoodItem);

export default router;
