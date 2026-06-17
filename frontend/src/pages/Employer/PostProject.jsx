import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../../services/projectService';

export default function PostProject({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(['React Native', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await projectService.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch project details for Edit Mode
  useEffect(() => {
    if (editMode && id) {
      const fetchProjectDetails = async () => {
        try {
          const data = await projectService.getProjectById(id);
          if (data.success && data.project) {
            const p = data.project;
            setTitle(p.title);
            setCategoryId(p.category_id ? p.category_id.toString() : '');
            setDescription(p.description);
            setSkills(p.skills || []);
            setBudgetType(p.budget_type?.toLowerCase() === 'hourly' ? 'hourly' : 'fixed');
            setBudgetAmount(p.budget_max ? Math.round(p.budget_max).toString() : '');
            if (p.deadline) {
              setDeadline(p.deadline.substring(0, 10));
            }
          }
        } catch (err) {
          console.error('Failed to load project details', err);
          setErrorMsg('Không thể tải thông tin dự án.');
        }
      };
      fetchProjectDetails();
    }
  }, [editMode, id]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills([...skills, trimmed]);
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!title.trim() || !description.trim() || !categoryId || !budgetAmount) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      setLoading(false);
      return;
    }

    if (categoryId === 'other' && !customCategory.trim()) {
      setErrorMsg('Vui lòng nhập tên danh mục khác.');
      setLoading(false);
      return;
    }

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Ngân sách dự án phải lớn hơn 0 VNĐ.');
      setLoading(false);
      return;
    }

    if (deadline) {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setErrorMsg('Hạn chót hoàn thành không được ở trong quá khứ.');
        setLoading(false);
        return;
      }
    }

    try {
      const projectData = {
        title,
        description,
        categoryId: categoryId === 'other' ? 'other' : parseInt(categoryId),
        customCategory: categoryId === 'other' ? customCategory.trim() : '',
        budgetType: budgetType.toUpperCase(),
        budgetMin: amount,
        budgetMax: amount, // For simple projects, min = max
        deadline: deadline || null,
        skills
      };

      if (editMode) {
        await projectService.updateProject(id, projectData);
        setSuccessMsg('Cập nhật dự án thành công!');
      } else {
        await projectService.createProject(projectData);
        setSuccessMsg('Đăng dự án thành công!');
      }
      setTimeout(() => {
        navigate('/employer-dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra khi xử lý dự án.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="mb-8">
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">
            {editMode ? 'Chỉnh sửa Dự án' : 'Đăng Dự án Mới'}
          </h1>
          <p className="text-base text-slate-600">
            {editMode ? 'Cập nhật các thông tin của dự án bên dưới.' : 'Nhập thông tin bên dưới để tìm freelancer phù hợp nhất cho dự án của bạn.'}
          </p>
          
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="mt-4 p-4 bg-teal-50 text-teal-700 border border-teal-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  Form Area  */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
            {/*  Project Title  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="title">Tiêu đề dự án *</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 focus:outline-none" 
                id="title" 
                placeholder="Ví dụ: Phát triển Ứng dụng Di động Bán hàng" 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            {/*  Category  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="category">Danh mục *</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all appearance-none text-base text-slate-800 focus:outline-none cursor-pointer" 
                  id="category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option disabled value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                  <option value="other">Khác (Tự điền)...</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">expand_more</span>
              </div>
            </div>

            {/* Custom Category Input (Only shows if 'other' is selected) */}
            {categoryId === 'other' && (
              <div className="space-y-2 transition-all duration-300">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="customCategory">Tên danh mục khác *</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 focus:outline-none" 
                  id="customCategory" 
                  placeholder="Ví dụ: Lập trình Game" 
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              </div>
            )}
            
            {/*  Description  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="description">Mô tả dự án *</label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 resize-y focus:outline-none" 
                id="description" 
                placeholder="Mô tả chi tiết dự án của bạn..." 
                rows="6"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            {/*  Required Skills  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="skills">Kỹ năng yêu cầu</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 mb-2 focus:outline-none" 
                id="skills" 
                placeholder="Nhập kỹ năng và nhấn Enter (VD: React Native)" 
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-600 hover:text-[#0F766E] transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/*  Budget Type & Amount  */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Ngân sách *</label>
                <div className="flex gap-2 mb-2">
                  <button 
                    type="button"
                    onClick={() => setBudgetType('fixed')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-2xl font-body-sm transition-colors cursor-pointer ${budgetType === 'fixed' ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] font-bold' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}`}
                  >
                    Giá cố định
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBudgetType('hourly')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-2xl font-body-sm transition-colors cursor-pointer ${budgetType === 'hourly' ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] font-bold' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'}`}
                  >
                    Theo giờ
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E] font-bold text-sm">VNĐ</span>
                  <input 
                    className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-[#0F766E] focus:outline-none" 
                    placeholder="Ví dụ: 10000000" 
                    type="number"
                    min="1"
                    required
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
              </div>
              
              {/*  Deadline  */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="deadline">Hạn chót</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 focus:outline-none cursor-pointer" 
                    id="deadline" 
                    type="date"
                    min={new Date().toISOString().substring(0, 10)}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/*  Action Buttons  */}
            <div className="pt-6 border-t border-slate-200 flex flex-col-reverse md:flex-row justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl text-base font-medium hover:bg-slate-50 transition-colors shadow-[0_2px_12px_rgba(15,23,42,0.015)] cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0F766E] text-white border-t border-white/20 border-x border-white/10 rounded-2xl text-base font-medium shadow-[0_4px_15px_rgba(71,85,105,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 ease-out hover:from-[#0F766E] hover:to-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : editMode ? 'Lưu thay đổi' : 'Đăng dự án'} 
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
          
          {/*  Sidebar Info Area  */}
          <div className="lg:col-span-1 space-y-6">
            {/*  How it Works Card  */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">info</span>
                Cách thức hoạt động
              </h3>
              <ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] before:to-transparent">
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E] font-bold font-body-sm flex-shrink-0 z-10 relative">1</div>
                  <div>
                    <h4 className="text-base font-medium text-slate-800">Đăng dự án của bạn</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Cung cấp thông tin rõ ràng để thu hút nhân tài phù hợp.</p>
                  </div>
                </li>
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10 relative">2</div>
                  <div>
                    <h4 className="text-base font-medium text-slate-800">Nhận đề xuất</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Xem xét đề nghị từ các freelancer có chất lượng.</p>
                  </div>
                </li>
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10 relative">3</div>
                  <div>
                    <h4 className="text-base font-medium text-slate-800">Thuê &amp; Hợp tác</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Chọn người phù hợp nhất và bắt đầu làm việc.</p>
                  </div>
                </li>
              </ul>
            </div>
            {/*  Escrow Info Card  */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F766E]/5 rounded-bl-full -mr-4 -mt-4"></div>
              <span className="material-symbols-outlined text-[40px] text-[#0F766E] mb-4">gpp_good</span>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Thanh toán An toàn</h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Tiền được giữ an toàn trong <strong className="text-[#0F766E]">VNPay Escrow</strong> và chỉ giải ngân khi bạn xác nhận hoàn tất. Điều này đảm bảo sự yên tâm cho cả bạn và freelancer.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
