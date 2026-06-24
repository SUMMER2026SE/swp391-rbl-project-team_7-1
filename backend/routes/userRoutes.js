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
  updateAdminUserStatus,

  // Public Profiles
  getPublicProfile,
  getAllFreelancers,
  getFreelancerReviews
} from '../controllers/userController.js';

import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (accessible by guest or any authenticated user)
router.get('/profile/:id', getPublicProfile);
router.get('/freelancers', getAllFreelancers);
router.get('/:freelancerId/portfolios', getFreelancerPortfolios);
router.get('/:freelancerId/reviews', getFreelancerReviews);

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

// Admin-only user management routes
router.get('/admin/dashboard', verifyAdmin, getAdminDashboard);
router.get('/admin/users', verifyAdmin, getAdminUsers);
router.patch('/admin/:userId/status', verifyAdmin, updateAdminUserStatus);
router.get('/admin', verifyAdmin, getAllUsers);
router.put('/admin/:userId/ban', verifyAdmin, banUser);
router.put('/admin/:userId/unban', verifyAdmin, unbanUser);

export default router;
