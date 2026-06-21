import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api/admin/projects';

export default function ProjectModeration() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');
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
      q.set('page', p);
      q.set('limit', '10');

      const res = await fetch(`${API}/pending?${q.toString()}`, {
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
    fetchProjects({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (projectId) => {
    if (!window.confirm('Bạn có chắc muốn duyệt dự án này?')) return;
    try {
      const res = await fetch(`${API}/${projectId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Duyệt thất bại.' });
        return;
      }
      setAlert({ type: 'success', msg: 'Dự án đã được duyệt thành công!' });
      setSelectedProject(null);
      setShowDetail(false);
      fetchProjects();
      setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
    } catch (err) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ.' });
    }
  };

  const handleReject = async (projectId) => {
    if (!window.confirm('Bạn có chắc muốn từ chối dự án này?')) return;
    try {
      const res = await fetch(`${API}/${projectId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Từ chối bởi Admin' })
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Từ chối thất bại.' });
        return;
      }
      setAlert({ type: 'success', msg: 'Dự án đã bị từ chối.' });
      setSelectedProject(null);
      setShowDetail(false);
      fetchProjects();
      setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
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

  const formatBudget = (min, max, type) => {
    const fmt = (v) => (v || 0).toLocaleString('vi-VN') + ' đ';
    if (type === 'HOURLY') {
      return `${fmt(min)} - ${fmt(max)} / giờ`;
    }
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `Từ ${fmt(min)}`;
    if (max) return `Đến ${fmt(max)}`;
    return 'Thỏa thuận';
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">Duyệt dự án</h1>
          <p className="font-body-base text-body-base text-[#475569]">Quản lý và duyệt các dự án chờ xét duyệt.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchProjects({ page: 1 }); } }}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              placeholder="Tìm kiếm dự án..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setPage(1); fetchProjects({ page: 1 }); }} className="px-4 py-2 bg-[#0F766E] text-white rounded-lg text-sm font-semibold">Tìm kiếm</button>
            <button onClick={() => { setSearch(''); setPage(1); fetchProjects({ page: 1 }); }} className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">Đặt lại</button>
          </div>
        </div>

        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl ${alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'} border`}>
            {alert.msg}
          </div>
        )}

        {/* Project Detail Modal */}
        {showDetail && selectedProject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#334155]">Chi tiết dự án</h2>
                <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#475569]">Tiêu đề</label>
                  <p className="text-[#334155]">{selectedProject.title}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#475569]">Mô tả</label>
                  <p className="text-[#334155] whitespace-pre-wrap">{selectedProject.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Danh mục</label>
                    <p className="text-[#334155]">{selectedProject.category_name || 'Không có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Ngân sách</label>
                    <p className="text-[#334155]">{formatBudget(selectedProject.budget_min, selectedProject.budget_max, selectedProject.budget_type)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Nhà tuyển dụng</label>
                    <p className="text-[#334155]">{selectedProject.employer_name || 'Không xác định'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Email</label>
                    <p className="text-[#334155]">{selectedProject.employer_email || 'Không có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Hạn chót</label>
                    <p className="text-[#334155]">{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString('vi-VN') : 'Không có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Ngày tạo</label>
                    <p className="text-[#334155]">{new Date(selectedProject.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                {selectedProject.skills && selectedProject.skills.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-[#475569]">Kỹ năng yêu cầu</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedProject.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button onClick={() => handleApprove(selectedProject.project_id)} className="px-6 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D5E58] transition-all">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Duyệt dự án
                    </span>
                  </button>
                  <button onClick={() => handleReject(selectedProject.project_id)} className="px-6 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 border border-red-100 transition-all">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Từ chối
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569]">Dự án</th>
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569]">Nhà tuyển dụng</th>
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569]">Danh mục</th>
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569]">Ngân sách</th>
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569]">Ngày tạo</th>
                  <th className="py-4 px-6 text-sm font-semibold text-[#475569] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-[#475569]">Đang tải dữ liệu...</td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-[#475569]">Không có dự án chờ duyệt.</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.project_id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#334155]">{project.title}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#475569]">{project.employer_name || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-slate-50 text-slate-700 rounded-md text-xs">{project.category_name || 'Khác'}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-[#334155]">
                        {formatBudget(project.budget_min, project.budget_max, project.budget_type)}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#475569]">{new Date(project.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => viewDetail(project.project_id)} className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#475569] hover:bg-slate-50 text-xs font-semibold transition-colors">
                            Xem chi tiết
                          </button>
                          <button onClick={() => handleApprove(project.project_id)} className="px-3 py-1.5 rounded-md bg-[#0F766E] text-white hover:bg-[#0D5E58] text-xs font-semibold transition-colors">
                            Duyệt
                          </button>
                          <button onClick={() => handleReject(project.project_id)} className="px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-colors">
                            Từ chối
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-[#E2E8F0]">
          <div className="text-sm text-[#475569]">
            Hiển thị {projects.length} trên {total} dự án
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
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50 text-sm"
            >
              Trước
            </button>
            <span className="text-sm text-[#475569]">
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
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50 text-sm"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}