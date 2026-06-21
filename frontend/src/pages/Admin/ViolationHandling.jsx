import React, { useEffect, useState } from 'react';
import { violationService } from '../../services/violationService';

const statusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
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
    case 'RESOLVED': return 'Đã giải quyết';
    case 'DISMISSED': return 'Đã bác bỏ';
    default: return status;
  }
};

export default function ViolationHandling() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  
  // Filters
  const [search, setSearch] = useState('');
  const [reportType, setReportType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal & Resolve Modal
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('WARN');

  const fetchViolations = async (opts = {}) => {
    setLoading(true);
    setAlert({ type: '', msg: '' });

    try {
      const p = opts.page || page;
      const params = {
        page: p,
        limit,
        search: search || undefined,
        report_type: reportType || undefined,
        status: statusFilter || undefined
      };

      const response = await violationService.getAdminViolations(params);

      if (response.success) {
        setViolations(response.data.violations || []);
        setTotal(response.data.total || 0);
        setPage(response.data.page || p);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Không thể tải danh sách báo cáo vi phạm.' });
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ khi tải danh sách vi phạm.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchViolations({ page: 1 });
  };

  const handleReset = () => {
    setSearch('');
    setReportType('');
    setStatusFilter('');
    setPage(1);
    fetchViolations({ page: 1 });
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await violationService.getViolationById(id);
      if (response.success) {
        setSelectedViolation(response.data);
        setShowDetailModal(true);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Không thể lấy thông tin chi tiết.' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi lấy chi tiết báo cáo.' });
    }
  };

  const handleDismiss = async (id) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn bác bỏ báo cáo vi phạm này không?');
    if (!confirm) return;

    try {
      const response = await violationService.dismissViolation(id);
      if (response.success) {
        setAlert({ type: 'success', msg: response.message || 'Đã bác bỏ báo cáo vi phạm thành công.' });
        fetchViolations();
        setShowDetailModal(false);
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Không thể bác bỏ báo cáo vi phạm.' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi thực hiện bác bỏ.' });
    }
  };

  const handleResolveClick = (violation) => {
    setSelectedViolation(violation);
    setSelectedAction('WARN');
    setShowResolveModal(true);
  };

  const handleResolveSubmit = async () => {
    const confirm = window.confirm(`Bạn có chắc chắn muốn xử lý vi phạm này bằng hành động: ${selectedAction} không?`);
    if (!confirm) return;

    try {
      const response = await violationService.resolveViolation(selectedViolation.report_id, selectedAction);
      if (response.success) {
        setAlert({ type: 'success', msg: response.message || 'Xử lý báo cáo vi phạm thành công.' });
        fetchViolations();
        setShowResolveModal(false);
        setShowDetailModal(false);
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      } else {
        setAlert({ type: 'error', msg: response.message || 'Xử lý báo cáo vi phạm thất bại.' });
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối khi thực hiện xử lý.' });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Xử lý báo cáo vi phạm</h1>
          <p className="text-sm text-slate-500 font-medium">Xem xét, kiểm tra nội dung và thực hiện các quyết định kỷ luật (Cảnh cáo, Khóa tài khoản) đối với các hành vi vi phạm điều khoản nền tảng.</p>
        </div>

        {/* Sync Form Filters */}
        <form onSubmit={handleSearch} className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all duration-200"
              placeholder="Tìm theo tên hoặc email tài khoản bị báo cáo..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
            >
              <option value="">Tất cả loại vi phạm</option>
              <option value="SPAM">Spam / Rác tin</option>
              <option value="HARASSMENT">Quấy rối / Công kích</option>
              <option value="FRAUD">Lừa đảo / Gian lận</option>
              <option value="VIOLATION">Vi phạm điều khoản</option>
              <option value="OTHER">Khác</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
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

        {/* Violations Table Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Mã báo cáo</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Loại vi phạm</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Tài khoản bị báo cáo</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Người báo cáo</th>
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
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách báo cáo vi phạm...</p>
                      </div>
                    </td>
                  </tr>
                ) : violations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-semibold text-sm">
                      Không tìm thấy báo cáo vi phạm nào.
                    </td>
                  </tr>
                ) : (
                  violations.map((v) => (
                    <tr key={v.report_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">#{v.report_id}</td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">
                        <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-600">
                          {v.report_type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-850 text-sm">{v.reported_name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{v.reported_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-850 text-sm">{v.reporter_name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{v.reporter_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBadge(v.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'PENDING' ? 'bg-amber-500' : v.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {getStatusLabelVi(v.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">
                        {new Date(v.created_at).toLocaleDateString('vi-VN', { dateStyle: 'short' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(v.report_id)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Chi tiết
                          </button>
                          {v.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleResolveClick(v)}
                                className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white hover:bg-[#0d5e58] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Xử lý
                              </button>
                              <button
                                onClick={() => handleDismiss(v.report_id)}
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
              Hiển thị {violations.length} trên tổng số {total} báo cáo vi phạm.
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (page > 1) {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    fetchViolations({ page: nextPage });
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
                    fetchViolations({ page: nextPage });
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

      {/* View Details Modal */}
      {showDetailModal && selectedViolation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-800">Chi tiết báo cáo vi phạm #{selectedViolation.report_id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin báo cáo</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block font-semibold">Loại báo cáo</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedViolation.report_type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block font-semibold">Trạng thái</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border mt-1 ${statusBadge(selectedViolation.status)}`}>
                      {getStatusLabelVi(selectedViolation.status)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-500 block font-semibold">Lý do báo cáo cụ thể</span>
                    <p className="text-slate-700 font-semibold mt-1 text-sm bg-white p-3 rounded-xl border border-slate-100">{selectedViolation.reason || 'Không có lý do chi tiết.'}</p>
                  </div>
                  {selectedViolation.project_id && (
                    <div>
                      <span className="text-xs text-slate-500 block font-semibold">Mã ID dự án liên quan</span>
                      <span className="font-bold text-slate-700 text-xs mt-0.5 block">#{selectedViolation.project_id}</span>
                    </div>
                  )}
                  {selectedViolation.created_at && (
                    <div>
                      <span className="text-xs text-slate-500 block font-semibold">Ngày tạo báo cáo</span>
                      <span className="font-bold text-slate-700 text-xs mt-0.5 block">{new Date(selectedViolation.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người gửi báo cáo (Reporter)</h3>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <p className="font-bold text-slate-800 text-sm">{selectedViolation.reporter?.full_name}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">{selectedViolation.reporter?.email}</p>
                    <p className="text-xs text-slate-500 mt-2 font-semibold">Trạng thái tài khoản: <span className="text-emerald-700">{selectedViolation.reporter?.status}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người bị báo cáo (Reported)</h3>
                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    <p className="font-bold text-slate-800 text-sm">{selectedViolation.reported_user?.full_name}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-1">{selectedViolation.reported_user?.email}</p>
                    <p className="text-xs text-slate-500 mt-2 font-semibold">Trạng thái tài khoản: <span className="text-[#0F766E]">{selectedViolation.reported_user?.status}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              {selectedViolation.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleDismiss(selectedViolation.report_id)}
                    className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold border border-rose-100 transition-colors cursor-pointer"
                  >
                    Bác bỏ báo cáo
                  </button>
                  <button
                    onClick={() => handleResolveClick(selectedViolation)}
                    className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0d5e58] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Phạt vi phạm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Action Modal */}
      {showResolveModal && selectedViolation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowResolveModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-800 font-bold">Xử phạt tài khoản vi phạm</h2>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-slate-500 font-semibold">
                Chọn hình thức kỷ luật đối với người dùng <span className="font-bold text-slate-800">{selectedViolation.reported_name || selectedViolation.reported_user?.full_name}</span>:
              </p>

              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="WARN"
                    checked={selectedAction === 'WARN'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">WARN (Cảnh cáo tài khoản)</span>
                    <span className="text-xs text-slate-400 font-medium">Gửi email cảnh báo vi phạm điều khoản chính thức.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="SUSPEND_USER"
                    checked={selectedAction === 'SUSPEND_USER'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">SUSPEND (Khóa tạm thời)</span>
                    <span className="text-xs text-slate-400 font-medium">Đình chỉ quyền đăng nhập tạm thời của người dùng.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="BAN_USER"
                    checked={selectedAction === 'BAN_USER'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">BAN USER (Khóa vĩnh viễn)</span>
                    <span className="text-xs text-slate-400 font-medium">Khóa tài khoản vĩnh viễn và chấm dứt mọi dịch vụ.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="NO_ACTION"
                    checked={selectedAction === 'NO_ACTION'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-bold text-slate-800 text-sm">NO ACTION (Bỏ qua xử phạt)</span>
                    <span className="text-xs text-slate-400 font-medium">Đánh dấu đã giải quyết mà không áp dụng hình thức phạt nào.</span>
                  </div>
                </label>
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
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
