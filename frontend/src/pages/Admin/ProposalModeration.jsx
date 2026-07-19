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
    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Duyệt hồ sơ báo giá</h1>
            <p className="text-xs text-slate-455 font-semibold">Xem xét, sàng lọc, chấp thuận hoặc từ chối các đề xuất báo giá (proposals) từ freelancer gửi đến nhà tuyển dụng.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border-none bg-transparent font-bold text-[#0F766E] focus:outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications */}
        {(message || error) && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-1 ${
            message 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {message ? 'check_circle' : 'error'}
            </span>
            <span>{message || error}</span>
          </div>
        )}

        {/* Proposals Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-150">
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mã báo giá</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiêu đề dự án</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Freelancer</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giá đề xuất</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ngày thực hiện</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách đề xuất...</p>
                      </div>
                    </td>
                  </tr>
                ) : proposals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-bold text-xs">
                      Không tìm thấy đề xuất báo giá nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  proposals.map((proposal) => (
                    <tr key={proposal.proposal_id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-5 font-bold text-slate-800 text-xs">#{proposal.proposal_id}</td>
                      <td className="py-3 px-5 text-slate-700 max-w-[240px] truncate font-bold text-xs">{proposal.project_title}</td>
                      <td className="py-3 px-5 text-slate-500 font-bold text-xs">{proposal.freelancer_name}</td>
                      <td className="py-3 px-5 text-xs font-extrabold text-[#0F766E] whitespace-nowrap">
                        {(proposal.proposed_price || 0).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-5 text-slate-400 font-semibold text-xs">{proposal.delivery_time_days || '-'} ngày</td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold border ${getBadgeClass(proposal.status)}`}>
                          {getStatusLabelVi(proposal.status)}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                            onClick={() => handleStatusChange(proposal.proposal_id, 'SHORTLISTED')}
                            className="px-3.5 py-1.5 rounded-lg border border-sky-100 bg-sky-50/50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer active:scale-95 shadow-sm"
                          >
                            Lưu ý
                          </button>
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'REJECTED'}
                            onClick={() => handleStatusChange(proposal.proposal_id, 'REJECTED')}
                            className="px-3.5 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer active:scale-95 shadow-sm"
                          >
                            Từ chối
                          </button>
                          <button
                            disabled={processingId === proposal.proposal_id || proposal.status === 'ACCEPTED'}
                            onClick={() => handleAccept(proposal.proposal_id)}
                            className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0D5E58] text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40 cursor-pointer border-none shadow-sm active:scale-95"
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
