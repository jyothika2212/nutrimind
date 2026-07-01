import { Router } from 'express';
import {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser
} from '../controllers/admin.controller';
import { authenticateJWT, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);
router.use(restrictTo('Admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.post('/user/role', updateUserRole);
router.delete('/user/:id', deleteUser);

export default router;
