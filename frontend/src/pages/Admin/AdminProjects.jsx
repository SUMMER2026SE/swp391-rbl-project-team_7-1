import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/admin/projects';

export default function AdminProjects() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const token = (() => {
    const raw = localStorage.getItem('token');
    return raw && raw !== 'null' && raw !== 'undefined' ? raw : null;
  })();

  const fetchProjects = async (opts = {}) => {
    setLoading(true);
    setAlert({ type: '', msg: '' });
    if (!token) {
      setAlert({ type: 'error', msg: 'Vui lòng đăng nhập để truy cập trang này.' });
      setLoading(false);
      return;
    }
    try {
      const q = new URLSearchParams();
      const p = opts.page || page;
      if (search) q.set('q', search);
      const sf = opts.status !== undefined ? opts.status : statusFilter;
      if (sf) q.set('status', sf);
      q.set('page', p);
      q.set('limit', '10');

      const res = await fetch(`${API}/all?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Không thể tải danh sách dự án.' });
      } else {
        setProjects(data.data?.projects || []);
        setTotal(data.data?.total || 0);
        setPage(data.data?.page || 1);
        setTotalPages(data.data?.totalPages || 1);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects({ page: 1, status: initialStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStatus]);

  const handleSearchSubmit = () => {
    setPage(1);
    fetchProjects({ page: 1 });
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setPage(1);
    fetchProjects({ page: 1, status: '' });
  };

  const handleApprove = async (projectId) => {
    // Close detail modal immediately before showing confirm dialog
    setShowDetail(false);
    setSelectedProject(null);

    const result = await Swal.fire({
      title: 'Duyệt dự án này?',
      text: 'Bạn có chắc muốn duyệt dự án này và cho phép hiển thị công khai trên hệ thống?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0F766E',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Đồng ý duyệt',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/${projectId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Duyệt dự án thất bại.' });
      } else {
        setAlert({ type: 'success', msg: 'Dự án đã được duyệt thành công.' });
        fetchProjects();
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ.' });
    }
  };

  const handleReject = async (projectId) => {
    // Close detail modal immediately before showing confirm dialog
    setShowDetail(false);
    setSelectedProject(null);

    const result = await Swal.fire({
      title: 'Từ chối duyệt dự án?',
      text: 'Bạn có chắc chắn muốn từ chối duyệt dự án này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/${projectId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Từ chối bởi Admin' })
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Từ chối duyệt thất bại.' });
      } else {
        setAlert({ type: 'success', msg: 'Đã từ chối duyệt dự án này.' });
        fetchProjects();
        setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ.' });
    }
  };

  const viewDetail = async (projectId) => {
    try {
      const res = await fetch(`${API}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProject(data.data);
        setShowDetail(true);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Không thể tải chi tiết dự án.' });
    }
  };

  const formatBudget = (min) => {
    return (min || 0).toLocaleString('vi-VN') + ' đ';
  };

  const getStatusBadge = (status) => {
    let badgeClass = 'bg-slate-50 text-slate-700 border-slate-100';
    let dotClass = 'bg-slate-400';
    let label = status;

    switch (status) {
      case 'OPEN':
        badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-100';
        dotClass = 'bg-emerald-500';
        label = 'Đang tuyển';
        break;
      case 'CLOSED':
        badgeClass = 'bg-amber-50 text-amber-700 border border-amber-100';
        dotClass = 'bg-amber-500';
        label = 'Chờ duyệt';
        break;
      case 'REJECTED':
        badgeClass = 'bg-rose-50 text-rose-700 border border-rose-100';
        dotClass = 'bg-rose-500';
        label = 'Từ chối';
        break;
      case 'IN_PROGRESS':
        badgeClass = 'bg-blue-50 text-blue-700 border border-blue-100';
        dotClass = 'bg-blue-500';
        label = 'Đang tiến hành';
        break;
      case 'COMPLETED':
        badgeClass = 'bg-teal-50 text-teal-700 border border-teal-100';
        dotClass = 'bg-teal-500';
        label = 'Đã hoàn thành';
        break;
      case 'CANCELED':
        badgeClass = 'bg-slate-100 text-slate-600 border border-slate-200';
        dotClass = 'bg-slate-400';
        label = 'Đã hủy';
        break;
      default:
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass} whitespace-nowrap`}>
        <span className={`w-1 h-1 rounded-full ${dotClass}`}></span>
        {label}
      </span>
    );
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tổng dự án hệ thống</h1>
            <p className="text-xs text-slate-450 font-semibold">Theo dõi, kiểm tra chi tiết và quản lý toàn bộ tin đăng dự án của Nhà tuyển dụng.</p>
          </div>
          <div className="bg-[#0F766E]/5 border border-[#0F766E]/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 self-start md:self-auto">
            <span className="material-symbols-outlined text-[#0F766E] text-[18px]">folder</span>
            <span className="text-xs font-extrabold text-[#0F766E]">Tổng cộng: {total} dự án</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:max-w-2xl">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 transition-all duration-200"
                  placeholder="Tìm theo tiêu đề dự án hoặc tên nhà tuyển dụng..."
                  type="text"
                />
              </div>
              <div className="relative w-full sm:w-60">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                    fetchProjects({ page: 1, status: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-650 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all cursor-pointer"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="CLOSED">Chờ duyệt</option>
                  <option value="REJECTED">Từ chối duyệt</option>
                  <option value="OPEN">Đang tuyển dụng</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button 
                onClick={handleSearchSubmit} 
                className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border-none"
              >
                Tìm kiếm
              </button>
              <button 
                onClick={handleReset} 
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-1 ${
            alert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <span className="material-symbols-outlined text-[16px]">
              {alert.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{alert.msg}</span>
          </div>
        )}

        {/* Project Detail Modal */}
        {showDetail && selectedProject && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F766E]">info</span>
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">Thông tin chi tiết dự án</h2>
                </div>
                <button onClick={() => setShowDetail(false)} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-slate-400 border-none bg-transparent">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="space-y-5 text-left">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tiêu đề công việc</label>
                  <p className="text-slate-800 font-bold text-sm mt-0.5">{selectedProject.title}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mô tả công việc</label>
                  <p className="text-slate-700 text-xs font-semibold leading-relaxed mt-1 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedProject.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lĩnh vực chính</label>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.category_name || 'Khác'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mức ngân sách</label>
                    <p className="text-[#0F766E] font-extrabold text-xs mt-0.5">{formatBudget(selectedProject.budget_min)}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số lượng cần tuyển</label>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.required_freelancer_count || 1} người</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nhà tuyển dụng đăng tin</label>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.employer_name || 'Không xác định'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hạn nhận hồ sơ</label>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trạng thái dự án</label>
                    <div className="mt-1">{getStatusBadge(selectedProject.status)}</div>
                  </div>
                </div>
                {selectedProject.skills && selectedProject.skills.length > 0 && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kỹ năng yêu cầu</label>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedProject.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-teal-50 text-[#0F766E] border border-teal-100/50 rounded-lg text-[10px] font-bold">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProject.status === 'CLOSED' && (
                  <div className="flex items-center gap-2 pt-5 border-t border-slate-150 justify-end">
                    <button onClick={() => handleApprove(selectedProject.project_id)} className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none shadow-sm">
                      Duyệt dự án
                    </button>
                    <button onClick={() => handleReject(selectedProject.project_id)} className="px-4 py-2 border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                      Từ chối duyệt
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-150">
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiêu đề dự án</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nhà tuyển dụng</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lĩnh vực</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Ngân sách</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Số lượng tuyển</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Trạng thái</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Ngày tạo</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách dự án...</p>
                      </div>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-slate-400 font-bold text-xs">
                      Không tìm thấy dự án nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.project_id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-5 max-w-[200px] truncate" title={project.title}>
                        <div className="font-bold text-slate-800 text-xs hover:text-[#0F766E] cursor-pointer transition-colors truncate" onClick={() => viewDetail(project.project_id)}>{project.title}</div>
                      </td>
                      <td className="py-3 px-5 text-xs font-bold text-slate-500">{project.employer_name || 'N/A'}</td>
                      <td className="py-3 px-5">
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[10px] font-bold whitespace-nowrap">{project.category_name || 'Khác'}</span>
                      </td>
                      <td className="py-3 px-5 text-xs font-extrabold text-[#0F766E] whitespace-nowrap">
                        {formatBudget(project.budget_min)}
                      </td>
                      <td className="py-3 px-5 text-xs font-bold text-slate-500 whitespace-nowrap">
                        {project.required_freelancer_count || 1} người
                      </td>
                      <td className="py-3 px-5 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="py-3 px-5 text-xs text-slate-400 font-semibold whitespace-nowrap">{new Date(project.created_at).toLocaleDateString('vi-VN', { dateStyle: 'short' })}</td>
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => viewDetail(project.project_id)} className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-655 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer">
                            Chi tiết
                          </button>
                          {project.status === 'CLOSED' && (
                            <>
                              <button onClick={() => handleApprove(project.project_id)} className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] text-white hover:bg-[#0D5E58] text-xs font-bold transition-all cursor-pointer border-none shadow-sm">
                                Duyệt
                              </button>
                              <button onClick={() => handleReject(project.project_id)} className="px-3.5 py-1.5 rounded-lg border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer">
                                Từ chối
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Hiển thị {projects.length} trên tổng số {total} dự án.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (page > 1) {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    fetchProjects({ page: nextPage });
                  }
                }}
                disabled={page <= 1}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => {
                  if (page < totalPages) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchProjects({ page: nextPage });
                  }
                }}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
