import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../../services/projectService';

const SUGGESTED_SKILLS = [
  // Lập trình & CNTT
  'React', 'Node.js', 'Python', 'Java', 'WordPress', 'Shopify', 'HTML & CSS', 'JavaScript', 'SQL',
  // Thiết kế & Sáng tạo
  'Figma', 'UI/UX Design', 'Photoshop', 'Illustrator', 'Graphic Design', 'Video Editing', '3D Modeling',
  // Viết lách & Dịch thuật
  'Content Writing', 'Copywriting', 'Dịch thuật Tiếng Anh', 'Viết bài SEO', 'Proofreading',
  // Marketing & Bán hàng
  'Facebook Ads', 'Google Ads', 'SEO', 'Social Media Marketing', 'Email Marketing',
  // Hỗ trợ & Khác
  'Data Entry', 'Microsoft Excel', 'Virtual Assistant', 'Customer Support'
];

export default function PostProject({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requiredFreelancerCount, setRequiredFreelancerCount] = useState(1);
  const [categories, setCategories] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState('');
  
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
            setBudgetType('fixed');
            setBudgetAmount(p.budget_max ? Math.round(p.budget_max).toString() : '');
            setRequiredFreelancerCount(p.required_freelancer_count || 1);
            if (p.deadline) {
              setDeadline(p.deadline.substring(0, 10));
            }
            if (p.attachment_url) {
              setExistingAttachment(p.attachment_url);
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

  const handleToggleSuggestedSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
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
      setErrorMsg('Vui lòng nhập tên danh mục tuyển dụng khác.');
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
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId === 'other' ? 'other' : parseInt(categoryId));
      formData.append('customCategory', categoryId === 'other' ? customCategory.trim() : '');
      formData.append('budgetType', budgetType.toUpperCase());
      formData.append('budgetMin', amount);
      formData.append('budgetMax', amount);
      formData.append('requiredFreelancerCount', parseInt(requiredFreelancerCount) || 1);
      if (deadline) {
        formData.append('deadline', deadline);
      }
      formData.append('skills', JSON.stringify(skills));

      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }

      if (editMode) {
        await projectService.updateProject(id, formData);
        setSuccessMsg('Cập nhật dự án thành công!');
      } else {
        await projectService.createProject(formData);
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
      <div className="max-w-6xl mx-auto py-10 px-6">
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
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 focus:outline-none font-medium" 
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
              <label className="block text-sm font-semibold text-slate-800" htmlFor="category">Danh mục tuyển dụng *</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all appearance-none text-base text-slate-800 focus:outline-none cursor-pointer font-medium" 
                  id="category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option disabled value="">Chọn danh mục tuyển dụng</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                  <option value="other">Khác...</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">expand_more</span>
              </div>
            </div>

            {/* Custom Category Input (Only shows if 'other' is selected) */}
            {categoryId === 'other' && (
              <div className="space-y-2 transition-all duration-300">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="customCategory">Tên danh mục khác *</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 focus:outline-none font-medium" 
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
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 resize-y focus:outline-none leading-relaxed" 
                id="description" 
                placeholder="Mô tả chi tiết các yêu cầu công việc, kết quả cần bàn giao..." 
                rows="6"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/*  File Attachment  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="attachment">Tài liệu đính kèm (Yêu cầu kỹ thuật, chi tiết dự án...)</label>
              <div className="flex flex-col gap-3 p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                <input 
                  type="file" 
                  id="attachment"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachmentFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="attachment" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 cursor-pointer shadow-sm flex items-center gap-1.5 transition-all shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-teal-600">upload_file</span> Chọn tệp tin
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Định dạng hỗ trợ: .pdf, .jpg, .jpeg, .png (Tối đa: 10MB)</span>
                </div>
                
                {attachmentFile && (
                  <div className="flex items-center justify-between p-3.5 bg-teal-50/50 border border-teal-100 rounded-xl">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="material-symbols-outlined text-teal-600 text-[24px] shrink-0">description</span>
                      <span className="text-sm font-bold text-slate-700 truncate">{attachmentFile.name}</span>
                      <span className="text-xs text-slate-400 font-medium shrink-0">({(attachmentFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setAttachmentFile(null)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                )}

                {existingAttachment && !attachmentFile && (
                  <div className="flex items-center justify-between p-3.5 bg-slate-100 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="material-symbols-outlined text-slate-500 text-[24px] shrink-0">link</span>
                      <span className="text-sm font-semibold text-slate-600 truncate">{existingAttachment.split('/').pop()}</span>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0">Tệp hiện tại</span>
                    </div>
                    <a 
                      href={existingAttachment}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-600 hover:text-teal-800 text-sm font-bold flex items-center gap-0.5 no-underline bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm"
                    >
                      Xem tệp
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/*  Required Skills  */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="skills">Kỹ năng yêu cầu</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 focus:outline-none" 
                  id="skills" 
                  placeholder="Nhập kỹ năng khác và nhấn Enter (Ví dụ: React Native)" 
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>

              {/* Tag Selection Suggestions */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Đề xuất kỹ năng phổ biến</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SKILLS.map((skill) => {
                    const isSelected = skills.includes(skill);
                    return (
                      <span
                        key={skill}
                        onClick={() => handleToggleSuggestedSkill(skill)}
                        className={`text-xs px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 select-none font-semibold border ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Selected Skills Visualizer */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Kỹ năng đã chọn ({skills.length}):</span>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-50 text-teal-800 text-sm font-bold rounded-xl border border-teal-100/50">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-teal-600 hover:text-teal-900 transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center p-0"
                        >
                          <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="budgetAmount">Ngân sách trọn gói *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E] font-bold text-sm">VNĐ</span>
                  <input 
                    className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-[#0F766E] focus:outline-none font-bold" 
                    id="budgetAmount"
                    placeholder="Ví dụ: 10.000.000" 
                    type="text"
                    required
                    value={budgetAmount ? budgetAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                    onChange={(e) => {
                      const rawVal = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                      setBudgetAmount(rawVal);
                    }}
                  />
                </div>
              </div>
              
              {/*  Deadline  */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="deadline">Hạn chót hoàn thành</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 focus:outline-none cursor-pointer font-medium" 
                    id="deadline" 
                    type="date"
                    min={new Date().toISOString().substring(0, 10)}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              {/*  Số lượng tuyển  */}
              <div className="space-y-2 col-span-full">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="requiredFreelancerCount">Số lượng cần tuyển *</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 focus:outline-none font-medium" 
                    id="requiredFreelancerCount" 
                    type="number"
                    min="1"
                    required
                    value={requiredFreelancerCount}
                    onChange={(e) => setRequiredFreelancerCount(e.target.value)}
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
