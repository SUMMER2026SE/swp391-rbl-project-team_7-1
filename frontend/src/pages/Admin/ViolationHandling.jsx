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
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-8">
        
        {/* Page Header */}
        <div>
          <h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">Admin Violation Handling</h1>
          <p className="font-body-base text-body-base text-[#475569]">Xem xét và xử lý các báo cáo vi phạm của người dùng trên hệ thống.</p>
        </div>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-body-sm text-body-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors"
              placeholder="Search by reported user's name or email..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white"
            >
              <option value="">All Report Types</option>
              <option value="SPAM">Spam</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="FRAUD">Fraud</option>
              <option value="VIOLATION">Violation</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-[#0F766E] text-white rounded-lg">Search</button>
            <button type="button" onClick={handleReset} className="px-4 py-2 border border-[#E2E8F0] rounded-lg">Reset</button>
          </div>
        </form>

        {/* Alert Notifications */}
        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl border ${alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
            {alert.msg}
          </div>
        )}

        {/* Table List */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 font-semibold text-slate-700">Report ID</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">Report Type</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">Reported User</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">Reporter</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">Status</th>
                  <th className="py-4 px-6 font-semibold text-slate-700">Created Date</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[#475569]">Loading violations...</td>
                  </tr>
                ) : violations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[#475569]">No violations found.</td>
                  </tr>
                ) : (
                  violations.map((v) => (
                    <tr key={v.report_id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">#{v.report_id}</td>
                      <td className="py-4 px-6 font-semibold text-slate-700">{v.report_type}</td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-slate-800">{v.reported_name}</div>
                          <div className="text-xs text-slate-500">{v.reported_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-slate-800">{v.reporter_name}</div>
                          <div className="text-xs text-slate-500">{v.reporter_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs ${statusBadge(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(v.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(v.report_id)}
                            className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs transition-colors"
                          >
                            View Details
                          </button>
                          {v.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleResolveClick(v)}
                                className="px-3 py-1.5 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs transition-colors"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleDismiss(v.report_id)}
                                className="px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white text-xs transition-colors"
                              >
                                Dismiss
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
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl">
          <div className="text-sm text-[#475569]">
            Hiển thị {violations.length} trên {total} báo cáo vi phạm
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (page > 1) {
                  const nextPage = page - 1;
                  setPage(nextPage);
                  fetchViolations({ page: nextPage });
                }
              }}
              disabled={page <= 1}
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-[#475569]">
              Page {page} of {totalPages}
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
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailModal && selectedViolation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Chi tiết báo cáo #{selectedViolation.report_id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thông tin báo cáo</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">Loại báo cáo</span>
                    <span className="font-semibold text-slate-700">{selectedViolation.report_type}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Trạng thái</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${statusBadge(selectedViolation.status)}`}>
                      {selectedViolation.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-500 block">Lý do báo cáo</span>
                    <p className="text-slate-700 font-medium mt-1">{selectedViolation.reason || 'Không có lý do chi tiết.'}</p>
                  </div>
                  {selectedViolation.project_id && (
                    <div>
                      <span className="text-xs text-slate-500 block">ID Dự án liên quan</span>
                      <span className="font-semibold text-slate-700">#{selectedViolation.project_id}</span>
                    </div>
                  )}
                  {selectedViolation.created_at && (
                    <div>
                      <span className="text-xs text-slate-500 block">Ngày tạo</span>
                      <span className="font-semibold text-slate-700">{new Date(selectedViolation.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người báo cáo (Reporter)</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-full">
                    <p className="font-bold text-slate-800">{selectedViolation.reporter?.full_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedViolation.reporter?.email}</p>
                    <p className="text-xs text-slate-500 mt-2">Trạng thái: <span className="font-semibold text-slate-700">{selectedViolation.reporter?.status}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Người bị báo cáo (Reported)</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-full">
                    <p className="font-bold text-slate-800">{selectedViolation.reported_user?.full_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedViolation.reported_user?.email}</p>
                    <p className="text-xs text-slate-500 mt-2">Trạng thái: <span className="font-semibold text-slate-700">{selectedViolation.reported_user?.status}</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              >
                Đóng
              </button>
              {selectedViolation.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleDismiss(selectedViolation.report_id)}
                    className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg text-sm border border-red-100 transition-colors"
                  >
                    Bác bỏ (Dismiss)
                  </button>
                  <button
                    onClick={() => handleResolveClick(selectedViolation)}
                    className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0D5E58] rounded-lg text-sm font-semibold transition-colors shadow-sm"
                  >
                    Xử lý vi phạm
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolve Action Modal */}
      {showResolveModal && selectedViolation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Xử lý báo cáo vi phạm #{selectedViolation.report_id}</h2>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                Chọn hình thức kỷ luật đối với người dùng <span className="font-bold text-slate-800">{selectedViolation.reported_name || selectedViolation.reported_user?.full_name}</span>:
              </p>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="WARN"
                    checked={selectedAction === 'WARN'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-semibold text-slate-800 text-sm">WARN (Cảnh cáo)</span>
                    <span className="text-xs text-slate-500">Gửi thông báo cảnh cáo chính thức tới người dùng.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="SUSPEND_USER"
                    checked={selectedAction === 'SUSPEND_USER'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-semibold text-slate-800 text-sm">SUSPEND (Tạm đình chỉ)</span>
                    <span className="text-xs text-slate-500">Khóa tài khoản tạm thời của người dùng này.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="BAN_USER"
                    checked={selectedAction === 'BAN_USER'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-semibold text-slate-800 text-sm">BAN USER (Khóa vĩnh viễn)</span>
                    <span className="text-xs text-slate-500">Cấm tài khoản vĩnh viễn khỏi toàn bộ hệ thống.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="resolveAction"
                    value="NO_ACTION"
                    checked={selectedAction === 'NO_ACTION'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="block font-semibold text-slate-800 text-sm">NO ACTION (Không xử phạt)</span>
                    <span className="text-xs text-slate-500">Đánh dấu báo cáo là đã xử lý mà không xử phạt.</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleResolveSubmit}
                className="px-4 py-2 bg-[#0F766E] text-white hover:bg-[#0D5E58] rounded-lg text-sm font-semibold transition-colors"
              >
                Xác nhận xử lý
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
