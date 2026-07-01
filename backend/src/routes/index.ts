import { Router } from 'express';
import authRoutes from './auth.routes';
import progressRoutes from './progress.routes';
import foodRoutes from './food.routes';
import dietitianRoutes from './dietitian.routes';
import aiRoutes from './ai.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/progress', progressRoutes);
router.use('/food', foodRoutes);
router.use('/dietitian', dietitianRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

// Simple healthcheck
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
