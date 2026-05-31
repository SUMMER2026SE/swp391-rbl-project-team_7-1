import express from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;
