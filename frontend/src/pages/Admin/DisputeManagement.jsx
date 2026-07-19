import React, { useEffect, useState } from 'react';
import { disputeService } from '../../services/disputeService';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'OPEN', label: 'Đang mở tranh chấp' },
  { value: 'RESOLVED', label: 'Đã giải quyết' },
  { value: 'CLOSED', label: 'Đã đóng' }
];

const DECISION_OPTIONS = [
  { value: 'REFUND_EMPLOYER', label: 'Hoàn trả tiền ký quỹ cho Doanh nghiệp (Employer)', color: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' },
  { value: 'PAY_FREELANCER', label: 'Thanh toán toàn bộ tiền ký quỹ cho Freelancer', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' },
  { value: 'SPLIT_PAYMENT', label: 'Chia đôi số tiền thanh toán (50/50)', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' },
  { value: 'NO_ACTION', label: 'Đóng lại và không thực hiện thêm hành động nào', color: 'bg-slate-150 text-slate-700 hover:bg-slate-200 border border-slate-200' }
];

const badgeClasses = {
  OPEN: 'bg-amber-50 text-amber-700 border border-amber-100',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  CLOSED: 'bg-slate-100 text-slate-600 border border-slate-200'
};

export default function DisputeManagement() {
  const [disputes, setDisputes] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('');

  const loadDisputes = async (shouldSelectFirst = false) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const params = statusFilter === 'ALL' ? {} : { status: statusFilter };
      const response = await disputeService.getAdminDisputes(params);
      const list = response.disputes || [];
      setDisputes(list);
      
      if (list.length > 0) {
        if (shouldSelectFirst || !selectedDispute) {
          setSelectedDispute(list[0]);
        } else {
          const updated = list.find(d => d.dispute_id === selectedDispute.dispute_id);
          setSelectedDispute(updated || list[0]);
        }
      } else {
        setSelectedDispute(null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách tranh chấp.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes(true);
  }, [statusFilter]);

  const handleResolve = async (disputeId) => {
    if (!selectedDecision) {
      setError('Vui lòng lựa chọn quyết định phân xử trước.');
      return;
    }

    const decisionText = DECISION_OPTIONS.find(d => d.value === selectedDecision)?.label;
    if (!window.confirm(`Xác nhận giải quyết tranh chấp #${disputeId} với quyết định: ${decisionText}?`)) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await disputeService.resolveDispute(disputeId, selectedDecision);
      setSuccess(`Tranh chấp #${disputeId} đã được giải quyết thành công.`);
      setSelectedDecision('');
      await loadDisputes(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể giải quyết tranh chấp.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async (disputeId) => {
    if (!window.confirm(`Xác nhận đóng cuộc tranh chấp #${disputeId}?`)) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await disputeService.closeDispute(disputeId);
      setSuccess(`Tranh chấp #${disputeId} đã được đóng lại.`);
      await loadDisputes(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể đóng tranh chấp.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Giải quyết tranh chấp</h1>
            <p className="text-xs text-slate-450 font-semibold">Xem xét, kiểm thử tài liệu chứng cứ và đưa ra phán quyết phân chia tiền ký quỹ (Escrow) công bằng.</p>
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
        {(error || success) && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-1 ${
            success 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {success ? 'check_circle' : 'error'}
            </span>
            <span>{success || error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Dispute List (Left Column) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="font-bold text-[10px] text-slate-400 tracking-wider uppercase">Danh sách tranh chấp ({disputes.length})</h3>
            
            <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1.5 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-slate-400">
                  <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Đang tải...</p>
                </div>
              ) : disputes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
                  Không tìm thấy cuộc tranh chấp nào phù hợp.
                </div>
              ) : (
                disputes.map((dispute) => {
                  const isSelected = selectedDispute && selectedDispute.dispute_id === dispute.dispute_id;
                  return (
                    <div
                      key={dispute.dispute_id}
                      onClick={() => setSelectedDispute(dispute)}
                      className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'border-[#0F766E] shadow-sm ring-2 ring-[#0F766E]/5' 
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(15,23,42,0.01)]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold border ${badgeClasses[dispute.status]}`}>
                          {dispute.status === 'OPEN' ? 'ĐANG MỞ' : dispute.status === 'RESOLVED' ? 'ĐÃ PHÁN QUYẾT' : 'ĐÃ ĐÓNG'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(dispute.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs">Hợp đồng: #{dispute.contract_id}</h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-semibold">Lý do: {dispute.reason || 'Không có lý do chi tiết'}</p>
                      
                      <div className="mt-4 flex justify-between items-center pt-2.5 border-t border-slate-50">
                        <span className="text-[9px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-100/50">Mã tranh chấp: #{dispute.dispute_id}</span>
                        <span className="material-symbols-outlined text-slate-400 text-base">chevron_right</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed View (Right Column) */}
          <div className="lg:col-span-8">
            {selectedDispute ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden flex flex-col min-h-[580px]">
                
                {/* Detail Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-800 tracking-tight">Chi tiết vụ tranh chấp #{selectedDispute.dispute_id}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold border ${badgeClasses[selectedDispute.status]}`}>
                        {selectedDispute.status === 'OPEN' ? 'ĐANG CHỜ PHÁN QUYẾT' : selectedDispute.status === 'RESOLVED' ? 'ĐÃ PHÁN QUYẾT' : 'ĐÃ ĐÓNG'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">Khởi tạo bởi hệ thống lúc: {formatDateTime(selectedDispute.created_at)}</p>
                  </div>
                  <div className="text-left sm:text-right bg-teal-50 border border-teal-100/50 rounded-xl px-3 py-1.5 self-start sm:self-auto">
                    <span className="text-[8px] uppercase font-bold text-[#0F766E] tracking-wider block">Mã số hợp đồng</span>
                    <span className="text-sm font-bold text-[#0F766E]">#{selectedDispute.contract_id}</span>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="flex-1 p-6 space-y-6 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Người yêu cầu tranh chấp</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">Tài khoản ID: #{selectedDispute.opened_by}</span>
                    </div>
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Đối tác bị khiếu nại</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">Tài khoản ID: #{selectedDispute.against_user_id}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lý do &amp; nội dung mô tả tranh chấp:</h4>
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-250 text-slate-700 text-xs whitespace-pre-wrap leading-relaxed font-semibold">
                      {selectedDispute.reason || 'Không có lý do chi tiết được cung cấp.'}
                    </div>
                  </div>

                  {selectedDispute.status !== 'OPEN' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="text-[10px] text-emerald-700 block font-bold uppercase tracking-wider">Phán quyết từ Ban Quản Trị:</span>
                      <span className="text-xs font-bold text-emerald-900 mt-1 block leading-relaxed">
                        Quyết định thực thi: <span className="font-extrabold">{
                          selectedDispute.decision === 'REFUND_EMPLOYER' ? 'Hoàn tiền cho Doanh nghiệp (Employer)' :
                          selectedDispute.decision === 'PAY_FREELANCER' ? 'Thanh toán cho Freelancer' :
                          selectedDispute.decision === 'SPLIT_PAYMENT' ? 'Chia đôi tiền ký quỹ (50/50)' :
                          'Đóng lại và không can thiệp'
                        }</span>
                      </span>
                      {selectedDispute.resolved_at && (
                        <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">Giải quyết vào lúc: {formatDateTime(selectedDispute.resolved_at)}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dispute Action Form */}
                {selectedDispute.status === 'OPEN' && (
                  <div className="p-6 border-t border-slate-100 bg-[#F8FAFC] flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quyết định phán xử tiền ký quỹ:</label>
                      <select
                        value={selectedDecision}
                        onChange={(e) => setSelectedDecision(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all cursor-pointer"
                      >
                        <option value="">-- Lựa chọn phương án giải quyết --</option>
                        {DECISION_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-end items-center mt-2">
                      <button
                        onClick={() => handleClose(selectedDispute.dispute_id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        Đóng tranh chấp trực tiếp
                      </button>
                      <button
                        onClick={() => handleResolve(selectedDispute.dispute_id)}
                        disabled={actionLoading || !selectedDecision}
                        className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer border-none"
                      >
                        {actionLoading ? 'Đang phân xử...' : 'Thực thi phán quyết'}
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-16 text-center text-slate-450 flex flex-col justify-center items-center min-h-[580px]">
                <span className="material-symbols-outlined text-[40px] text-slate-200 mb-2">gavel</span>
                <p className="font-bold text-slate-400 text-xs">Vui lòng chọn một cuộc tranh chấp bên cột trái để xem xét tài liệu phán quyết.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}
