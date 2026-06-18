import React, { useEffect, useState } from 'react';
import { proposalService } from '../../services/proposalService';

const STATUS_OPTIONS = ['ALL', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'CANCELED'];

const getBadgeClass = (status) => {
  switch (status) {
    case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'SHORTLISTED': return 'bg-sky-50 text-sky-700 border border-sky-100';
    case 'REJECTED': return 'bg-red-50 text-red-700 border border-red-100';
    case 'WITHDRAWN': return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'CANCELED': return 'bg-slate-50 text-slate-700 border border-slate-100';
    default: return 'bg-slate-50 text-slate-700 border border-slate-100';
  }
};

export default function ProposalModeration() {
  const [proposals, setProposals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchProposals = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response = await proposalService.getAdminProposals(params);
      setProposals(response.proposals || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load proposals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (proposalId, status) => {
    const confirmation = window.confirm(`Are you sure you want to set proposal ${proposalId} to ${status}?`);
    if (!confirmation) return;

    try {
      setProcessingId(proposalId);
      await proposalService.updateProposalModerationStatus(proposalId, status);
      setMessage(`Proposal ${proposalId} updated to ${status}.`);
      fetchProposals();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update proposal.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAccept = async (proposalId) => {
    const confirmation = window.confirm(`Accept proposal ${proposalId} and create contract?`);
    if (!confirmation) return;

    try {
      setProcessingId(proposalId);
      await proposalService.acceptProposal(proposalId);
      setMessage(`Proposal ${proposalId} accepted and contract created.`);
      fetchProposals();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to accept proposal.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Proposal Moderation</h1>
              <p className="mt-1 text-sm text-slate-600">Review, shortlist, reject, or accept freelancer proposals.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {(message || error) && (
            <div className={`mt-6 rounded-xl px-4 py-3 text-sm ${message ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
              {message || error}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Project</th>
                <th className="px-4 py-4">Freelancer</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Delivery</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">Loading proposals...</td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">No proposals found.</td>
                </tr>
              ) : proposals.map((proposal) => (
                <tr key={proposal.proposal_id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{proposal.proposal_id}</td>
                  <td className="px-4 py-4 text-slate-700 max-w-[240px] truncate">{proposal.project_title}</td>
                  <td className="px-4 py-4 text-slate-700">{proposal.freelancer_name}</td>
                  <td className="px-4 py-4 text-slate-700">{proposal.proposed_price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{proposal.delivery_time_days || '-'}d</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                        onClick={() => handleStatusChange(proposal.proposal_id, 'SHORTLISTED')}
                        className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >Shortlist</button>
                      <button
                        disabled={processingId === proposal.proposal_id || proposal.status === 'REJECTED'}
                        onClick={() => handleStatusChange(proposal.proposal_id, 'REJECTED')}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >Reject</button>
                      <button
                        disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                        onClick={() => handleAccept(proposal.proposal_id)}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >Accept</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
