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

      {/* Styled inline keyframes for text slide-up fade in */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-greeting {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Simple Clean Header */}
      <div className="pt-8 pb-8 px-6 md:px-12 bg-white border-b border-slate-100 shadow-sm relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 animate-greeting">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Quản lý dự án đăng</span>
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2">
              Dự án của tôi
            </h1>
            <p className="text-slate-500 font-semibold text-sm max-w-2xl leading-relaxed">
              Theo dõi tình trạng tuyển dụng, chỉnh sửa nội dung dự án, và duyệt hồ sơ đề xuất từ các Freelancer.
            </p>
          </div>
          
          <Link 
            to="/post-project" 
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F766E] text-white rounded-xl text-sm font-black hover:bg-[#0D5E58] shadow-[0_5px_15px_rgba(15,118,110,0.2)] hover:shadow-[0_10px_20px_rgba(15,118,110,0.3)] transition-all active:scale-[0.98] cursor-pointer border-none shrink-0"
          >
            <span className="material-symbols-outlined font-black text-[18px]">add</span> Đăng dự án mới
          </Link>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số dự án</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                <span className="material-symbols-outlined text-[20px]">work</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3">{totalProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tuyển</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3 text-emerald-650">{openProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã đóng</span>
              <div className="w-9 h-9 rounded-xl bg-slate-55 flex items-center justify-center text-slate-500 border border-slate-150">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3 text-slate-500">{closedProjects}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đề xuất chờ duyệt</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mt-3 text-indigo-600">{pendingProposalsCount}</p>
          </div>
        </div>

        {/* Toolbar Filter & Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">Dự án tuyển dụng của bạn</h2>
            <p className="text-slate-400 text-xs mt-0.5 font-semibold">Lọc nhanh danh sách dự án.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dự án..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F766E]/5 focus:border-[#0F766E]/30 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto shrink-0">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all ${statusFilter === 'ALL' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setStatusFilter('OPEN')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all ${statusFilter === 'OPEN' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Đang mở
              </button>
              <button 
                onClick={() => setStatusFilter('CLOSED')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black transition-all ${statusFilter === 'CLOSED' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Đã đóng
              </button>
            </div>
          </div>
        </div>

        {/* Card Horizontal List Area */}
        {loading ? (
          <div className="text-center py-28 text-slate-500 font-bold flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Đang tải danh sách dự án...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-slate-400 flex flex-col items-center justify-center px-6 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
              <span className="material-symbols-outlined text-[30px]">find_in_page</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Không tìm thấy dự án</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6 text-center">Bạn chưa đăng dự án nào phù hợp với bộ lọc tìm kiếm hiện tại.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredProjects.map((project) => (
              <div 
                key={project.project_id} 
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Left Section: Info & Status */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-50 text-[#0F766E] border border-teal-100/50">
                      {project.category_name || 'Lập trình Web'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      project.status === 'OPEN' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${project.status === 'OPEN' ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                      {project.status === 'OPEN' ? 'Đang mở tuyển' : 'Đã đóng'}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold">
                      Mã: #{project.project_id}
                    </span>
                  </div>

                  <Link 
                    to={`/project-details/${project.project_id}`} 
                    className="font-black text-slate-800 hover:text-[#0F766E] transition-colors text-base md:text-lg mb-1.5 block truncate max-w-xl"
                  >
                    {project.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-[#0F766E] font-bold">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      {project.budget_max ? `${Math.round(project.budget_max).toLocaleString('vi-VN')} đ` : 'Thương lượng'}
                      <span className="text-[10px] font-medium text-slate-450 ml-1">
                        ({project.budget_type === 'HOURLY' ? 'Theo giờ' : 'Gói cố định'})
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      Hạn chót: {project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </span>
                  </div>
                </div>

                {/* Right Section: Action Controls */}
                <div className="shrink-0 flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                  {/* Proposals Counter Link */}
                  <Link 
                    to={`/manage-proposals/${project.project_id}`} 
                    className="flex items-center gap-2 group/prop mr-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100/50 flex items-center justify-center font-black text-[#0F766E] text-xs shadow-inner group-hover/prop:bg-[#0F766E] group-hover/prop:text-white transition-all">
                      {project.proposalsCount || 0}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 group-hover/prop:text-[#0F766E] transition-colors uppercase tracking-wider">Đề xuất</span>
                      <span className="text-[9px] font-bold text-slate-300">Xem chi tiết</span>
                    </div>
                  </Link>

                  {/* Operational Buttons */}
                  <div className="flex items-center gap-1.5">
                    {project.status === 'OPEN' && (
                      <>
                        <Link 
                          to={`/edit-project/${project.project_id}`} 
                          className="w-9 h-9 rounded-xl border border-slate-100 hover:border-teal-200 text-slate-400 hover:text-[#0F766E] hover:bg-teal-50/30 transition-all flex items-center justify-center"
                          title="Chỉnh sửa dự án"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button 
                          onClick={() => handleCloseProject(project.project_id)}
                          className="w-9 h-9 rounded-xl border border-slate-100 hover:border-amber-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 transition-all flex items-center justify-center cursor-pointer bg-transparent"
                          title="Đóng dự án"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => handleDeleteProject(project.project_id)}
                      className="w-9 h-9 rounded-xl border border-slate-100 hover:border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all flex items-center justify-center cursor-pointer bg-transparent"
                      title="Xóa dự án"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
