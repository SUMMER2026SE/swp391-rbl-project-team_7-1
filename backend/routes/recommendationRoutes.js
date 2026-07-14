import express from 'express';
import { getProjectRecommendations } from '../controllers/recommendationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/projects/:projectId/recommendations', getProjectRecommendations);

export default router;