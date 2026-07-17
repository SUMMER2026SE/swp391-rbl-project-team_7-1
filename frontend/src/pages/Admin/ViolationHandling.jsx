import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';

const statusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'UNDER_REVIEW':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'DISMISSED':
      return 'bg-slate-50 text-slate-700 border border-slate-100';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-100';
  }
};

const getStatusLabelVi = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ xử lý';
    case 'UNDER_REVIEW': return 'Đang xem xét';
    case 'RESOLVED': return 'Đã giải quyết';
    case 'DISMISSED': return 'Đã bác bỏ';
    default: return status;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', { dateStyle: 'short' });
  } catch {
    return '—';
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('vi-VN');
  } catch {
    return '—';
  }
};

export default function ViolationHandling() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  // Filters
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal & Action Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [moderationNote, setModerationNote] = useState('');

  const fetchReports = async (opts = {}) => {
    setLoading(true);
    setAlert({ type: '', msg: '' });

    try {
      const p = opts.page || page;
      const params = {
        offset: (p - 1) * limit,
        limit,
        status: statusFilter || undefined,
        entity_type: entityType || undefined,
        search: search || undefined
      };

      const response = await reportService.getAdminReports(params);

      if (response.success) {
        setReports(response.reports || []);
        setTotal(response.total || 0);
        setPage(p);
        setTotalPages(Math.ceil((response.total || 0) / limit) || 1);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Không thể tải danh sách báo cáo.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ khi tải danh sách báo cáo.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports({ page: 1 });
  };

  const handleReset = () => {
    setSearch('');
    setEntityType('');
    setStatusFilter('');
    setPage(1);
    fetchReports({ page: 1 });
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleDismiss = async (reportId) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn bác bỏ báo cáo này không?');
    if (!confirm) return;

    try {
      const response = await reportService.dismissReport(reportId, 'Bác bỏ bởi Admin');
      if (response.success) {
        setAlert({ type: 'success', msg: 'Đã bác bỏ báo cáo thành công.' });
        fetchReports();
        setShowDetailModal(false);
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Không thể bác bỏ báo cáo.' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi thực hiện bác bỏ.' });
    }
  };

  const handleResolveClick = (report) => {
    setSelectedReport(report);
    setModerationNote('');
    setShowResolveModal(true);
  };

  const handleResolveSubmit = async () => {
    try {
      const response = await reportService.resolveReport(
        selectedReport.id,
        moderationNote || 'Đã xử lý bởi Admin'
      );
      if (response.success) {
        setAlert({ type: 'success', msg: 'Xử lý báo cáo thành công.' });
        fetchReports();
        setShowResolveModal(false);
        setShowDetailModal(false);
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Xử lý báo cáo thất bại.' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi thực hiện xử lý.' });
    }
  };

  const handleUnderReview = async (reportId) => {
    try {
      const response = await reportService.reviewReport(reportId);
      if (response.success) {
        setAlert({ type: 'success', msg: 'Đã chuyển sang trạng thái đang xem xét.' });
        fetchReports();
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi cập nhật trạng thái.' });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Xử lý báo cáo vi phạm</h1>
          <p className="text-sm text-slate-500 font-medium">
            Xem xét, kiểm tra nội dung và thực hiện các quyết định kỷ luật đối với các hành vi vi phạm điều khoản nền tảng.
          </p>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all duration-200"
              placeholder="Tìm kiếm báo cáo..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
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
              className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="UNDER_REVIEW">Đang xem xét</option>
              <option value="RESOLVED">Đã giải quyết</option>
              <option value="DISMISSED">Đã bác bỏ</option>
            </select>
            <button type="submit" className="px-5 py-2.5 bg-[#0F766E] text-white rounded-2xl text-sm font-bold shadow-[0_4px_12px_rgba(15,118,110,0.15)] hover:bg-[#0d5e58] hover:shadow-[0_4px_16px_rgba(15,118,110,0.25)] transition-all cursor-pointer">
              Tìm kiếm
            </button>
            <button type="button" onClick={handleReset} className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
              Đặt lại
            </button>
          </div>
        </form>

        {/* Alerts */}
        {alert.msg && (
          <div className={`p-4 rounded-2xl border flex items-center gap-2 text-sm font-semibold ${
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {alert.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{alert.msg}</span>
          </div>
        )}

        {/* Reports Table */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Mã</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Đối tượng</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Người báo cáo</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Loại vi phạm</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Ngày báo cáo</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách báo cáo...</p>
                      </div>
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-semibold text-sm">
                      Không tìm thấy báo cáo nào.
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">#{r.id}</td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-850 text-sm">
                            <span className={`text-xs px-1.5 py-0.5 rounded mr-1.5 ${
                              r.target.type === 'PROJECT' 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'bg-teal-50 text-teal-600'
                            }`}>
                              {r.target.type}
                            </span>
                            {r.target.title || `#${r.target.id}`}
                          </div>
                          {r.owner && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              Chủ sở hữu: {r.owner.username || `#${r.owner.id}`}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-850 text-sm">
                          {r.reporter.username || `#${r.reporter.id}`}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">
                        <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-600">
                          {r.violation.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBadge(r.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'PENDING' ? 'bg-amber-500' :
                            r.status === 'UNDER_REVIEW' ? 'bg-blue-500' :
                            r.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          {getStatusLabelVi(r.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(r)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Chi tiết
                          </button>
                          {r.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUnderReview(r.id)}
                                className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Xem xét
                              </button>
                              <button
                                onClick={() => handleResolveClick(r)}
                                className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white hover:bg-[#0d5e58] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Xử lý
                              </button>
                              <button
                                onClick={() => handleDismiss(r.id)}
                                className="px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Bỏ qua
                              </button>
                            </>
                          )}
                          {r.status === 'UNDER_REVIEW' && (
                            <>
                              <button
                                onClick={() => handleResolveClick(r)}
                                className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white hover:bg-[#0d5e58] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Xử lý
                              </button>
                              <button
                                onClick={() => handleDismiss(r.id)}
                                className="px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                              >
                                Bỏ qua
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-t border-slate-100 bg-slate-50/50">
            <div className="text-xs font-semibold text-slate-500">
              Hiển thị {reports.length} trên tổng số {total} báo cáo.
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (page > 1) {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    fetchReports({ page: nextPage });
                  }
                }}
                disabled={page <= 1}
                className="px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-600 shadow-sm disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="text-xs font-extrabold text-slate-700 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => {
                  if (page < totalPages) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchReports({ page: nextPage });
                  }
                }}
                disabled={page >= totalPages}
                className="px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-slate-600 shadow-sm disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-800">
                Chi tiết báo cáo #{selectedReport.id}
                {selectedReport.target.type === 'PROJECT' && (
                  <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-bold">Dự án</span>
                )}
              </h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
              {/* Target Entity Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Đối tượng bị báo cáo</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
                      {selectedReport.target.type}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedReport.target.title || `#${selectedReport.target.id}`}
                    </span>
                  </div>
                  {selectedReport.owner && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <span className="text-xs text-slate-500 font-semibold">Chủ sở hữu:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white">
                          {selectedReport.owner.username?.[0] || '?'}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{selectedReport.owner.username}</span>
                        <span className="text-xs text-slate-400">({selectedReport.owner.email})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reporter & Violation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người gửi báo cáo</h3>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white">
                        {selectedReport.reporter.username?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{selectedReport.reporter.username}</p>
                        <p className="text-xs text-slate-400 font-semibold">{selectedReport.reporter.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin vi phạm</h3>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <div className="mb-2">
                      <span className="text-xs text-slate-500 font-semibold">Loại vi phạm:</span>
                      <span className="ml-2 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-600">
                        {selectedReport.violation.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-semibold">Trạng thái:</span>
                      <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusBadge(selectedReport.status)}`}>
                        {getStatusLabelVi(selectedReport.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả vi phạm</h3>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedReport.violation.description || 'Không có mô tả.'}
                  </p>
                </div>
              </div>

              {/* Evidence */}
              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Bằng chứng ({selectedReport.evidence.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReport.evidence.map((ev, idx) => (
                      <div key={ev.id || idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                            {ev.fileType === 'IMAGE' ? (
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : ev.fileType === 'DOCUMENT' ? (
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">
                              {ev.fileName || `${ev.fileType} file`}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {ev.fileType} • {formatDateTime(ev.createdAt)}
                            </p>
                            <a
                              href={ev.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#0F766E] font-bold hover:underline mt-1 inline-block"
                            >
                              Xem bằng chứng →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              {selectedReport.history && selectedReport.history.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lịch sử xử lý</h3>
                  <div className="space-y-3">
                    {selectedReport.history.map((h, idx) => (
                      <div key={h.id || idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-[#0F766E] mt-1.5 shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">{h.admin?.name || `Admin #${h.admin?.id}`}</span>
                            <span className="text-[10px] text-slate-400">{formatDateTime(h.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            <span className="font-semibold">{h.action}</span>
                            {h.fromStatus && (
                              <>: {getStatusLabelVi(h.fromStatus)} → {getStatusLabelVi(h.toStatus)}</>
                            )}
                          </p>
                          {h.note && (
                            <p className="text-xs text-slate-500 mt-1 italic">"{h.note}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div>
                  <span className="font-semibold">Ngày tạo:</span>{' '}
                  <span className="font-bold text-slate-700">{formatDateTime(selectedReport.createdAt)}</span>
                </div>
                {selectedReport.resolvedAt && (
                  <div>
                    <span className="font-semibold">Ngày xử lý:</span>{' '}
                    <span className="font-bold text-slate-700">{formatDateTime(selectedReport.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              {selectedReport.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleUnderReview(selectedReport.id)}
                    className="px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đang xem xét
                  </button>
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold border border-rose-100 transition-colors cursor-pointer"
                  >
                    Bác bỏ
                  </button>
                  <button
                    onClick={() => handleResolveClick(selectedReport)}
                    className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0d5e58] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Giải quyết
                  </button>
                </>
              )}
              {selectedReport.status === 'UNDER_REVIEW' && (
                <>
                  <button
                    onClick={() => handleDismiss(selectedReport.id)}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold border border-rose-100 transition-colors cursor-pointer"
                  >
                    Bác bỏ
                  </button>
                  <button
                    onClick={() => handleResolveClick(selectedReport)}
                    className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0d5e58] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Giải quyết
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowResolveModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-800">Xác nhận giải quyết báo cáo</h2>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                Bạn sắp đánh dấu báo cáo <strong>#{selectedReport.id}</strong> là đã giải quyết.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ghi chú xử lý (optional)
                </label>
                <textarea
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="Ghi chú về hành động xử lý..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] outline-none transition-all text-slate-800 bg-white resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleResolveSubmit}
                className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0d5e58] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Xác nhận giải quyết
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}