import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import {
  getReports,
  getReportById,
  patchResolveReport,
  patchDismissReport,
  patchReviewReport,
  patchReopenReport,
  createReport,
  getMyReports,
  addEvidence
} from '../controllers/reportController.js';

const router = express.Router();

/**
 * Report Routes
 * 
 * Standardized API contract:
 * 
 * PUBLIC (authenticated):
 *   POST   /api/v1/reports                     - Submit report
 *   GET    /api/v1/reports/my                  - Get my reports
 *   POST   /api/v1/reports/:id/evidence        - Add evidence to report
 * 
 * ADMIN ONLY:
 *   GET    /api/v1/admin/reports               - List all reports
 *   GET    /api/v1/admin/reports/:id           - Report detail
 *   PATCH  /api/v1/admin/reports/:id/resolve   - Resolve
 *   PATCH  /api/v1/admin/reports/:id/dismiss   - Dismiss
 *   PATCH  /api/v1/admin/reports/:id/review    - Under review
 *   PATCH  /api/v1/admin/reports/:id/reopen    - Reopen
 */

// ========== PUBLIC (authenticated) ==========

// POST /api/v1/reports - Submit a new report
router.post('/', verifyToken, createReport);

// GET /api/v1/reports/my - Get current user's reports
router.get('/my', verifyToken, getMyReports);

// POST /api/v1/reports/:id/evidence - Add evidence
router.post('/:id/evidence', verifyToken, addEvidence);

// ========== ADMIN ONLY ==========

// GET /api/v1/admin/reports - List all reports
router.get('/', verifyToken, verifyAdmin, getReports);

// GET /api/v1/admin/reports/:id - Get report detail
router.get('/:id', verifyToken, verifyAdmin, getReportById);

// PATCH /api/v1/admin/reports/:id/resolve - Resolve report
router.patch('/:id/resolve', verifyToken, verifyAdmin, patchResolveReport);

// PATCH /api/v1/admin/reports/:id/dismiss - Dismiss report
router.patch('/:id/dismiss', verifyToken, verifyAdmin, patchDismissReport);

// PATCH /api/v1/admin/reports/:id/review - Mark as under review
router.patch('/:id/review', verifyToken, verifyAdmin, patchReviewReport);

// PATCH /api/v1/admin/reports/:id/reopen - Reopen report
router.patch('/:id/reopen', verifyToken, verifyAdmin, patchReopenReport);

export default router;