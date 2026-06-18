import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
  banUser,
  unbanUser,

  // Portfolio
  getMyPortfolios,
  getFreelancerPortfolios,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,

  // Admin
  getAdminDashboard,
  getAdminUsers,
  updateAdminUserStatus
} from '../controllers/userController.js';

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

// Portfolio CRUD routes
router.get('/profile/portfolios', getMyPortfolios);
router.post('/profile/portfolios', addPortfolio);
router.put('/profile/portfolios/:portfolioId', updatePortfolio);
router.delete('/profile/portfolios/:portfolioId', deletePortfolio);

// Public route to get a freelancer's portfolios (unprotected by token or verified separately)
router.get('/:freelancerId/portfolios', getFreelancerPortfolios);

// Admin-only user management routes
router.get('/admin/dashboard', verifyAdmin, getAdminDashboard);
router.get('/admin/users', verifyAdmin, getAdminUsers);
router.patch('/admin/:userId/status', verifyAdmin, updateAdminUserStatus);
router.get('/admin', verifyAdmin, getAllUsers);
router.put('/admin/:userId/ban', verifyAdmin, banUser);
router.put('/admin/:userId/unban', verifyAdmin, unbanUser);

export default router;
