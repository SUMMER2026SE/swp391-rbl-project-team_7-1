import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getProposals, patchProposalStatus, postAcceptProposal } from '../controllers/proposalController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getProposals);
router.patch('/:id/status', patchProposalStatus);
router.post('/:id/accept', postAcceptProposal);

export default router;
