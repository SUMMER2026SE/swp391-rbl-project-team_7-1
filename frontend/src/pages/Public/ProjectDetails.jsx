import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';

export default function ProjectDetails() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await projectService.getProjectById(id);
          setProject(data.project || data);
        } else {
          // For demo purposes, we will keep rendering the static layout if no ID
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
    return <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;
  }


  return (
    <main className={`flex-1 px-6 md:px-12 w-full bg-slate-50 min-h-screen ${!token ? 'pt-28 md:pt-32' : 'pt-8'}`}>
      <div className="max-w-[1440px] mx-auto">
        {/*  Breadcrumbs & Back  */}
        <div className="mb-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/browse-projects')} className="flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-colors text-sm font-semibold cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Quay lại Dự án
          </button>
          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-teal-600 transition-colors p-1"><span className="material-symbols-outlined text-[20px]">share</span></button>
            <button className="hover:text-teal-600 transition-colors p-1"><span className="material-symbols-outlined text-[20px]">bookmark_border</span></button>
          </div>
        </div>

        {/*  Bento Grid Layout for Project Details  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/*  Main Brief Column (Left)  */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/*  Header Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              {errorMsg && <div className="mb-4 text-red-500 font-medium">{errorMsg}</div>}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-teal-950 tracking-tight">
                    {project ? project.title : 'Enterprise Dashboard Redesign'}
                  </h1>
                  <div className="flex items-center gap-5 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> Đăng 2 giờ trước</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">public</span> Từ xa</span>
                  </div>
                </div>
                <div className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-teal-100/50">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span> UI/UX Design
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">Figma</span>
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">UI/UX</span>
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">Dashboard Design</span>
              </div>
            </div>

            {/*  Detailed Description Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-teal-950">Mô tả dự án</h3>
              <div className="text-base space-y-5 text-slate-600 leading-relaxed">
                <p>{project ? project.description : 'Chúng tôi tìm kiếm nhà thiết kế UI/UX giàu kinh nghiệm để cải tạo toàn bộ bảng điều khiển nội bộ doanh nghiệp. Hệ thống hiện tại đã lỗi thời và nhóm cần giao diện hiện đại, hiệu quả cao để quản lý vận hành hàng ngày.'}</p>
                {!project && (
                  <>
                    <p><strong className="text-teal-900">Yêu cầu chính:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Đánh giá toàn diện bảng điều khiển hiện tại.</li>
                  <li>Tạo wireframe và prototype chất lượng cao trên Figma.</li>
                  <li>Thiết kế thư viện component có thể mở rộng.</li>
                  <li>Đảm bảo khả năng tiếp cận (WCAG 2.1 AA) và hiển thị trên desktop/tablet.</li>
                </ul>
                <p><strong className="text-teal-900">Kết quả bàn giao:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>File Figma với các component được tổ chức rõ ràng.</li>
                  <li>Prototype có thể click thể hiện các luồng người dùng chính.</li>
                  <li>Tài liệu bàn giao cho developer.</li>
                </ul>
                <p>Chúng tôi đang tìm những người có portfolio mạnh thể hiện trực quan hóa dữ liệu phức tạp và thiết kế doanh nghiệp hiện đại. Vui lòng đính kèm case study liên quan trong đề xuất.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/*  Sidebar / Action Column (Right)  */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/*  Action Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-8">
                <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-2">Ngân sách</p>
                <p className="text-3xl font-extrabold text-teal-950">
                  {project ? `${project.budget_min?.toLocaleString()} - ${project.budget_max?.toLocaleString()} VNĐ` : '$5,000 - $8,000'}
                </p>
              </div>
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Hạn chạy</p>
                  <p className="text-base font-bold text-slate-800">4 Tuần</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Cần tuyển</p>
                  <p className="text-base font-bold text-slate-800">{project?.required_freelancer_count || 1} người</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Đề xuất</p>
                  <p className="text-base font-bold text-slate-800">12</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(token ? `/submit-proposal/${id || ''}` : '/login')}
                className="w-full bg-[#0F766E] text-white font-bold text-base py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-5 flex justify-center items-center gap-2 border-none"
              >
                Nộp đề xuất <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-sm bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-emerald-700">
                <span className="material-symbols-outlined text-[20px]" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
                <strong className="font-semibold">Bảo mật bởi VNPay Escrow</strong>
              </div>
            </div>

            {/*  Employer Info Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold mb-6 text-teal-950">Về Nhà tuyển dụng</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center font-bold text-xl border border-teal-100 text-teal-700 shadow-sm">
                  TN
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">TechNova Corp</h4>
                  <div className="flex items-center gap-1 text-sm text-teal-600 font-medium mt-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span> Đã xác minh
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-500 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Vị trí</span>
                  <span className="text-slate-800 font-bold">United States</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dự án đã đăng</span>
                  <span className="text-slate-800 font-bold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tỷ lệ thuê</span>
                  <span className="text-slate-800 font-bold">82%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Thành viên từ</span>
                  <span className="text-slate-800 font-bold">Oct 2021</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
