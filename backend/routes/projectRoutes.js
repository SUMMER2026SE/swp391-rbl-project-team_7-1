import express from 'express';
import { 
  createProject, 
  updateProject, 
  closeProject, 
  getProjects, 
  getProjectById, 
  getEmployerProjects 
} from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes (Requires login)
router.use(verifyToken);
router.post('/', createProject);
router.get('/my/employer-projects', getEmployerProjects);
router.put('/:id', updateProject);
router.put('/:id/close', closeProject);

export default router;
