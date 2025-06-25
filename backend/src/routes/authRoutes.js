import express from 'express';
import { 
  signup, 
  login, 
  resendVerification,
  requestPasswordReset, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;