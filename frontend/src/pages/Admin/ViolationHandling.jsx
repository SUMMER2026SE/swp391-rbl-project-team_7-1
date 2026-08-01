import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import api from '../../services/api';

const VIOLATION_TYPE_LABELS = {
  FRAUD: 'Lừa đảo / Gian lận',
  HARASSMENT: 'Quấy rối / Công kích',
  SPAM: 'Spam / Rác',
  FAKE_PROFILE: 'Tài khoản giả mạo',
  INAPPROPRIATE_CONTENT: 'Nội dung không lành mạnh',
  COPYRIGHT: 'Vi phạm bản quyền',
  SCAM: 'Lừa đảo / Gian lận',
  PLAGIARISM: 'Đạo văn',
  OTHER: 'Lý do khác',
};

const getViolationLabel = (type) => VIOLATION_TYPE_LABELS[type] || type;

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xử lý',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: 'schedule',
  },
  UNDER_REVIEW: {
    label: 'Đang xét duyệt',
    dot: 'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: 'search',
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: 'check_circle',
  },
  DISMISSED: {
    label: 'Đã bác bỏ',
    dot: 'bg-slate-400',
    badge: 'bg-slate-50 text-slate-600 border border-slate-200',
    icon: 'cancel',
  },
};

const TARGET_TYPE_CONFIG = {
  PROJECT: { label: 'Dự án', color: 'bg-violet-50 text-violet-700 border border-violet-200', icon: 'work' },
  USER: { label: 'Người dùng', color: 'bg-teal-50 text-teal-700 border border-teal-200', icon: 'person' },
  REVIEW: { label: 'Đánh giá', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: 'star' },
  ORDER: { label: 'Đơn hàng', color: 'bg-blue-50 text-blue-700 border border-blue-200', icon: 'shopping_bag' },
  MESSAGE: { label: 'Tin nhắn', color: 'bg-rose-50 text-rose-700 border border-rose-200', icon: 'chat' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
};

const Avatar = ({ name, size = 8, color = 'teal' }) => {
  const initials = name ? name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <div className={`w-${size} h-${size} rounded-full bg-${color}-50 border border-${color}-100 flex items-center justify-center text-${color}-700 text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
};

const formatDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('vi-VN', { dateStyle: 'short' }); } catch { return '—'; }
};

const formatDateTime = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('vi-VN'); } catch { return '—'; }
};

const formatVND = (amount) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function ViolationHandling() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [moderationNote, setModerationNote] = useState('');
  const [financialDecision, setFinancialDecision] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [banTargetUser, setBanTargetUser] = useState(false);
  const [deleteTargetProject, setDeleteTargetProject] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 5000);
  };

  const fetchReports = async (opts = {}) => {
    setLoading(true);
    try {
      const p = opts.page || page;
      const response = await reportService.getAdminReports({
        offset: (p - 1) * limit,
        limit,
        status: statusFilter || undefined,
        entity_type: entityType || undefined,
        search: search || undefined,
      });
      if (response.success) {
        setReports(response.reports || []);
        setTotal(response.total || 0);
        setPage(p);
        setTotalPages(Math.ceil((response.total || 0) / limit) || 1);
      } else {
        showAlert('error', response.message || 'Không thể tải danh sách báo cáo.');
      }
    } catch {
      showAlert('error', 'Lỗi kết nối máy chủ khi tải danh sách báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports({ page: 1 }); }, []); // eslint-disable-line

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchReports({ page: 1 }); };
  const handleReset = () => { setSearch(''); setEntityType(''); setStatusFilter(''); setPage(1); fetchReports({ page: 1 }); };

  // Load full detail (including evidence, contract info, escrow status)
  const handleViewDetails = async (r) => {
    setShowDetailModal(true);
    setDetailLoading(true);
    setSelectedReport(r);
    try {
      const res = await reportService.getReportById(r.id);
      const detail = res.report || res.data || res;
      setSelectedReport(detail);
    } catch (err) {
      console.error('Load detail error:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDismiss = async (reportId) => {
    if (!window.confirm('Bạn có chắc chắn muốn bác bỏ báo cáo này không?')) return;
    setActionLoading(true);
    try {
      const res = await reportService.dismissReport(reportId, 'Bác bỏ bởi Admin');
      if (res.success) {
        showAlert('success', 'Đã bác bỏ báo cáo thành công.');
        fetchReports();
        setShowDetailModal(false);
      } else {
        showAlert('error', res.message || 'Bác bỏ thất bại.');
      }
    } catch { showAlert('error', 'Lỗi kết nối.'); }
    finally { setActionLoading(false); }
  };

  const handleResolveClick = async (report) => {
    setFinancialDecision('');
    setModerationNote('');
    setBanTargetUser(false);
    setDeleteTargetProject(false);
    setShowResolveModal(true);
    setDetailLoading(true);

    try {
      const res = await reportService.getReportById(report.id);
      const detail = res.report || res.data || res;
      setSelectedReport(detail);
    } catch (err) {
      console.error('Load detail for resolve error:', err);
      setSelectedReport(report);
    } finally {
      setDetailLoading(false);
    }
  };


  const handleResolveSubmit = async () => {
    setActionLoading(true);
    try {
      // 1. Cấm tài khoản nếu được check
      const targetUserIdToBan = selectedReport?.owner?.id || (selectedReport?.target?.type === 'USER' ? selectedReport.target.id : null);
      if (banTargetUser && targetUserIdToBan) {
        try {
          await api.patch(`/user/admin/${targetUserIdToBan}/status`, { status: 'BANNED' });
        } catch (err) {
          const errMsg = err.response?.data?.message || '';
          if (errMsg.includes('đã bị cấm') || err.response?.status === 400) {
            console.warn('Tài khoản đã bị cấm từ trước, tiếp tục giải quyết báo cáo.');
          } else {
            showAlert('error', 'Cấm tài khoản vi phạm thất bại.');
            setActionLoading(false);
            return;
          }
        }
      }

      // 2. Xóa dự án nếu được check
      if (deleteTargetProject && selectedReport?.target?.type === 'PROJECT' && selectedReport?.target?.id) {
        try {
          await api.delete(`/projects/${selectedReport.target.id}`);
        } catch (err) {
          console.error('Xóa dự án thất bại:', err);
          showAlert('error', 'Xóa dự án vi phạm thất bại. Dự án có thể đã có hợp đồng hoặc không tồn tại.');
          setActionLoading(false);
          return;
        }
      }

      // 3. Giải quyết báo cáo + phán quyết ký quỹ (nếu có)
      const res = await reportService.resolveReport(
        selectedReport.id,
        moderationNote || 'Đã giải quyết bởi Admin',
        financialDecision || undefined
      );

      if (res.success) {
        const escrowMsg = financialDecision === 'PAY_FREELANCER'
          ? ' · Đã giải ngân tiền ký quỹ cho Freelancer.'
          : financialDecision === 'REFUND_EMPLOYER'
            ? ' · Đã hoàn tiền ký quỹ về Employer.'
            : '';
        showAlert('success', `Đã giải quyết báo cáo thành công.${escrowMsg}`);
        fetchReports();
        setShowResolveModal(false);
        setShowDetailModal(false);
      } else {
        showAlert('error', res.message || 'Giải quyết thất bại.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      showAlert('error', msg || 'Lỗi kết nối khi giải quyết báo cáo.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-600 text-[18px]">gavel</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Xử lý báo cáo vi phạm</h1>
            </div>
            <p className="text-xs text-slate-400 font-semibold ml-10.5">
              Xem xét và thực hiện quyết định kỷ luật, phán quyết ký quỹ đối với các hành vi vi phạm.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            {pendingCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-extrabold text-amber-700">{pendingCount} chờ xử lý</span>
              </div>
            )}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[16px]">bar_chart</span>
              <span className="text-xs font-extrabold text-slate-600">Tổng: {total} báo cáo</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            <div className="relative w-full lg:flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 transition-all"
                placeholder="Tìm theo tên người dùng, tên dự án, nội dung vi phạm..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all cursor-pointer"
              >
                <option value="">Tất cả loại</option>
                <option value="PROJECT">Dự án</option>
                <option value="USER">Người dùng</option>
                <option value="REVIEW">Đánh giá</option>
                <option value="ORDER">Đơn hàng</option>
                <option value="MESSAGE">Tin nhắn</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">⏳ Chờ xử lý</option>
                <option value="UNDER_REVIEW">🔍 Đang xét duyệt</option>
                <option value="RESOLVED">✅ Đã giải quyết</option>
                <option value="DISMISSED">❌ Đã bác bỏ</option>
              </select>
              <button type="submit" className="px-4 py-2.5 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border-none flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">search</span>
                Tìm kiếm
              </button>
              <button type="button" onClick={handleReset} className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer">
                Đặt lại
              </button>
            </div>
          </div>
        </form>

        {/* Alert */}
        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-1 ${alert.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
            <span className="material-symbols-outlined text-[16px]">{alert.type === 'success' ? 'check_circle' : 'error'}</span>
            {alert.msg}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-150">
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đối tượng / Dự án</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Người báo cáo</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loại vi phạm</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái (Escrow/Dự án)</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày gửi</th>
                  <th className="py-3.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách báo cáo...</p>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-slate-300 text-[40px]">inbox</span>
                        <p className="text-xs font-bold text-slate-400">Không tìm thấy báo cáo nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => {
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-3 px-5">
                          <span className="text-xs font-extrabold text-slate-400">#{r.id}</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${r.target?.type === 'PROJECT'
                              ? 'bg-purple-50 border-purple-100 text-purple-600'
                              : 'bg-teal-50 border-teal-100 text-teal-600'
                              }`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {r.target?.type === 'PROJECT' ? 'work' : 'person'}
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-800 text-xs truncate max-w-[200px]">
                                {r.target?.title || `ID: #${r.target?.id}`}
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase border ${r.target?.type === 'PROJECT'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200/60'
                                  : 'bg-teal-50 text-teal-700 border-teal-200/60'
                                  }`}>
                                  {r.target?.type === 'PROJECT' ? 'Dự án' : 'Người dùng'}
                                </span>
                                {r.target?.type === 'PROJECT' && (
                                  <>
                                    {r.owner && (
                                      <span className="text-[9.5px] text-slate-400 font-medium">
                                        Employer: <strong className="text-slate-600 font-bold">{r.owner.username}</strong>
                                      </span>
                                    )}
                                    {r.freelancer_name && (
                                      <span className="text-[9.5px] text-slate-400 font-medium">
                                        · Freelancer: <strong className="text-slate-600 font-bold">{r.freelancer_name}</strong>
                                      </span>
                                    )}
                                    {r.project_deadline && (
                                      <span className="text-[9.5px] text-rose-500 font-bold">
                                        · DL: {formatDate(r.project_deadline)}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <Avatar name={r.reporter?.username} size={6} />
                            <div>
                              <p className="text-xs font-bold text-slate-700 leading-tight">{r.reporter?.username}</p>
                              <p className="text-[9px] text-slate-400">{r.reporter?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg text-[10px] font-bold text-rose-700">
                            {getViolationLabel(r.violation?.type)}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex flex-col items-start gap-1.5">
                            <StatusBadge status={r.status} />
                            
                            {r.has_dispute && (
                              <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm animate-pulse">
                                <span className="material-symbols-outlined text-[10px]">warning</span>
                                Có tranh chấp
                              </span>
                            )}
                            
                            {r.target?.type === 'PROJECT' && (
                              <div className="flex flex-col gap-1 w-full mt-1 border-t border-slate-100 pt-1">
                                <div className="flex items-center justify-between gap-2 text-[9px] font-semibold text-slate-400">
                                  <span>Bài nộp:</span>
                                  <span className={`px-2 py-0.5 rounded-full font-bold border ${
                                    r.has_submission 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}>
                                    {r.has_submission ? 'Đã nộp' : 'Chưa nộp'}
                                  </span>
                                </div>
                                
                                {r.project_status && (() => {
                                  const statusMap = {
                                    OPEN: { label: 'Đang tuyển', style: 'bg-teal-50 text-teal-700 border-teal-200/60' },
                                    CLOSED: { label: 'Chờ duyệt', style: 'bg-amber-50 text-amber-700 border-amber-200/60' },
                                    IN_PROGRESS: { label: 'Đang làm', style: 'bg-sky-50 text-sky-700 border-sky-200/60' },
                                    COMPLETED: { label: 'Đã hoàn thành', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
                                    CANCELED: { label: 'Đã hủy', style: 'bg-rose-50 text-rose-700 border-rose-200/60' },
                                    REJECTED: { label: 'Từ chối duyệt', style: 'bg-slate-100 text-slate-500 border-slate-300/60' }
                                  };
                                  const cfg = statusMap[r.project_status] || { label: r.project_status, style: 'bg-slate-50 text-slate-600 border-slate-200' };
                                  return (
                                    <div className="flex items-center justify-between gap-2 text-[9px] font-semibold text-slate-400 mt-0.5">
                                      <span>Dự án:</span>
                                      <span className={`px-2 py-0.5 rounded-full font-bold border ${cfg.style}`}>
                                        {cfg.label}
                                      </span>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-5 text-xs text-slate-400 font-semibold">
                          {formatDate(r.createdAt)}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleViewDetails(r)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Chi tiết
                            </button>
                            {r.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleResolveClick(r)}
                                  className="px-2.5 py-1 bg-[#0F766E] hover:bg-[#0D5E58] text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer border-none shadow-sm"
                                >
                                  Giải quyết
                                </button>
                                <button
                                  onClick={() => handleDismiss(r.id)}
                                  disabled={actionLoading}
                                  className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Bác bỏ
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-slate-100 bg-slate-50/50">

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Hiển thị {reports.length} trên tổng số {total} báo cáo.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (page > 1) { const p = page - 1; setPage(p); fetchReports({ page: p }); } }}
                disabled={page <= 1}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => { if (page < totalPages) { const p = page + 1; setPage(p); fetchReports({ page: p }); } }}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== DETAIL MODAL ===================== */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-rose-600 text-[16px]">flag</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Chi tiết báo cáo #{selectedReport.id}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={selectedReport.status} />
                    <span className="text-[10px] text-slate-400">{formatDateTime(selectedReport.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent transition-all">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5 overflow-y-auto">
              {detailLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Target & Reporter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Đối tượng bị báo cáo</p>
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const cfg = TARGET_TYPE_CONFIG[selectedReport.target?.type] || { label: selectedReport.target?.type, color: 'bg-slate-50 text-slate-600 border border-slate-200', icon: 'flag' };
                          return (
                            <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-bold ${cfg.color}`}>
                              <span className="material-symbols-outlined text-[10px]">{cfg.icon}</span>
                              {cfg.label}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="font-bold text-slate-800 text-sm">{selectedReport.target?.title || `#${selectedReport.target?.id}`}</p>
                      {selectedReport.owner && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2">
                          <Avatar name={selectedReport.owner.username} size={6} color="slate" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">{selectedReport.owner.username}</p>
                            <p className="text-[9px] text-slate-400">{selectedReport.owner.email}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3">Người gửi báo cáo</p>
                      <div className="flex items-center gap-2.5 mb-3">
                        <Avatar name={selectedReport.reporter?.username} size={8} />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{selectedReport.reporter?.username}</p>
                          <p className="text-[10px] text-slate-400">{selectedReport.reporter?.email}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Loại vi phạm</p>
                        <span className="inline-block bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700">
                          {getViolationLabel(selectedReport.violation?.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả vi phạm</p>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {selectedReport.violation?.description || 'Không có mô tả chi tiết.'}
                      </p>
                    </div>
                  </div>

                  {/* Evidence Images */}
                  {selectedReport.evidence?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Ảnh bằng chứng ({selectedReport.evidence.length})
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {selectedReport.evidence.map((ev, idx) => {
                          const formatImgUrl = (url) => {
                            if (!url) return '';
                            // Get base URL of current API (Vercel production url or local)
                            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                            const domainBase = apiBase.replace('/api', '');

                            // If we have an ngrok-free.dev url stored in DB but we are looking at localhost (or vice versa), format it
                            if (url.includes('.ngrok-free.dev')) {
                              // Extract path from ngrok url: e.g. /uploads/evidence/...
                              const pathIndex = url.indexOf('/uploads/');
                              if (pathIndex !== -1) {
                                const relPath = url.substring(pathIndex);
                                return `${domainBase}${relPath}`;
                              }
                            }

                            if (url.startsWith('http://localhost:5000')) {
                              return url.replace('http://localhost:5000', domainBase);
                            }
                            if (url.startsWith('/') || !url.startsWith('http')) {
                              return `${domainBase}${url.startsWith('/') ? '' : '/'}${url}`;
                            }
                            return url;
                          };

                          const formattedUrl = formatImgUrl(ev.fileUrl);
                          const isImage = ev.fileType === 'IMAGE' || /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.fileUrl || '');
                          if (isImage) {
                            return (
                              <div
                                key={ev.id || idx}
                                className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer group"
                                onClick={() => setLightboxImg(formattedUrl)}
                              >
                                <img
                                  src={formattedUrl}
                                  alt={ev.fileName || `Bằng chứng ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-all flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white text-[24px] opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">zoom_in</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <p className="text-[9px] text-white font-semibold truncate">{ev.fileName || `Ảnh ${idx + 1}`}</p>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <a key={ev.id || idx} href={formattedUrl} target="_blank" rel="noopener noreferrer"

                              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#0F766E] hover:bg-[#0F766E]/5 transition-all group/ev">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-slate-400 text-[16px]">
                                  {ev.fileType === 'DOCUMENT' ? 'description' : 'link'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-700 truncate group-hover/ev:text-[#0F766E]">{ev.fileName || `Bằng chứng ${idx + 1}`}</p>
                                <p className="text-[9px] text-slate-400">{ev.fileType}</p>
                              </div>
                              <span className="material-symbols-outlined text-slate-300 text-[16px] group-hover/ev:text-[#0F766E]">open_in_new</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Contract / Escrow info for PROJECT reports */}
                  {selectedReport.target?.type === 'PROJECT' && selectedReport.contract_id && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin hợp đồng & ký quỹ</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                          <p className="text-[9px] font-bold text-slate-400 mb-1">Hợp đồng</p>
                          <p className="text-xs font-bold text-slate-700">#{selectedReport.contract_id}</p>
                          {selectedReport.total_amount && (
                            <p className="text-[10px] text-[#0F766E] font-bold mt-1">{formatVND(selectedReport.total_amount)}</p>
                          )}
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                          <p className="text-[9px] font-bold text-slate-400 mb-1">Trạng thái ký quỹ</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedReport.escrow_status === 'FUNDED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : selectedReport.escrow_status === 'RELEASED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                            {selectedReport.escrow_status === 'FUNDED' ? '🔒 Đang bị khóa'
                              : selectedReport.escrow_status === 'RELEASED' ? '✅ Đã giải ngân'
                                : selectedReport.escrow_status === 'REFUNDED' ? '↩️ Đã hoàn tiền'
                                  : selectedReport.escrow_status || 'Không xác định'}
                          </span>
                        </div>
                      </div>
                      {/* Submission info */}
                      {selectedReport.submission_description ? (
                        <div className="mt-3 bg-teal-50/50 rounded-xl p-3.5 border border-teal-200">
                          <p className="text-[9px] font-bold text-teal-600 uppercase tracking-wider mb-1.5">Bàn giao sản phẩm của Freelancer</p>
                          <p className="text-xs text-slate-700 leading-relaxed">{selectedReport.submission_description}</p>
                          {selectedReport.submission_file_url && (
                            <div className="mt-2 flex flex-wrap gap-3">
                              {/* Treat fileUrl as general link, check if it fits github, drive, demo */}
                              <a href={selectedReport.submission_file_url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[10px] text-[#0F766E] font-bold hover:underline">
                                <span className="material-symbols-outlined text-[13px]">link</span>
                                Link bàn giao sản phẩm / Drive / GitHub
                              </a>
                            </div>
                          )}
                          {selectedReport.project_deadline && (
                            <p className="mt-1.5 text-[9px] text-slate-400 font-semibold">
                              Deadline dự án: {formatDate(selectedReport.project_deadline)}
                              {selectedReport.submission_created_at && (
                                <span>
                                  {' · '}Nộp lúc: {formatDateTime(selectedReport.submission_created_at)}{' '}
                                  <span className={`font-bold ${new Date(selectedReport.submission_created_at) <= new Date(selectedReport.project_deadline) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    ({new Date(selectedReport.submission_created_at) <= new Date(selectedReport.project_deadline) ? '✓ Đúng hạn' : '✗ Trễ hạn'})
                                  </span>
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-center">
                          <span className="material-symbols-outlined text-rose-500 text-[20px] mb-1">running_with_errors</span>
                          <p className="text-xs font-bold text-rose-700">Freelancer chưa nộp dự án.</p>
                        </div>
                      )}
                    </div>
                  )}


                  {/* History */}
                  {selectedReport.history?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lịch sử xử lý</p>
                      <div className="space-y-2">
                        {selectedReport.history.map((h, idx) => (
                          <div key={h.id || idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-[#0F766E] mt-1.5 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700">{h.admin?.name || `Admin #${h.admin?.id}`}</span>
                                <span className="text-[9px] text-slate-400">{formatDateTime(h.timestamp)}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {h.action}
                                {h.fromStatus && <> — {(STATUS_CONFIG[h.fromStatus] || {}).label} → {(STATUS_CONFIG[h.toStatus] || {}).label}</>}
                              </p>
                              {h.note && <p className="text-[10px] text-slate-400 mt-1 italic">"{h.note}"</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
              {selectedReport.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold border border-rose-200 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">cancel</span>
                    Bác bỏ
                  </button>
                  <button
                    onClick={() => { setShowDetailModal(false); handleResolveClick(selectedReport); }}
                    className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0d5e58] rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Giải quyết
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== RESOLVE MODAL ===================== */}
      {showResolveModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowResolveModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">task_alt</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Giải quyết báo cáo #{selectedReport.id}</h2>
                  <p className="text-[10px] text-slate-400">
                    {selectedReport.target?.title || `Đối tượng #${selectedReport.target?.id}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowResolveModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer border-none bg-transparent transition-all">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto">

              {detailLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Đối tượng bị báo cáo</p>
                    <p className="text-xs font-bold text-slate-700">
                      {selectedReport.target?.title || `Đối tượng #${selectedReport.target?.id}`}
                    </p>
                    {selectedReport.owner && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Chủ sở hữu: <span className="font-bold text-slate-600">{selectedReport.owner.username}</span>
                      </p>
                    )}
                    {selectedReport.total_amount && (
                      <p className="text-[10px] text-[#0F766E] font-bold mt-1">
                        Giá trị hợp đồng: {formatVND(selectedReport.total_amount)}
                      </p>
                    )}
                  </div>

                  {/* ── Phán quyết ký quỹ (chỉ hiện cho PROJECT có hợp đồng) ── */}
                  {selectedReport.target?.type === 'PROJECT' && selectedReport.contract_id && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">⚖️ Phán quyết dòng tiền ký quỹ (Admin 100%):</p>

                      {selectedReport.escrow_status === 'FUNDED' ? (
                        <div className="flex flex-col gap-2">
                          {/* Approve payment */}
                          <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer hover:bg-slate-50 transition-all select-none ${financialDecision === 'PAY_FREELANCER' ? 'border-[#0F766E] bg-teal-50/30' : 'border-slate-200'}`}>
                            <input
                              type="radio"
                              name="financialDecision"
                              value="PAY_FREELANCER"
                              checked={financialDecision === 'PAY_FREELANCER'}
                              onChange={() => setFinancialDecision('PAY_FREELANCER')}
                              className="accent-[#0F766E] w-4 h-4 cursor-pointer mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-[#0F766E]">payments</span>
                                Xác nhận giải ngân — Freelancer thắng
                              </p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                                Chuyển 95% tiền ký quỹ ({selectedReport.total_amount ? formatVND(selectedReport.total_amount * 0.95) : '...'}) vào ví Freelancer. Thu 5% phí sàn. Đóng hợp đồng thành công.
                              </p>
                            </div>
                          </label>

                          {/* Refund employer */}
                          <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer hover:bg-slate-50 transition-all select-none ${financialDecision === 'REFUND_EMPLOYER' ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'}`}>
                            <input
                              type="radio"
                              name="financialDecision"
                              value="REFUND_EMPLOYER"
                              checked={financialDecision === 'REFUND_EMPLOYER'}
                              onChange={() => setFinancialDecision('REFUND_EMPLOYER')}
                              className="accent-rose-600 w-4 h-4 cursor-pointer mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-rose-600">keyboard_return</span>
                                Hoàn tiền ký quỹ — Employer thắng
                              </p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">
                                Hoàn lại 100% tiền ký quỹ ({selectedReport.total_amount ? formatVND(selectedReport.total_amount) : '...'}) vào ví Employer. Đóng hợp đồng thất bại.
                              </p>
                            </div>
                          </label>

                          {financialDecision && (
                            <button
                              type="button"
                              onClick={() => setFinancialDecision('')}
                              className="text-[9px] text-slate-400 font-bold hover:text-slate-600 self-start border-none bg-transparent cursor-pointer underline p-0 mt-0.5"
                            >
                              Bỏ chọn phán quyết ký quỹ
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-[16px] mt-0.5 shrink-0">info</span>
                          <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                            Tiền ký quỹ của hợp đồng này đã được xử lý (Trạng thái: <strong>
                              {selectedReport.escrow_status === 'RELEASED' ? 'Đã giải ngân'
                                : selectedReport.escrow_status === 'REFUNDED' ? 'Đã hoàn tiền'
                                  : selectedReport.escrow_status || 'Không tìm thấy'}</strong>).
                            Không thể thực hiện phán quyết tài chính.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Hành động đi kèm ── */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hành động đi kèm:</p>

                    {(selectedReport.owner || selectedReport.target?.type === 'USER') && (
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all select-none">
                        <input
                          type="checkbox"
                          checked={banTargetUser}
                          onChange={(e) => setBanTargetUser(e.target.checked)}
                          className="accent-rose-600 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-rose-500">person_off</span>
                            Cấm tài khoản vi phạm
                          </p>
                          <p className="text-[9px] text-slate-400">
                            Khóa tài khoản {selectedReport.owner?.username || selectedReport.target?.title || `Người dùng #${selectedReport.target?.id}`} trên hệ thống.
                          </p>
                        </div>
                      </label>
                    )}

                    {selectedReport.target?.type === 'PROJECT' && (
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all select-none">
                        <input
                          type="checkbox"
                          checked={deleteTargetProject}
                          onChange={(e) => setDeleteTargetProject(e.target.checked)}
                          className="accent-rose-600 w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-rose-500">delete</span>
                            Gỡ bỏ (Xóa) dự án này
                          </p>
                          <p className="text-[9px] text-slate-400">Xóa vĩnh viễn tin tuyển dụng này khỏi hệ thống.</p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* ── Ghi chú xử lý ── */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Ghi chú xử lý <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                    </label>
                    <textarea
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                      placeholder="Nhập ghi chú hoặc biện pháp xử lý để lưu lại lịch sử..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-xs text-slate-700 bg-white resize-none placeholder-slate-400"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="material-symbols-outlined text-amber-500 text-[16px] mt-0.5 shrink-0">warning</span>
                    <p className="text-[10px] text-amber-700 font-semibold leading-relaxed">
                      Thao tác này <strong>không thể hoàn tác</strong>. Xác nhận sẽ chuyển báo cáo thành <strong>Đã giải quyết</strong> và kích hoạt tất cả hành động đã chọn ở trên.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setShowResolveModal(false)}
                disabled={actionLoading}
                className="px-4 py-2.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleResolveSubmit}
                disabled={actionLoading || detailLoading}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0F766E] to-teal-500 hover:from-[#0D5E58] hover:to-teal-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 shadow-md shadow-teal-200 disabled:opacity-50 disabled:shadow-none"
              >
                {actionLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                )}
                {actionLoading ? 'Đang xử lý...' : 'Xác nhận giải quyết'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== LIGHTBOX ===================== */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-[99999] flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={lightboxImg}
              alt="Ảnh bằng chứng phóng to"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer border-none transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}