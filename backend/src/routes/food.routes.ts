import { Router } from 'express';
import { searchFoods, getFoodCategories, createFoodItem, getRecipes } from '../controllers/food.controller';
import { authenticateJWT, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/search', searchFoods);
router.get('/categories', getFoodCategories);
router.get('/recipes', getRecipes);
router.post('/create', restrictTo('Admin'), createFoodItem);

export default router;
