import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  requestOtp,
  verifyOtp,
  saveProfileDetails,
  googleAuthMock
} from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/otp-request', requestOtp);
router.post('/otp-verify', verifyOtp);
router.post('/google-mock', googleAuthMock);
router.post('/profile-details', authenticateJWT, saveProfileDetails);

export default router;
