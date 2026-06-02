import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const ALL_PROJECTS = [
  {
    id: 1,
    category: 'Lập trình Web',
    projectType: 'Fixed Price',
    title: 'Thiết kế lại Bảng điều khiển Doanh nghiệp (SaaS)',
    description: 'Tìm kiếm một chuyên gia thiết kế sản phẩm để cải tiến bảng điều khiển phân tích chính của chúng tôi. Cần giao diện người dùng hiện đại, gọn gàng với trọng tâm là trực quan hóa dữ liệu, các thành phần có thể mở rộng và tính dễ sử dụng cao.',
    budget: '120.000.000 đ - 200.000.000 đ',
    numericBudget: 150000000,
    duration: '4 Tuần',
    company: 'Công ty TechNova',
    proposals: 12,
    skills: ['Figma', 'React', 'Thiết kế UI/UX'],
    verified: true
  },
  {
    id: 2,
    category: 'Ứng dụng Di động',
    projectType: 'Hourly Rate',
    title: 'Phát triển Ứng dụng Di động React Native',
    description: 'Chúng tôi cần một lập trình viên React Native có kinh nghiệm để xây dựng ứng dụng di động đa nền tảng cho dịch vụ giao hàng mới của chúng tôi. Rất mong muốn có kinh nghiệm tích hợp API Google Maps.',
    budget: '75.000.000 đ - 110.000.000 đ',
    numericBudget: 90000000,
    duration: '2 Tháng',
    company: 'Công ty Khởi nghiệp Alpha',
    proposals: 5,
    skills: ['React Native', 'Node.js'],
    verified: false
  },
  {
    id: 3,
    category: 'Thiết kế UI/UX',
    projectType: 'Fixed Price',
    title: 'Bộ nhận diện thương hiệu Fintech & Prototype',
    description: 'Chúng tôi đang ra mắt một công ty khởi nghiệp công nghệ tài chính mới và cần một bộ nhận diện hình ảnh và thiết kế trang đích hoàn chỉnh. Tìm kiếm một giao diện hiện đại, đáng tin cậy.',
    budget: '50.000.000 đ - 80.000.000 đ',
    numericBudget: 65000000,
    duration: '10 Ngày',
    company: 'NextGen Finance',
    proposals: 28,
    skills: ['Figma', 'Branding', 'Thiết kế UI/UX'],
    verified: true
  },
  {
    id: 4,
    category: 'Lập trình Web',
    projectType: 'Fixed Price',
    title: 'Nâng cấp Nền tảng Thương mại Điện tử Next.js',
    description: 'Viết lại toàn bộ cửa hàng bằng Next.js 14, TailwindCSS và Shopify Storefront API. Phải đảm bảo điểm SEO xuất sắc và tốc độ tải trang nhanh.',
    budget: '100.000.000 đ - 150.000.000 đ',
    numericBudget: 120000000,
    duration: '6 Tuần',
    company: 'Bán lẻ Việt',
    proposals: 9,
    skills: ['React', 'Next.js', 'Node.js'],
    verified: true
  }
];

