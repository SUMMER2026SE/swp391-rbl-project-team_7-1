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

  const isOwner = currentUser && project && currentUser.user_id === project.employer_id;

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
    <main className={`flex-1 px-6 md:px-12 w-full bg-slate-50 min-h-screen ${!token ? 'pt-28 md:pt-32' : 'pt-8'}`}>
      <div className="max-w-[1440px] mx-auto">
        {/* Breadcrumbs & Back */}
        <div className="mb-6 flex items-center justify-between w-full">
          <button 
            onClick={() => {
              if (currentUser?.role === 'EMPLOYER') {
                navigate('/my-projects');
              } else {
                navigate('/browse-projects');
              }
            }} 
            className="flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-colors text-sm font-semibold cursor-pointer bg-transparent border-none"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Quay lại danh sách dự án
          </button>
          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-teal-600 transition-colors p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button className="hover:text-teal-600 transition-colors p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/* Main Column (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              {errorMsg && <div className="mb-4 text-red-500 font-medium">{errorMsg}</div>}
              
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-teal-950 tracking-tight leading-tight">
                    {project ? project.title : 'Enterprise Dashboard Redesign'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span> 
                      {project && project.created_at ? `Đăng ngày ${new Date(project.created_at).toLocaleDateString('vi-VN')}` : 'Đăng 2 giờ trước'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">public</span> 
                      {project?.address || 'Từ xa / Việt Nam'}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  {project ? getStatusBadge(project.status) : (
                    <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-teal-100">
                      Đang tuyển
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center mr-2">Danh mục:</span>
                <span className="bg-teal-50 text-teal-700 text-xs px-3.5 py-1.5 rounded-lg font-bold border border-teal-100/50">
                  {project ? project.category_name : 'UI/UX Design'}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-teal-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">description</span>
                Mô tả chi tiết dự án
              </h3>
              <div className="text-base space-y-5 text-slate-600 leading-relaxed">
                <p className="whitespace-pre-line font-medium text-slate-700">
                  {project ? project.description : 'Chúng tôi tìm kiếm nhà thiết kế UI/UX giàu kinh nghiệm để cải tạo toàn bộ bảng điều khiển nội bộ doanh nghiệp.'}
                </p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-teal-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">psychology</span>
                Kỹ năng & Chuyên môn yêu cầu
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {project && project.skills && project.skills.length > 0 ? (
                  project.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-50 text-slate-700 text-sm px-4 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm hover:border-teal-300 transition-colors">
                      {skill}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-slate-50 text-slate-700 text-sm px-4 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm">Figma</span>
                    <span className="bg-slate-50 text-slate-700 text-sm px-4 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm">UI/UX</span>
                    <span className="bg-slate-50 text-slate-700 text-sm px-4 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm">Dashboard Design</span>
                  </>
                )}
              </div>
            </div>

            {/* Document Attachments */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-teal-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">attachment</span>
                Tài liệu đính kèm
              </h3>
              {project && project.attachment_url ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#0F766E] text-[32px]">description</span>
                    <div>
                      <p className="text-sm font-bold text-slate-700 truncate max-w-[250px] md:max-w-md">
                        {project.attachment_url.split('/').pop()}
                      </p>
                      <p className="text-xs text-slate-400">Tệp tài liệu đính kèm dự án</p>
                    </div>
                  </div>
                  <a 
                    href={project.attachment_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-teal-600 hover:text-teal-800 font-bold text-sm flex items-center gap-1 cursor-pointer no-underline bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span> Tải xuống
                  </a>
                </div>
              ) : (
                <p className="text-slate-400 font-semibold text-sm">Không có tài liệu đính kèm cho dự án này.</p>
              )}
            </div>

            {/* Related Projects */}
            {project && project.relatedProjects && project.relatedProjects.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold mb-6 text-teal-950 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">workspaces</span>
                  Dự án tương tự
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.relatedProjects.map((rel) => (
                    <div 
                      key={rel.project_id} 
                      onClick={() => navigate(`/project-details/${rel.project_id}`)}
                      className="border border-slate-200 rounded-xl p-5 hover:border-teal-500 hover:shadow-sm cursor-pointer transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <span className="bg-teal-50 text-[#0F766E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100/40 mb-2.5 inline-block">
                          {rel.category_name}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-teal-700 transition-colors mb-3 leading-snug">
                          {rel.title}
                        </h4>
                      </div>
                      <div className="border-t border-slate-100 pt-3 mt-3">
                        <span className="text-xs text-slate-400 block font-semibold mb-0.5">Ngân sách tối đa</span>
                        <span className="text-sm font-extrabold text-teal-950">
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
            
            {/* Action & Budget Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Mức Ngân Sách Đề Xuất</p>
                <p className="text-3xl font-black text-teal-950 tracking-tight">
                  {project ? (
                    project.budget_type === 'HOURLY'
                      ? `${parseInt(project.budget_min || 0).toLocaleString()} - ${parseInt(project.budget_max || 0).toLocaleString()} VNĐ/h`
                      : `${parseInt(project.budget_min || 0).toLocaleString()} - ${parseInt(project.budget_max || 0).toLocaleString()} VNĐ`
                  ) : '$5,000 - $8,000'}
                </p>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-bold mt-2.5 inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">payments</span>
                  {project?.budget_type === 'HOURLY' ? 'Hợp đồng theo giờ' : 'Hợp đồng trọn gói'}
                </span>
              </div>

              {/* Deadline & Details Grid */}
              <div className="grid grid-cols-3 gap-2 py-6 my-6 border-y border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Hạn Chạy</p>
                  <p className="text-sm font-extrabold text-slate-800">
                    {project && project.deadline ? new Date(project.deadline).toLocaleDateString('vi-VN') : '4 Tuần'}
                  </p>
                </div>
                <div className="border-x border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Cần Tuyển</p>
                  <p className="text-sm font-extrabold text-slate-800">{project?.required_freelancer_count || 1} người</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Trạng thái</p>
                  <p className="text-sm font-extrabold text-teal-700">{project ? project.status : 'OPEN'}</p>
                </div>
              </div>

              {/* Primary Action Button */}
              {isOwner ? (
                <button 
                  onClick={() => navigate(`/edit-project/${project.project_id}`)}
                  className="w-full bg-[#0F766E] text-white font-bold text-base py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-4 flex justify-center items-center gap-2 border-none cursor-pointer"
                >
                  Chỉnh sửa dự án <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate(token ? `/submit-proposal/${id || ''}` : '/login')}
                  className="w-full bg-[#0F766E] text-white font-bold text-base py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-4 flex justify-center items-center gap-2 border-none cursor-pointer"
                >
                  Nộp đề xuất ứng tuyển <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-emerald-700">
                <span className="material-symbols-outlined text-[18px]" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
                <strong className="font-semibold">Bảo mật thanh toán bởi VNPay Escrow</strong>
              </div>
            </div>

            {/* Employer Info Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold mb-6 text-teal-950">Về Nhà tuyển dụng</h3>
              
              <div className="flex items-center gap-4 mb-6">
                {project && project.avatar_url ? (
                  <img src={project.avatar_url} alt={project.company_name} className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm" />
                ) : (
                  <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center font-bold text-xl border border-teal-100 text-teal-700 shadow-sm shrink-0">
                    {project && project.company_name ? project.company_name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'TN'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="text-base font-bold text-slate-800 truncate">
                    {project ? project.company_name : 'TechNova Corp'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-teal-600 font-bold mt-1">
                    <span className="material-symbols-outlined text-[14px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span> Đã xác minh
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-500 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Vị trí</span>
                  <span className="text-slate-800 font-bold">{project ? project.location || 'Từ xa / Việt Nam' : 'United States'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số dự án đã đăng</span>
                  <span className="text-slate-800 font-bold">{project?.employerTotalProjects || 1} dự án</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tỷ lệ tuyển dụng</span>
                  <span className="text-slate-800 font-bold">{project ? project.employerHireRate : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tham gia từ</span>
                  <span className="text-slate-800 font-bold">
                    {project && project.company_joined_at ? new Date(project.company_joined_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' }) : 'Thg 10, 2024'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100/60">
                  <span className="font-medium">Email liên hệ</span>
                  <span className="text-slate-800 font-bold truncate max-w-[170px]" title={project?.contact_email}>
                    {project ? project.contact_email || '—' : 'contact@technova.com'}
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
