import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';

export default function ProjectDetails() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u && u !== 'null' && u !== 'undefined' ? JSON.parse(u) : null;
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await projectService.getProjectById(id);
          setProject(data.project || data);
        }
      } catch (err) {
        setErrorMsg('Không thể tải thông tin dự án.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading && id) {
    return (
      <div className="flex-grow min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang tải thông tin chi tiết dự án...</p>
      </div>
    );
  }

  const currentUserId = currentUser?.userId || currentUser?.user_id || currentUser?.id;
  const isOwner = !!(currentUserId && project && currentUserId === project.employer_id);

  // Status mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Đang Tuyển
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Đang Thực Hiện
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Đã Hoàn Thành
          </span>
        );
      case 'CLOSED':
        return (
          <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Chờ duyệt
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Từ chối duyệt
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            {status || 'Đóng'}
          </span>
        );
    }
  };

  return (
    <main className={`flex-1 min-h-screen pb-20 bg-[#F8FAFC] relative ${!token ? 'pt-28 md:pt-32' : 'pt-6'}`}>
      {/* Background aurora effect */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#F0F9F8] to-[#F8FAFC] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Breadcrumb & Utilities */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <button 
            onClick={() => {
              if (currentUser?.role === 'EMPLOYER') {
                navigate('/my-projects');
              } else {
                navigate('/browse-projects');
              }
            }} 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0F766E] transition-all text-xs font-black uppercase tracking-wider bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm hover:shadow cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> 
            Quay lại danh sách dự án
          </button>

          <div className="flex items-center gap-2">
            <button className="hover:text-[#0F766E] hover:border-teal-200 transition-colors p-2.5 bg-white border border-slate-150 rounded-xl shadow-sm cursor-pointer flex items-center justify-center" title="Chia sẻ dự án">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
            <button className="hover:text-[#0F766E] hover:border-teal-200 transition-colors p-2.5 bg-white border border-slate-150 rounded-xl shadow-sm cursor-pointer flex items-center justify-center" title="Lưu tin tuyển dụng">
              <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)] relative overflow-hidden">
              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-teal-50 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-wide px-3 py-1 rounded-full border border-teal-100">
                      {project ? project.category_name : 'UI/UX Design'}
                    </span>
                    {project ? getStatusBadge(project.status) : (
                      <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-100">
                        Đang tuyển
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3.5xl font-black text-slate-800 tracking-tight leading-tight">
                    {project ? project.title : 'Enterprise Dashboard Redesign'}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 
                      {project && project.created_at ? `Đăng ngày ${new Date(project.created_at).toLocaleDateString('vi-VN')}` : 'Mới đăng'}
                    </span>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span> 
                      {project?.address || 'Từ xa / Việt Nam'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Info Cards Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 mt-8">
                <div className="bg-[#0F766E]/5 border border-[#0F766E]/10 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="material-symbols-outlined text-[#0F766E] text-2xl mb-2">payments</span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ngân Sách</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5 block">
                      {project ? `${parseInt(project.budget_max || 0).toLocaleString()}đ` : 'Liên hệ'}
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="material-symbols-outlined text-indigo-600 text-2xl mb-2">calendar_today</span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Hạn Chót Đề Xuất</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5 block">
                      {project && project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Liên hệ'}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50/50 border border-purple-100/50 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="material-symbols-outlined text-purple-600 text-2xl mb-2">groups</span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cần Tuyển</span>
                    <span className="text-sm font-black text-slate-800 mt-0.5 block">
                      {project?.required_freelancer_count || 1} Freelancer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">description</span>
                Mô tả chi tiết dự án
              </h3>
              <p className="text-sm font-semibold text-slate-600 whitespace-pre-line leading-relaxed">
                {project ? project.description : 'Chưa có mô tả chi tiết dự án.'}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">psychology</span>
                Kỹ năng & Chuyên môn yêu cầu
              </h3>
              <div className="flex flex-wrap gap-2">
                {project && project.skills && project.skills.length > 0 ? (
                  project.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-50 text-slate-700 text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-extrabold shadow-sm hover:border-[#0F766E] hover:text-[#0F766E] transition-all">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 font-semibold text-xs">Không yêu cầu kỹ năng cụ thể.</p>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">attachment</span>
                Tài liệu đính kèm
              </h3>
              {project && project.attachment_url ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 truncate max-w-[180px] sm:max-w-md">
                        {project.attachment_url.split('/').pop()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Tệp tài liệu dự án</p>
                    </div>
                  </div>
                  <a 
                    href={project.attachment_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3.5 py-2 text-slate-700 hover:text-[#0F766E] hover:border-teal-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span> 
                    Tải xuống
                  </a>
                </div>
              ) : (
                <p className="text-slate-400 font-semibold text-xs">Không có tài liệu đính kèm cho dự án này.</p>
              )}
            </div>

            {/* Related Projects */}
            {project && project.relatedProjects && project.relatedProjects.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F766E]">workspaces</span>
                  Dự án tương tự
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.relatedProjects.map((rel) => (
                    <div 
                      key={rel.project_id} 
                      onClick={() => navigate(`/project-details/${rel.project_id}`)}
                      className="border border-slate-100 rounded-2xl p-5 hover:border-teal-200 hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <span className="bg-teal-50 text-[#0F766E] text-[9px] font-black px-2 py-0.5 rounded-full border border-teal-100/40 mb-2.5 inline-block">
                          {rel.category_name}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 line-clamp-2 hover:text-[#0F766E] transition-colors mb-3 leading-snug">
                          {rel.title}
                        </h4>
                      </div>
                      <div className="border-t border-slate-50 pt-3 mt-3">
                        <span className="text-[10px] text-slate-400 block font-bold mb-0.5">Chi phí dự kiến</span>
                        <span className="text-xs font-black text-slate-800">
                          {rel.budget_max ? `${Math.round(rel.budget_max).toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Actions Card */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)] relative overflow-hidden">
              <div className="mb-6">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Mức Ngân Sách</span>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                  {project ? `${parseInt(project.budget_max || 0).toLocaleString()} đ` : 'Liên hệ'}
                </p>
              </div>

              {/* Deadline & Required Details */}
              <div className="grid grid-cols-2 gap-4 py-4 my-6 border-y border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Hạn nộp</p>
                  <p className="text-xs font-extrabold text-slate-700">
                    {project && project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : 'Liên hệ'}
                  </p>
                </div>
                <div className="border-l border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Cần tuyển</p>
                  <p className="text-xs font-extrabold text-slate-700">{project?.required_freelancer_count || 1} người</p>
                </div>
              </div>

              {/* CTA Button */}
              {isOwner ? (
                <button 
                  onClick={() => navigate(`/edit-project/${project.project_id}`)}
                  className="w-full bg-[#0F766E] text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(15,118,110,0.15)] hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-4 flex justify-center items-center gap-2 border-none cursor-pointer"
                >
                  Chỉnh sửa dự án <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate(token ? `/submit-proposal/${id || ''}` : '/login')}
                  className="w-full bg-[#0F766E] text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(15,118,110,0.15)] hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-4 flex justify-center items-center gap-2 border-none cursor-pointer"
                >
                  Nộp đề xuất ứng tuyển <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-700 mt-2 font-bold">
                <span className="material-symbols-outlined text-[16px]" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
                <span>Bảo mật thanh toán qua VNPay Escrow</span>
              </div>
            </div>

            {/* Employer Info */}
            <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
              <h3 className="text-sm font-bold text-slate-800 mb-5">Về nhà tuyển dụng</h3>
              
              <div className="flex items-center gap-3.5 mb-6">
                {project && project.avatar_url ? (
                  <img src={project.avatar_url} alt={project.company_name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center font-extrabold text-base border border-teal-100 text-teal-700 shadow-sm shrink-0">
                    {project && project.company_name ? project.company_name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'TN'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="text-sm font-extrabold text-slate-800 truncate">
                    {project ? project.company_name : 'TechNova Corp'}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-teal-600 font-black mt-1">
                    <span className="material-symbols-outlined text-[12px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span> 
                    Đã xác minh
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-500 border-t border-slate-50 pt-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Địa điểm</span>
                  <span className="text-slate-700 font-extrabold">{project ? project.location || 'Từ xa / Việt Nam' : 'Việt Nam'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Dự án đã đăng</span>
                  <span className="text-slate-700 font-extrabold">{project?.employerTotalProjects || 1} dự án</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tỷ lệ thuê</span>
                  <span className="text-slate-700 font-extrabold">{project ? project.employerHireRate : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tham gia từ</span>
                  <span className="text-slate-700 font-extrabold">
                    {project && project.company_joined_at ? new Date(project.company_joined_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' }) : 'Thg 10, 2024'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <span className="font-semibold">Email liên hệ</span>
                  <span className="text-slate-700 font-extrabold truncate max-w-[150px]" title={project?.contact_email}>
                    {project ? project.contact_email || '—' : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
