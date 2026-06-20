import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_PROJECTS = [
  {
    id: 1,
    category: 'Lập trình Web',
    title: 'Thiết kế lại Bảng điều khiển Doanh nghiệp (SaaS)',
    description: 'Tìm kiếm một lập trình viên frontend có kinh nghiệm để thiết kế lại bảng điều khiển phân tích cốt lõi của chúng tôi. Ứng viên lý tưởng sẽ có kinh nghiệm vững vàng về React và Tailwind CSS. Chúng tôi cần một giao diện gọn gàng, hiện đại xử lý dữ liệu lớn mà không ảnh hưởng đến hiệu năng.',
    budget: '75.000.000 đ - 125.000.000 đ',
    duration: 'Ước tính 4 tuần',
    company: 'Công ty TechNova',
    proposals: 12,
    skills: ['React', 'Tailwind CSS', 'Figma'],
    urgent: false,
    verified: true,
    numericBudget: 100000000
  },
  {
    id: 2,
    category: 'Ứng dụng Di động',
    title: 'Tích hợp Thanh toán Ứng dụng iOS',
    description: 'Tìm kiếm một lập trình viên Swift để tích hợp cổng thanh toán mới và tái cấu trúc luồng thanh toán của ứng dụng iOS hiện tại. Đảm bảo hoạt ảnh mượt mà và xử lý lỗi tốt. Quen thuộc với Node.js là một lợi thế.',
    budget: '37.000.000 đ - 62.000.000 đ',
    duration: 'Ước tính 2 tuần',
    company: 'Bán lẻ Việt',
    proposals: 5,
    skills: ['Swift', 'iOS', 'API Integration'],
    urgent: false,
    verified: false,
    numericBudget: 50000000
  },
  {
    id: 3,
    category: 'Thiết kế UI/UX',
    title: 'Bộ nhận diện thương hiệu & Thiết kế Landing Page',
    description: 'Chúng tôi đang ra mắt một công ty khởi nghiệp Fintech mới và cần bộ nhận diện hình ảnh, trang đích hoàn chỉnh. Tìm kiếm giao diện đáng tin cậy. Sản phẩm bàn giao bao gồm logo, style guide và file Figma.',
    budget: '100.000.000 đ',
    duration: 'Hạn: trong 10 ngày',
    company: 'NextGen Finance',
    proposals: 28,
    skills: ['Figma', 'Branding'],
    urgent: true,
    verified: true,
    numericBudget: 100000000
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [categories, setCategories] = useState({
    // Công nghệ
    'Lập trình Web': true,
    'Ứng dụng Di động': false,
    'Thiết kế UI/UX': true,
    'Khoa học Dữ liệu': false,
    'AI & Machine Learning': false,
    'An ninh Mạng': false,
    // Sáng tạo
    'Thiết kế Đồ họa': false,
    'Dựng phim & Chỉnh video': false,
    'Nhiếp ảnh': false,
    'Hoạt hình & 3D': false,
    'Âm nhạc & Âm thanh': false,
    // Nội dung
    'Viết nội dung': false,
    'Dịch thuật': false,
    'Copywriting': false,
    // Kinh doanh
    'Marketing Kỹ thuật số': false,
    'SEO & SEM': false,
    'Mạng xã hội': false,
    'Tư vấn Kinh doanh': false,
    // Tài chính
    'Kế toán': false,
    'Dịch vụ Pháp lý': false,
    // Khác
    'Trợ lý Ảo': false,
    'Nhập liệu': false,
    'Hỗ trợ Khách hàng': false,
  });
  const [sortBy, setSortBy] = useState('Phù hợp nhất');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle category filtering
  const handleCategoryChange = (catName) => {
    setCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Filter projects based on selections
  const filteredProjects = projects.filter(project => {
    // Search query check
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category check (if at least one category is checked, check if it matches. If none checked, show all)
    const activeCategories = Object.keys(categories).filter(c => categories[c]);
    const matchesCategory = activeCategories.length === 0 || activeCategories.includes(project.category);

    return matchesSearch && matchesCategory;
  });

  // Handle sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'Ngân sách cao nhất') {
      return b.numericBudget - a.numericBudget;
    }
    if (sortBy === 'Mới nhất') {
      return b.id - a.id;
    }
    return 0; // Phù hợp nhất (default ID order)
  });

  const handleClearFilters = () => {
    setCategories(prev =>
      Object.fromEntries(Object.keys(prev).map(k => [k, false]))
    );
    setSearchQuery('');
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col w-full">
      
      {/* TopNavBar */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant w-full sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-gutter">
            <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">FJMS</Link>
            
            <div className="hidden md:flex items-center gap-sm bg-surface-container-low px-md py-sm rounded-full border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm text-on-surface w-64 placeholder:text-on-surface-variant outline-none"
                placeholder="Tìm kiếm dự án của bạn..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-gutter">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/">
              Chợ việc làm
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/login">
              Đề xuất
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/login">
              Tin nhắn
            </Link>
          </div>

          <div className="flex items-center gap-md">
            <Link className="hidden md:block font-label-md text-label-md text-primary bg-white border border-primary px-lg py-sm rounded-2xl hover:bg-surface-container-low transition-colors" to="/login">
              Đăng nhập
            </Link>
            <Link className="font-label-md text-label-md text-white bg-primary px-lg py-sm rounded-2xl hover:bg-primary-container transition-colors inline-flex justify-center items-center" to="/register">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex-grow flex w-full max-w-container-max mx-auto px-gutter py-xl gap-xl items-start">
        
        {/* Filter Sidebar (Left) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-lg sticky top-[112px] h-[calc(100vh-140px)] filter-scroll overflow-y-auto pr-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Bộ lọc</h2>
            <button
              onClick={handleClearFilters}
              className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors cursor-pointer"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-sm border-b border-outline-variant pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Danh mục</h3>

            {/* Technology */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-xs">💻 Công nghệ</p>
            {['Lập trình Web', 'Ứng dụng Di động', 'Thiết kế UI/UX', 'Khoa học Dữ liệu', 'AI & Machine Learning', 'An ninh Mạng'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}

            {/* Creative */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">🎨 Sáng tạo</p>
            {['Thiết kế Đồ họa', 'Dựng phim & Chỉnh video', 'Nhiếp ảnh', 'Hoạt hình & 3D', 'Âm nhạc & Âm thanh'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}

            {/* Writing & Content */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">✍️ Nội dung & Viết lách</p>
            {['Viết nội dung', 'Dịch thuật', 'Copywriting'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}

            {/* Business & Marketing */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">📈 Kinh doanh & Marketing</p>
            {['Marketing Kỹ thuật số', 'SEO & SEM', 'Mạng xã hội', 'Tư vấn Kinh doanh'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}

            {/* Finance & Legal */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">⚖️ Tài chính & Pháp lý</p>
            {['Kế toán', 'Dịch vụ Pháp lý'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}

            {/* Other */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">🛠️ Khác</p>
            {['Trợ lý Ảo', 'Nhập liệu', 'Hỗ trợ Khách hàng'].map(cat => (
              <label key={cat} className="flex items-center gap-sm cursor-pointer group select-none">
                <input
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface-container-low cursor-pointer"
                  type="checkbox"
                />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}
          </div>


          {/* Budget Filter */}
          <div className="flex flex-col gap-sm border-b border-outline-variant pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Ngân sách (VNĐ)</h3>
            <div className="flex gap-sm items-center">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Tối thiểu"
                type="number"
              />
              <span className="text-on-surface-variant">-</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Tối đa"
                type="number"
              />
            </div>
            
            <div className="flex flex-col gap-xs mt-sm">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Dưới 10 Triệu</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input defaultChecked className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">10 Tr - 50 Tr</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">50 Tr - 250 Tr</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Trên 250 Triệu</span>
              </label>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="flex flex-col gap-sm border-b border-outline-variant pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Kỹ năng</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-lg pr-sm py-sm text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Tìm kỹ năng"
                type="text"
              />
            </div>
            <div className="flex flex-wrap gap-sm mt-sm">
              <span className="inline-flex items-center gap-xs px-sm py-xs bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm cursor-pointer hover:bg-primary/20 transition-colors">
                React <span className="material-symbols-outlined text-[12px]">close</span>
              </span>
              <span className="inline-flex items-center gap-xs px-sm py-xs bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm cursor-pointer hover:bg-primary/20 transition-colors">
                TypeScript <span className="material-symbols-outlined text-[12px]">close</span>
              </span>
            </div>
          </div>

          {/* Deadline Filter */}
          <div className="flex flex-col gap-sm pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Thời hạn</h3>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface-variant cursor-pointer">
              <option>Bất cứ lúc nào</option>
              <option>Dưới 1 tuần</option>
              <option>1 đến 4 tuần</option>
              <option>1 đến 3 tháng</option>
            </select>
          </div>
          
          <button className="w-full py-sm bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded-2xl hover:bg-surface-container-highest transition-colors mt-auto cursor-pointer">
            Áp dụng
          </button>
        </aside>

        {/* Main Project Canvas (Right) */}
        <main className="flex-grow flex flex-col gap-lg min-w-0 w-full">
          
          {/* Header for Canvas */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-sm">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Dự án dành cho bạn</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                Hiển thị {sortedProjects.length} dự án phù hợp với bộ lọc.
              </p>
            </div>
            
            <div className="flex items-center gap-sm self-start md:self-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Sắp xếp:</span>
              <select
                className="bg-surface border border-outline-variant rounded-lg px-sm py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Phù hợp nhất">Phù hợp nhất</option>
                <option value="Mới nhất">Mới nhất</option>
                <option value="Ngân sách cao nhất">Ngân sách cao nhất</option>
              </select>
            </div>
          </div>

          {/* Project Cards List */}
          <div className="flex flex-col gap-md">
            {sortedProjects.map(project => (
              <div
                key={project.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col gap-md hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:border-primary transition-all duration-200 group relative overflow-hidden"
              >
                {/* Urgent Badge */}
                {project.urgent && (
                  <div className="absolute top-0 right-0 bg-error-container text-on-error-container px-sm py-xs rounded-bl-lg font-label-sm text-label-sm flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> Gấp
                  </div>
                )}

                <div className={`flex justify-between items-start gap-md ${project.urgent ? 'mt-sm' : ''}`}>
                  <div className="flex flex-col gap-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{project.category}</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                  </div>
                  <button aria-label="Lưu dự án" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                      bookmark_border
                    </span>
                  </button>
                </div>

                <p className="text-sm font-medium text-on-surface-variant line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-md text-sm font-medium text-on-surface-variant">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                    <span className="text-primary font-semibold">{project.budget}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                    <span>{project.company}</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    <span>{project.proposals} Đề xuất</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-sm pt-md border-t border-outline-variant/50">
                  <div className="flex flex-wrap gap-sm">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-sm py-xs bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm">
                        {skill}
                      </span>
                    ))}
                    {project.verified && (
                      <span className="px-sm py-xs bg-tertiary-container/20 text-tertiary-container rounded-lg font-label-sm text-label-sm flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[12px] font-fill-1">verified</span> Nhà tuyển dụng đã xác thực
                      </span>
                    )}
                  </div>
                  
                  <Link
                    to={`/project-details/${project.id}`}
                    className="font-label-md text-label-md text-white bg-primary px-md py-sm rounded-2xl hover:bg-primary-container transition-colors shrink-0 inline-flex items-center justify-center cursor-pointer"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}

            {sortedProjects.length === 0 && (
              <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-2xl text-slate-500">
                <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2">find_in_page</span>
                <p className="font-body-lg text-body-lg">Không có dự án nào phù hợp với bộ lọc hiện tại.</p>
                <button onClick={handleClearFilters} className="text-primary font-semibold mt-2 hover:underline">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-sm mt-lg">
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-label-md text-label-md">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">3</button>
            <span className="text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">12</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant mt-auto w-full">
        <div className="w-full py-xl px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="flex items-center gap-sm">
            <span className="font-headline-sm text-headline-sm text-primary">FJMS</span>
            <span className="text-sm font-medium text-on-surface-variant ml-sm">
              © {new Date().getFullYear()} Nền tảng Tìm việc Tự do. Mọi quyền được bảo lưu.
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-md">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Chính sách bảo mật</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Điều khoản dịch vụ</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Hỗ trợ</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Liên hệ</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
