import { Router } from 'express';
import {
  getDietitians,
  assignDietitian,
  getClients,
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  createMealPlan,
  getMealPlans
} from '../controllers/dietitian.controller';
import { authenticateJWT, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

// Client-facing routes
router.get('/list', getDietitians);
router.post('/assign', assignDietitian);
router.post('/appointment', createAppointment);
router.get('/appointments', getAppointments);
router.get('/mealplans', getMealPlans);

// Dietitian/Nutritionist restricted routes
router.get('/clients', restrictTo('Dietitian', 'Nutritionist'), getClients);
router.post('/appointment/:id/status', restrictTo('Dietitian', 'Nutritionist', 'Admin'), updateAppointmentStatus);
router.post('/mealplan', restrictTo('Dietitian', 'Nutritionist'), createMealPlan);

export default router;
