import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchMyProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/my/employer-projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProjects(data.projects || []);
      } else {
        setErrorMsg(data.message || 'Không thể tải danh sách dự án.');
      }
    } catch (err) {
      console.error('Error fetching employer projects:', err);
      setErrorMsg('Lỗi kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyProjects();
  }, [token]);

  const handleCloseProject = async (projectId) => {
    if (!window.confirm('Bạn có chắc chắn muốn đóng dự án này? Sau khi đóng, freelancer sẽ không thể gửi đề xuất mới.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToastMsg('Đã đóng dự án thành công!');
        fetchMyProjects();
        setTimeout(() => setToastMsg(''), 3000);
      } else {
        alert(data.message || 'Lỗi khi đóng dự án.');
      }
    } catch (err) {
      console.error('Error closing project:', err);
      alert('Lỗi mạng khi thực hiện đóng dự án.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này? Thao tác này không thể hoàn tác.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToastMsg('Đã xóa dự án thành công!');
        fetchMyProjects();
        setTimeout(() => setToastMsg(''), 3000);
      } else {
        alert(data.message || 'Lỗi khi xóa dự án.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Lỗi mạng khi thực hiện xóa dự án.');
    }
  };

  // Metrics
  const totalProjects = projects.length;
  const openProjects = projects.filter(p => p.status === 'OPEN').length;
  const closedProjects = projects.filter(p => p.status === 'CLOSED').length;
  const pendingProposalsCount = projects.reduce((acc, p) => acc + (p.proposalsCount || 0), 0);

  // Filtered Projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 min-h-screen pb-20 bg-[#F8FAFC]">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md text-slate-800 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(15,118,110,0.15)] border border-teal-100 max-w-sm animate-[bounce_1s_infinite]">
          <span className="material-symbols-outlined text-[24px] text-teal-600 font-bold">check_circle</span>
          <span className="font-bold text-sm text-slate-700">{toastMsg}</span>
        </div>
      )}

      {/* Styled inline keyframes for text slide-up fade in and floating blobs */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBlob1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes floatBlob3 {
          0% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(25px, 25px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(0.95); }
        }
        .animate-greeting {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-blob-1 {
          animation: floatBlob1 16s infinite ease-in-out;
        }
        .animate-blob-2 {
          animation: floatBlob2 20s infinite ease-in-out;
        }
        .animate-blob-3 {
          animation: floatBlob3 14s infinite ease-in-out;
        }
      `}} />

      {/* Light Header with Premium Blended Gradient & Subtle Dot Grid Pattern (Trend 2026 SaaS UI) */}
      <div className="pt-12 pb-14 px-6 md:px-12 bg-gradient-to-br from-[#F0F9F8] via-[#F3F8FC] to-[#F5FCF8] border-b border-slate-100/60 shadow-sm relative overflow-hidden">
        {/* Modern Dot Grid Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        {/* Soft Blended Pastel Aurora Blobs (Extremely subtle, sleek mesh style) */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-teal-200/10 to-emerald-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-1"></div>
        <div className="absolute bottom-[-40%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-sky-200/10 to-cyan-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-2"></div>
        <div className="absolute top-[0%] left-[40%] w-[380px] h-[380px] bg-gradient-to-r from-emerald-200/8 to-teal-200/8 rounded-full blur-[90px] pointer-events-none animate-blob-3"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 animate-greeting">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#0F766E] border border-slate-200/60 shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Quản lý dự án đăng</span>
            </div>
            
            <h1 className="text-4xl md:text-5.5xl font-black tracking-tight mb-3 leading-none pb-1 bg-gradient-to-r from-slate-900 via-[#0F766E] to-slate-800 bg-clip-text text-transparent">
              Dự án của tôi
            </h1>
            <p className="text-slate-500 font-semibold text-sm md:text-base max-w-2xl leading-relaxed">
              Theo dõi tình trạng tuyển dụng, chỉnh sửa nội dung dự án, và duyệt hồ sơ đề xuất từ các Freelancer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Project Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.015)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số dự án</span>
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                <span className="material-symbols-outlined text-[20px]">work</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3">{totalProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.015)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang nhận đề xuất</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3">{openProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.015)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dự án đã đóng</span>
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3">{closedProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.015)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đề xuất chờ duyệt</span>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3">{pendingProposalsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.04)] overflow-hidden">
          
          {/* Filters Area */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tất cả dự án tuyển dụng</h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">Lọc theo từ khóa hoặc trạng thái đóng/mở nhận hồ sơ.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm dự án..." 
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
                <button 
                  onClick={() => setStatusFilter('ALL')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ALL' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Tất cả
                </button>
                <button 
                  onClick={() => setStatusFilter('OPEN')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'OPEN' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Đang mở
                </button>
                <button 
                  onClick={() => setStatusFilter('CLOSED')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'CLOSED' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Đã đóng
                </button>
              </div>
            </div>
          </div>

          {/* Table Area */}
          {loading ? (
            <div className="text-center py-24 text-slate-500 font-bold flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Đang tải danh sách...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <span className="material-symbols-outlined text-[36px]">find_in_page</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy dự án</h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">Không tìm thấy dự án nào khớp với điều kiện lọc.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase font-bold tracking-wider bg-slate-50/50">
                    <th className="py-4 px-6 font-bold">Tên dự án</th>
                    <th className="py-4 px-6 font-bold">Danh mục</th>
                    <th className="py-4 px-6 font-bold">Ngân sách</th>
                    <th className="py-4 px-6 font-bold text-center">Trạng thái</th>
                    <th className="py-4 px-6 font-bold text-center">Số đề xuất</th>
                    <th className="py-4 px-6 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project) => (
                    <tr key={project.project_id} className="hover:bg-slate-50/70 transition-all duration-200 group">
                      <td className="py-5 px-6 max-w-xs md:max-w-sm">
                        <div className="flex flex-col min-w-0">
                          <Link 
                            to={`/project-details/${project.project_id}`} 
                            className="font-bold text-slate-800 hover:text-[#0F766E] transition-colors truncate text-sm md:text-base"
                          >
                            {project.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                            Hạn chót: {project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          {project.category_name || 'Lập trình Web'}
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-sm text-[#0F766E]">
                            {project.budget_max ? `${Math.round(project.budget_max).toLocaleString('vi-VN')} đ` : 'Thương lượng'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {project.budget_type === 'HOURLY' ? 'Theo giờ' : 'Gói cố định'}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border ${
                          project.status === 'OPEN' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'OPEN' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          {project.status === 'OPEN' ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </td>

                      <td className="py-5 px-6 text-center">
                        <Link 
                          to={`/manage-proposals/${project.project_id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-[#0F766E] text-slate-800 text-xs font-black shadow-inner transition-colors"
                        >
                          {project.proposalsCount || 0}
                        </Link>
                      </td>

                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/manage-proposals/${project.project_id}`} 
                            className="px-3.5 py-2 bg-teal-50 text-[#0F766E] font-bold text-xs rounded-xl hover:bg-[#0F766E] hover:text-white transition-all shadow-sm flex items-center gap-1 border border-teal-100/50"
                          >
                            <span className="material-symbols-outlined text-[14px]">group</span>
                            Hồ sơ ứng tuyển
                          </Link>

                          {project.status === 'OPEN' && (
                            <>
                              <Link 
                                to={`/edit-project/${project.project_id}`} 
                                className="p-2 text-slate-400 hover:text-[#0F766E] hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center"
                                title="Chỉnh sửa dự án"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </Link>
                              <button 
                                onClick={() => handleCloseProject(project.project_id)}
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all flex items-center justify-center cursor-pointer border-none bg-transparent"
                                title="Đóng dự án"
                              >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                              </button>
                            </>
                          )}

                          <button 
                            onClick={() => handleDeleteProject(project.project_id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center cursor-pointer border-none bg-transparent"
                            title="Xóa dự án"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
