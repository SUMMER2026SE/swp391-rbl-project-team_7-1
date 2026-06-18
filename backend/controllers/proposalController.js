import { listProposals, moderateProposalStatus, acceptProposalAndCreateContract } from '../services/proposalService.js';

const isValidIntegerId = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0;
};

export const getProposals = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      projectId: req.query.projectId,
      freelancerId: req.query.freelancerId,
      employerId: req.query.employerId,
      search: req.query.search,
      limit: req.query.limit || 25,
      offset: req.query.offset || 0
    };

    const result = await listProposals(filters);
    res.json({ success: true, total: result.total, proposals: result.proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ message: 'Failed to fetch proposals.' });
  }
};

export const patchProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!isValidIntegerId(id)) {
      return res.status(400).json({ message: 'Invalid proposal id.' });
    }

    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const result = await moderateProposalStatus(id, status, userId);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.json({ success: true, proposalId: result.data.proposalId, status: result.data.status });
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ message: 'Failed to update proposal status.' });
  }
};

export const postAcceptProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!isValidIntegerId(id)) {
      return res.status(400).json({ message: 'Invalid proposal id.' });
    }

    const result = await acceptProposalAndCreateContract(id, userId);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    res.status(201).json({ success: true, contract: result.data });
  } catch (error) {
    console.error('Error accepting proposal:', error);
    res.status(500).json({ message: 'Failed to accept proposal.' });
  }
};
