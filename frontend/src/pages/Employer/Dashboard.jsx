import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function EmployerDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [recommendations, setRecommendations] = useState({});
  const [loadingRecs, setLoadingRecs] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

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

  const fetchRecommendations = async (projectId) => {
    if (recommendations[projectId] || loadingRecs[projectId]) return;
    setLoadingRecs(prev => ({ ...prev, [projectId]: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/recommendations/projects/${projectId}/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setRecommendations(prev => ({ ...prev, [projectId]: data.data || [] }));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoadingRecs(prev => ({ ...prev, [projectId]: false }));
    }
  };

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
        fetchMyProjects(); // Reload list
        setTimeout(() => setToastMsg(''), 3000);
      } else {
        alert(data.message || 'Lỗi khi đóng dự án.');
      }
    } catch (err) {
      console.error('Error closing project:', err);
      alert('Lỗi mạng khi thực hiện đóng dự án.');
    }
  };

  // Metrics
  const totalProjects = projects.length;
  const openProjects = projects.filter(p => p.status === 'OPEN').length;
  const closedProjects = projects.filter(p => p.status === 'CLOSED').length;
  const pendingProposalsCount = projects.reduce((acc, p) => acc + (p.proposalsCount || 0), 0);

  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-0 bg-slate-50">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white text-slate-800 px-6 py-4 rounded-2xl shadow-xl border border-slate-100 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-500">check_circle</span>
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/*  Canvas  */}
      <div className="pt-8 md:pt-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/*  Header  */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display-hero text-display-hero text-[#1E293B] mb-2 font-bold">Quản lý Dự án &amp; Nhân sự</h1>
            <p className="font-body-base text-body-base text-[#475569]">Dưới đây là tóm tắt các hoạt động và công việc đang chờ xử lý của bạn.</p>
          </div>
          <Link 
            to="/post-project" 
            className="px-6 py-3 bg-[#0F766E] text-white rounded-xl font-bold hover:bg-[#0D5E58] hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 self-start md:self-auto border-none"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Đăng dự án mới
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {/*  Key Metrics Bento Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0F766E]">
                <span className="material-symbols-outlined">work</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">Tổng số dự án</h3>
            </div>
            <p className="text-3xl font-extrabold text-[#1E293B]">{totalProjects}</p>
            <p className="text-xs text-slate-400 mt-2">Đã tạo trên hệ thống</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">Dự án đang mở</h3>
            </div>
            <p className="text-3xl font-extrabold text-[#1E293B]">{openProjects}</p>
            <p className="text-xs text-[#0F766E] mt-2">Sẵn sàng nhận đề xuất</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">block</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">Dự án đã đóng</h3>
            </div>
            <p className="text-3xl font-extrabold text-[#1E293B]">{closedProjects}</p>
            <p className="text-xs text-slate-400 mt-2">Hết hạn hoặc đã dừng</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-500">Tổng số đề xuất</h3>
            </div>
            <p className="text-3xl font-extrabold text-[#1E293B]">{pendingProposalsCount}</p>
            <p className="text-xs text-slate-400 mt-2">Từ các freelancer gửi đến</p>
          </div>
        </div>

        {/* Recommended Freelancers Section */}
        {projects.filter(p => p.status === 'OPEN').length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Gợi ý Freelancer</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.filter(p => p.status === 'OPEN').slice(0, 2).map(project => (
                <div key={project.project_id} className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0F766E] truncate max-w-[200px]">{project.title}</h3>
                    <button
                      onClick={() => fetchRecommendations(project.project_id)}
                      disabled={loadingRecs[project.project_id]}
                      className="text-xs font-semibold text-[#0F766E] hover:bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 transition-all disabled:opacity-50"
                    >
                      {loadingRecs[project.project_id] ? 'Loading...' : 'Xem gợi ý'}
                    </button>
                  </div>

                  {loadingRecs[project.project_id] && (
                    <div className="text-center py-6 text-sm text-slate-500">Đang phân tích dữ liệu...</div>
                  )}

                  {!loadingRecs[project.project_id] && recommendations[project.project_id] && recommendations[project.project_id].length > 0 && (
                    <div className="space-y-3">
                      {recommendations[project.project_id].slice(0, 3).map(freelancer => (
                        <div key={freelancer.userId} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-[#0F766E] text-sm font-bold shrink-0">
                            {freelancer.fullName ? freelancer.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'FL'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-slate-800 truncate">{freelancer.fullName}</p>
                              <span className="text-xs font-bold text-[#0F766E] shrink-0">{freelancer.recommendationScore}%</span>
                            </div>
                            {freelancer.headline && (
                              <p className="text-xs text-slate-500 truncate">{freelancer.headline}</p>
                            )}
                            {freelancer.recommendationReasons && freelancer.recommendationReasons.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {freelancer.recommendationReasons.slice(0, 2).map((reason, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                                    {reason}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingRecs[project.project_id] && recommendations[project.project_id] && recommendations[project.project_id].length === 0 && (
                    <div className="text-center py-4 text-sm text-slate-400">No recommendations available</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project List Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 mb-12">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Danh sách dự án của bạn</h2>
          
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-semibold">Đang tải dữ liệu...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-2">find_in_page</span>
              <p>Bạn chưa đăng dự án nào trên hệ thống.</p>
              <Link to="/post-project" className="text-[#0F766E] font-bold mt-2 inline-block hover:underline">
                Đăng dự án đầu tiên của bạn ngay!
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-slate-400 text-xs uppercase font-bold">
                    <th className="pb-3 font-semibold">Tên dự án</th>
                    <th className="pb-3 font-semibold">Danh mục</th>
                    <th className="pb-3 font-semibold">Ngân sách</th>
                    <th className="pb-3 font-semibold">Thời hạn</th>
                    <th className="pb-3 font-semibold text-center">Trạng thái</th>
                    <th className="pb-3 font-semibold text-center">Đề xuất</th>
                    <th className="pb-3 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {projects.map((project) => (
                    <tr key={project.project_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-bold text-slate-800 max-w-xs truncate">
                        {project.title}
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-medium">
                        {project.category_name || 'Lập trình Web'}
                      </td>
                      <td className="py-4 text-sm font-bold text-[#0F766E]">
                        {project.budget_max ? `${Math.round(project.budget_max).toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                        <span className="block text-[10px] text-slate-400 font-semibold tracking-wider">
                          {project.budget_type === 'HOURLY' ? 'Theo giờ' : 'Cố định'}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-slate-600 font-semibold">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Không có'}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${project.status === 'OPEN' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {project.status === 'OPEN' ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </td>
                      <td className="py-4 text-center text-sm font-bold text-slate-600">
                        {project.proposalsCount || 0}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link 
                            to={`/manage-proposals/${project.project_id}`} 
                            className="px-3 py-1.5 text-xs font-bold text-[#0F766E] hover:bg-teal-50 rounded-lg transition-all"
                          >
                            Đề xuất
                          </Link>
                          {project.status === 'OPEN' && (
                            <>
                              <Link 
                                to={`/edit-project/${project.project_id}`} 
                                className="p-1.5 text-slate-500 hover:text-[#0F766E] hover:bg-slate-100 rounded-lg transition-all"
                                title="Chỉnh sửa"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </Link>
                              <button 
                                onClick={() => handleCloseProject(project.project_id)}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                                title="Đóng dự án"
                              >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                              </button>
                            </>
                          )}
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
