import express from 'express';
import {
  getViolations,
  getViolationDetails,
  resolveViolation,
  dismissViolation
} from '../controllers/violationController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/', getViolations);
router.get('/:id', getViolationDetails);
router.patch('/:id/resolve', resolveViolation);
router.patch('/:id/dismiss', dismissViolation);

export default router;
