import express from 'express';
import { register, verifyEmail, login, forgotPassword, resendOtp, googleAuth } from '../controllers/authController.js';

const router = express.Router();

// Authentication Endpoints
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', resendOtp);
router.post('/google', googleAuth);


export default router;