export default function BrowseProjects() {
  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
  const location = useLocation();
  const navigate = useNavigate();

  // Search parameters parsing
  const queryParams = new URLSearchParams(location.search);
  const searchWord = queryParams.get('q') || '';

  // Dynamic States
  const [selectedCategories, setSelectedCategories] = useState({
    'Lập trình Web': false,
    'Thiết kế UI/UX': false,
    'Ứng dụng Di động': false,
    'Viết nội dung': false,
    'Dịch thuật': false,
    'Kế toán': false
  });
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [projectType, setProjectType] = useState(''); // 'Fixed Price', 'Hourly Rate' or ''
  const [sortBy, setSortBy] = useState('Newest First');

  // Handle Category check triggers
  const handleCategoryToggle = (cat) => {
    setSelectedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Toggle selected skill tags
  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories({
      'Lập trình Web': false,
      'Thiết kế UI/UX': false,
      'Ứng dụng Di động': false,
      'Viết nội dung': false,
      'Dịch thuật': false,
      'Kế toán': false
    });
    setMinBudget('');
    setMaxBudget('');
    setSelectedSkills([]);
    setProjectType('');
    setSortBy('Newest First');
    navigate('/browse-projects');
  };

  // Filter projects dynamically
  const filteredProjects = ALL_PROJECTS.filter(project => {
    // 1. Text Search Filter
    if (searchWord) {
      const query = searchWord.toLowerCase();
      const matchesText = 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.skills.some(skill => skill.toLowerCase().includes(query)) ||
        project.company.toLowerCase().includes(query);
      if (!matchesText) return false;
    }

    // 2. Category / Role Filters (If any checked, match at least one. If none checked, match all)
    const activeCats = Object.keys(selectedCategories).filter(c => selectedCategories[c]);
    if (activeCats.length > 0 && !activeCats.includes(project.category)) {
      return false;
    }

    // 3. Project Type Filter
    if (projectType && project.projectType !== projectType) {
      return false;
    }

    // 4. Budget Range Filters
    if (minBudget && project.numericBudget < parseFloat(minBudget)) {
      return false;
    }
    if (maxBudget && project.numericBudget > parseFloat(maxBudget)) {
      return false;
    }

    // 5. Skills tags Filter (If any selected, match all selected skills)
    if (selectedSkills.length > 0 && !selectedSkills.every(s => project.skills.includes(s))) {
      return false;
    }

    return true;
  });

  // Sort Filter logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'Highest Budget') {
      return b.numericBudget - a.numericBudget;
    }
    // Default: Newest first (descending ID)
    return b.id - a.id;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col w-full">
      
      {/* Full-width Hero Banner */}
      <section className={`bg-gradient-to-br from-teal-50 via-white to-teal-50/50 border-b border-teal-100/50 py-16 px-6 md:px-12 w-full ${!token ? 'pt-[116px] md:pt-[124px]' : 'pt-12'}`}>
        <div className="max-w-[1440px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl text-teal-950 font-extrabold tracking-tight mb-4">
            Khám phá dự án phù hợp
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium mx-auto md:mx-0">
            Tìm kiếm cơ hội việc làm tốt nhất cho kỹ năng của bạn. Lọc theo ngân sách, loại công việc và công nghệ.
          </p>
        </div>
      </section>

      {/* Main Grid View */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-[104px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl text-teal-950 font-bold">Bộ lọc</h2>
              <button 
                onClick={handleClearFilters}
                className="text-teal-700 text-sm font-semibold hover:underline"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Category / Role Required */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Loại công việc</h3>
              <div className="flex flex-col gap-2">
                {Object.keys(selectedCategories).map(cat => {
                  const active = selectedCategories[cat];
                  return (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox"
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                        checked={active}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                      <span className={`text-sm font-medium transition-colors ${active ? 'text-teal-900 font-semibold' : 'text-slate-600 group-hover:text-teal-700'}`}>
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Ngân sách (VNĐ)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="Tối thiểu" 
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="Tối đa" 
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Project Type Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Loại hợp đồng</h3>
              <div className="space-y-3">
                {[
                  { value: 'Fixed Price', label: 'Trọn gói' },
                  { value: 'Hourly Rate', label: 'Theo giờ' }
                ].map(type => (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer group select-none">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                      checked={projectType === type.value}
                      onChange={() => setProjectType(projectType === type.value ? '' : type.value)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-teal-700 transition-colors font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Tag Filters */}
            <div>
              <h3 className="text-base font-semibold text-teal-950 mb-3">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'React', 'Node.js', 'Thiết kế UI/UX', 'Branding', 'React Native'].map(skill => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <span 
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none font-medium ${
                        active 
                          ? 'bg-teal-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Project Listings Canvas */}
        <section className="flex-grow flex flex-col gap-6">
          
          {/* Header/Sort bar */}
          <div className="flex justify-between items-center bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <span className="text-sm text-slate-600 font-medium">
              Hiển thị <strong className="text-teal-900 font-bold">{sortedProjects.length}</strong> dự án {searchWord ? `cho "${searchWord}"` : ''}
            </span>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <span className="text-sm text-slate-500 font-medium">Sắp xếp:</span>
              <select 
                className="text-sm border-none bg-transparent text-teal-900 font-bold focus:ring-0 cursor-pointer pl-1 pr-8 py-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest First">Mới nhất</option>
                <option value="Highest Budget">Ngân sách cao nhất</option>
              </select>
            </div>
          </div>

          {/* Bento Grid List */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedProjects.map(project => (
              <article 
                key={project.id}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_8px_24px_rgba(15,118,110,0.06)] hover:-translate-y-1 transition-all duration-300 relative flex flex-col group overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600 border border-teal-100 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[28px]">
                      {project.category === 'Ứng dụng Di động' ? 'phone_iphone' : project.category === 'Thiết kế UI/UX' ? 'palette' : 'code'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl text-teal-950 mb-1.5 font-bold group-hover:text-teal-700 transition-colors cursor-pointer tracking-tight" onClick={() => navigate(token ? '/project-details' : '/project-details')}>
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-[16px] text-slate-400">domain</span> {project.company}</span>
                      {project.verified && (
                        <span className="flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full text-xs font-bold border border-teal-100/50">
                          <span className="material-symbols-outlined text-[14px] font-fill-1 text-teal-600">verified</span> Đã xác thực
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {project.description}
                </p>

                {/* Stats Panel */}
                <div className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                  <div className="flex-1">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Ngân sách</span>
                    <span className="text-base font-bold text-slate-800">{project.budget}</span>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="flex-1">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Thời gian</span>
                    <span className="text-base font-bold text-slate-800">{project.duration}</span>
                  </div>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.skills.map(skill => (
                    <span key={skill} className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-medium shadow-sm hover:border-teal-300 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto border-t border-slate-100 pt-5">
                  <button 
                    onClick={() => navigate(token ? '/project-details' : '/project-details')}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 hover:text-teal-700 hover:border-slate-300 transition-all active:scale-[0.98] text-center shadow-sm"
                  >
                    Xem chi tiết
                  </button>
                  <div className="flex-1 relative tooltip-container">
                    {token ? (
                      <button 
                        onClick={() => navigate('/submit-proposal')}
                        className="w-full bg-[#0F766E] text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all duration-300 active:scale-[0.98] text-center border-none"
                      >
                        Nộp đề xuất
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate('/login')}
                          className="w-full bg-slate-100 text-slate-400 text-sm font-semibold py-2.5 px-4 rounded-xl cursor-pointer text-center border-none active:scale-[0.98]"
                        >
                          Nộp đề xuất
                        </button>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible transition-all duration-200 whitespace-nowrap z-10 shadow-md">
                          Đăng nhập để đặt giá
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {sortedProjects.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-2xl text-slate-500 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">search_off</span>
                <h4 className="text-xl text-slate-800 font-bold mb-2">Không tìm thấy dự án nào</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Không tìm thấy dự án nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi tiêu chí.</p>
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedProjects.length > 0 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-[#0F766E] text-white text-sm font-bold flex items-center justify-center shadow-sm hover:bg-[#0D5E58] transition-colors">1</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-[#0F766E] transition-colors">2</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-[#0F766E] transition-colors">3</button>
                <span className="text-slate-400 px-1 select-none font-bold">...</span>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
