import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PostProject({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [budgetType, setBudgetType] = useState('fixed');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Fetch project details for Edit Mode
  useEffect(() => {
    if (editMode && id) {
      const fetchProjectDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/projects/${id}`);
          const data = await response.json();
          if (response.ok && data.success) {
            const p = data.project;
            setTitle(p.title);
            setCategory(p.category_id ? p.category_id.toString() : '');
            setDescription(p.description);
            setSkills(p.skills || []);
            setBudgetType(p.budget_type?.toLowerCase() === 'hourly' ? 'hourly' : 'fixed');
            setBudget(p.budget_max ? Math.round(p.budget_max).toString() : '');
            if (p.deadline) {
              // format yyyy-MM-dd
              setDeadline(p.deadline.substring(0, 10));
            }
          } else {
            setErrorMsg(data.message || 'Không thể tải chi tiết dự án.');
          }
        } catch (err) {
          console.error('Error fetching project details:', err);
          setErrorMsg('Lỗi mạng khi tải chi tiết dự án.');
        }
      };
      fetchProjectDetails();
    }
  }, [editMode, id]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !category || !description.trim() || !budget) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    // Remove any formatting dots/commas from budget
    const numericBudget = parseFloat(budget.replace(/\./g, '').replace(/,/g, ''));
    if (isNaN(numericBudget) || numericBudget <= 0) {
      setErrorMsg('Ngân sách phải là số dương hợp lệ.');
      setLoading(false);
      return;
    }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category_id: category,
      budget_type: budgetType,
      budget_min: numericBudget,
      budget_max: numericBudget,
      required_freelancer_count: 1,
      deadline: deadline || null,
      skills
    };

    try {
      const url = editMode 
        ? `http://localhost:5000/api/projects/${id}` 
        : 'http://localhost:5000/api/projects';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();

      if (response.ok) {
        setToastMsg(editMode ? 'Cập nhật dự án thành công!' : 'Đăng dự án thành công!');
        setTimeout(() => {
          navigate('/employer-dashboard');
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Đã xảy ra lỗi.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg('Lỗi kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-72px)] bg-slate-50">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white text-slate-800 px-6 py-4 rounded-2xl shadow-xl border border-slate-100 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-500">check_circle</span>
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-6">
        <div className="mb-8">
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">
            {editMode ? 'Chỉnh sửa Dự án' : 'Đăng Dự án Mới'}
          </h1>
          <p className="text-base text-slate-600">
            {editMode ? 'Cập nhật các thông tin của dự án bên dưới.' : 'Nhập thông tin bên dưới để tìm freelancer phù hợp nhất cho dự án của bạn.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/*  Form Area  */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] transition-all duration-300">
            {/*  Project Title  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="title">Tiêu đề dự án *</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50" 
                id="title" 
                placeholder="Ví dụ: Phát triển Ứng dụng Di động Bán hàng" 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/*  Category  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="category">Danh mục *</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all appearance-none text-base text-slate-800" 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option value="1">Lập trình Web & phần mềm</option>
                  <option value="2">Thiết kế UI/UX & Đồ họa</option>
                  <option value="3">Viết nội dung & Copywriting</option>
                  <option value="4">Dịch thuật</option>
                  <option value="5">Marketing & SEO</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">expand_more</span>
              </div>
            </div>

            {/*  Description  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="description">Mô tả dự án *</label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 resize-y" 
                id="description" 
                placeholder="Mô tả chi tiết dự án của bạn..." 
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/*  Required Skills  */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="skills">Kỹ năng yêu cầu (Nhấn Enter để thêm)</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 mb-2" 
                id="skills" 
                placeholder="Nhập kỹ năng và nhấn Enter (VD: React Native)" 
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200">
                    {skill} 
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-600 hover:text-[#0F766E] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/*  Budget Type & Amount  */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Ngân sách (VNĐ) *</label>
                <div className="flex gap-2 mb-2">
                  <button 
                    type="button"
                    onClick={() => setBudgetType('fixed')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-2xl cursor-pointer font-bold transition-all ${budgetType === 'fixed' ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Giá cố định
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBudgetType('hourly')}
                    className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-2xl cursor-pointer font-bold transition-all ${budgetType === 'hourly' ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Theo giờ
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E] font-bold text-sm">VNĐ</span>
                  <input 
                    className="w-full pl-14 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-[#0F766E] font-semibold" 
                    placeholder="Ví dụ: 10.000.000" 
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/*  Deadline  */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800" htmlFor="deadline">Hạn chót</label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800" 
                    id="deadline" 
                    type="date"
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
                onClick={() => navigate('/employer-dashboard')}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl text-base font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#0F766E] text-white border-t border-white/20 border-x border-white/10 rounded-2xl text-base font-bold shadow-sm hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : editMode ? 'Lưu thay đổi' : 'Đăng dự án'} 
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>

          {/*  Sidebar Info Area  */}
          <div className="lg:col-span-1 space-y-6">
            {/*  How it Works Card  */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">info</span>
                Cách thức hoạt động
              </h3>
              <ul className="space-y-4">
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E] font-bold font-body-sm flex-shrink-0 z-10">1</div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">Đăng dự án của bạn</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Cung cấp thông tin rõ ràng để thu hút nhân tài phù hợp.</p>
                  </div>
                </li>
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10">2</div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">Nhận đề xuất</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Xem xét đề nghị từ các freelancer có chất lượng.</p>
                  </div>
                </li>
                <li className="relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10">3</div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">Thuê &amp; Hợp tác</h4>
                    <p className="text-sm font-medium text-slate-600 mt-1">Chọn người phù hợp nhất và bắt đầu làm việc.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/*  Escrow Info Card  */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
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
