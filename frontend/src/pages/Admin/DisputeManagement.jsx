import React, { useEffect, useMemo, useState } from 'react';
import { disputeService } from '../../services/disputeService';

const STATUS_OPTIONS = ['ALL', 'OPEN', 'RESOLVED', 'CLOSED'];
const DECISION_OPTIONS = ['REFUND_EMPLOYER', 'PAY_FREELANCER', 'SPLIT_PAYMENT', 'NO_ACTION'];

const badgeClasses = {
  OPEN: 'bg-amber-50 text-amber-700 border border-amber-100',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  CLOSED: 'bg-slate-50 text-slate-700 border border-slate-100'
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function DisputeManagement() {
  const [disputes, setDisputes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [decisionMap, setDecisionMap] = useState({});

  const loadDisputes = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const params = statusFilter === 'ALL' ? {} : { status: statusFilter };
      const response = await disputeService.getAdminDisputes(params);
      setDisputes(response.disputes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách tranh chấp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const hasActionableOpen = useMemo(() => disputes.some((dispute) => dispute.status === 'OPEN'), [disputes]);

  const handleDecisionChange = (id, value) => {
    setDecisionMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleResolve = async (disputeId) => {
    const selectedDecision = decisionMap[disputeId];
    if (!selectedDecision) {
      setError('Vui lòng chọn quyết định trước khi giải quyết tranh chấp.');
      return;
    }

    if (!window.confirm(`Xác nhận giải quyết tranh chấp #${disputeId} với quyết định ${selectedDecision}?`)) {
      return;
    }

    setActionLoading(disputeId);
    setError('');
    setSuccess('');

    try {
      await disputeService.resolveDispute(disputeId, selectedDecision);
      setSuccess(`Tranh chấp #${disputeId} đã được giải quyết.`);
      await loadDisputes();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể giải quyết tranh chấp.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (disputeId) => {
    if (!window.confirm(`Xác nhận đóng tranh chấp #${disputeId}?`)) {
      return;
    }

    setActionLoading(disputeId);
    setError('');
    setSuccess('');

    try {
      await disputeService.closeDispute(disputeId);
      setSuccess(`Tranh chấp #${disputeId} đã được đóng.`);
      await loadDisputes();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể đóng tranh chấp.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">Dispute Management</h1>
            <p className="font-body-base text-body-base text-[#475569]">Review and resolve platform disputes with secure admin controls.</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
            <div className="flex items-center gap-3">
              <span className="font-body-base text-body-base text-[#475569]">Filter status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="text-right text-sm text-[#475569]">
              {hasActionableOpen ? 'Có tranh chấp OPEN cần xử lý.' : 'Không có tranh chấp OPEN.'}
            </div>
          </div>
        </div>

        {(error || success) && (
          <div className={`px-4 py-3 rounded-xl ${success ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
            {success || error}
          </div>
        )}

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Dispute ID</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Reason</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Status</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Decision</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-[#475569]">Loading disputes...</td>
                  </tr>
                ) : disputes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-[#475569]">No disputes found.</td>
                  </tr>
                ) : (
                  disputes.map((dispute) => (
                    <tr key={dispute.dispute_id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#334155]">{dispute.dispute_id}</td>
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#475569] max-w-[360px] truncate">{dispute.reason || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps text-label-caps ${badgeClasses[dispute.status] || 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                          {dispute.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#475569]">{dispute.decision || '-'}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <select
                            value={decisionMap[dispute.dispute_id] || ''}
                            onChange={(e) => handleDecisionChange(dispute.dispute_id, e.target.value)}
                            className="min-w-[170px] px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#334155]"
                            disabled={dispute.status !== 'OPEN' || actionLoading === dispute.dispute_id}
                          >
                            <option value="">Select decision</option>
                            {DECISION_OPTIONS.map((decision) => (
                              <option key={decision} value={decision}>{decision.replace('_', ' ')}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleResolve(dispute.dispute_id)}
                            disabled={dispute.status !== 'OPEN' || actionLoading === dispute.dispute_id}
                            className="rounded-md px-3 py-2 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === dispute.dispute_id ? 'Processing...' : 'Resolve'}
                          </button>
                          <button
                            onClick={() => handleClose(dispute.dispute_id)}
                            disabled={dispute.status !== 'OPEN' || actionLoading === dispute.dispute_id}
                            className="rounded-md px-3 py-2 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === dispute.dispute_id ? 'Processing...' : 'Close'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
