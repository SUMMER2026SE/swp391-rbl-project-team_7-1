import React, { useEffect, useState } from 'react';
import { proposalService } from '../../services/proposalService';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'SUBMITTED', label: 'Đã nộp báo giá' },
  { value: 'SHORTLISTED', label: 'Đã đưa vào danh sách' },
  { value: 'ACCEPTED', label: 'Đã chấp nhận' },
  { value: 'REJECTED', label: 'Đã từ chối' },
  { value: 'WITHDRAWN', label: 'Đã rút lại' },
  { value: 'CANCELED', label: 'Đã hủy' }
];

const getBadgeClass = (status) => {
  switch (status) {
    case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'SHORTLISTED': return 'bg-sky-50 text-sky-700 border border-sky-100';
    case 'REJECTED': return 'bg-rose-50 text-rose-700 border border-rose-100';
    case 'WITHDRAWN': return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'CANCELED': return 'bg-slate-50 text-slate-700 border border-slate-155';
    default: return 'bg-slate-50 text-slate-700 border border-slate-100';
  }
};

const getStatusLabelVi = (status) => {
  switch (status) {
    case 'ACCEPTED': return 'Đã duyệt';
    case 'SHORTLISTED': return 'Lưu danh sách';
    case 'REJECTED': return 'Đã từ chối';
    case 'WITHDRAWN': return 'Đã rút';
    case 'CANCELED': return 'Đã hủy';
    case 'SUBMITTED': return 'Chờ duyệt';
    default: return status;
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
      setError(err?.response?.data?.message || 'Không thể tải danh sách báo giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (proposalId, status) => {
    const confirmation = window.confirm(`Bạn có chắc muốn chuyển trạng thái báo giá ${proposalId} sang ${status}?`);
    if (!confirmation) return;

    try {
      setProcessingId(proposalId);
      await proposalService.updateProposalModerationStatus(proposalId, status);
      setMessage(`Báo giá #${proposalId} đã được chuyển sang trạng thái ${status}.`);
      fetchProposals();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật báo giá.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleAccept = async (proposalId) => {
    const confirmation = window.confirm(`Chấp nhận báo giá ${proposalId} và tạo hợp đồng trực tiếp?`);
    if (!confirmation) return;

    try {
      setProcessingId(proposalId);
      await proposalService.acceptProposal(proposalId);
      setMessage(`Báo giá #${proposalId} đã được chấp thuận và hợp đồng đã được tạo.`);
      fetchProposals();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể chấp thuận báo giá.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Duyệt hồ sơ báo giá</h1>
            <p className="text-sm text-slate-500 font-medium">Xem xét, sàng lọc, chấp thuận hoặc từ chối các đề xuất báo giá (proposals) từ freelancer gửi đến nhà tuyển dụng.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-none bg-transparent font-bold text-[#0F766E] focus:outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        {(message || error) && (
          <div className={`p-4 rounded-2xl border flex items-center gap-2 text-sm font-semibold ${
            message 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {message ? 'check_circle' : 'error'}
            </span>
            <span>{message || error}</span>
          </div>
        )}

        {/* Proposals Table Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Mã báo giá</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Tiêu đề dự án</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Freelancer</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Giá đề xuất</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Ngày thực hiện</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách đề xuất...</p>
                      </div>
                    </td>
                  </tr>
                ) : proposals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-semibold text-sm">
                      Không tìm thấy đề xuất báo giá nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  proposals.map((proposal) => (
                    <tr key={proposal.proposal_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800 text-sm">#{proposal.proposal_id}</td>
                      <td className="py-4 px-6 text-slate-700 max-w-[240px] truncate font-semibold text-sm">{proposal.project_title}</td>
                      <td className="py-4 px-6 text-slate-700 font-semibold text-sm">{proposal.freelancer_name}</td>
                      <td className="py-4 px-6 text-slate-800 font-black text-sm">
                        {(proposal.proposed_price || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-semibold text-sm">{proposal.delivery_time_days || '-'} ngày</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-xs font-bold border ${getBadgeClass(proposal.status)}`}>
                          {getStatusLabelVi(proposal.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                            onClick={() => handleStatusChange(proposal.proposal_id, 'SHORTLISTED')}
                            className="px-3 py-1.5 rounded-xl border border-sky-100 bg-sky-50 text-sky-700 hover:bg-sky-500 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            Lưu ý
                          </button>
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'REJECTED'}
                            onClick={() => handleStatusChange(proposal.proposal_id, 'REJECTED')}
                            className="px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                          >
                            Từ chối
                          </button>
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                            onClick={() => handleAccept(proposal.proposal_id)}
                            className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white hover:bg-[#0d5e58] text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                          >
                            Duyệt
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
