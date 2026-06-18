import express from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount, getAllUsers, banUser, unbanUser, getAdminDashboard, getAdminUsers, updateAdminUserStatus } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

// Admin-only user management routes
router.get('/admin/dashboard', verifyAdmin, getAdminDashboard);
router.get('/admin/users', verifyAdmin, getAdminUsers);
router.patch('/admin/:userId/status', verifyAdmin, updateAdminUserStatus);
router.get('/admin', verifyAdmin, getAllUsers);
router.put('/admin/:userId/ban', verifyAdmin, banUser);
router.put('/admin/:userId/unban', verifyAdmin, unbanUser);

export default router;
