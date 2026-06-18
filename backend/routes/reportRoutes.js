import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
import { getReports, getReportById, patchResolveReport, patchDismissReport } from '../controllers/reportController.js';

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get('/', getReports);
router.get('/:id', getReportById);
router.patch('/:id/resolve', patchResolveReport);
router.patch('/:id/dismiss', patchDismissReport);

export default router;
