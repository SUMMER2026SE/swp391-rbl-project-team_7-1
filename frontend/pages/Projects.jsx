import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_PROJECTS = [
  {
    id: 1,
    category: 'Web Development',
    title: 'Enterprise SaaS Dashboard Redesign',
    description: 'We are looking for an experienced frontend developer to redesign our core analytics dashboard. The ideal candidate will have strong React and Tailwind CSS experience. We need a clean, modern interface that handles large data sets efficiently without compromising performance.',
    budget: '75.000.000 đ - 125.000.000 đ',
    duration: 'Est. 4 weeks',
    company: 'TechCorp Inc.',
    proposals: 12,
    skills: ['React', 'Tailwind CSS', 'Figma'],
    urgent: false,
    verified: false,
    numericBudget: 4000
  },
  {
    id: 2,
    category: 'Mobile Apps',
    title: 'iOS E-commerce App Integration',
    description: 'Seeking a Swift developer to integrate a new payment gateway and refactor the checkout flow of our existing iOS application. Must ensure smooth animations and error handling. Familiarity with our current backend stack (Node.js) is a plus.',
    budget: '37.000.000 đ - 62.000.000 đ',
    duration: 'Est. 2 weeks',
    company: 'RetailFlow',
    proposals: 5,
    skills: ['Swift', 'iOS', 'API Integration'],
    urgent: false,
    verified: false,
    numericBudget: 2000
  },
  {
    id: 3,
    category: 'UI/UX Design',
    title: 'Brand Identity & Landing Page Design',
    description: 'We are launching a new fintech startup and need a complete visual identity and landing page design. Looking for a modern, trustworthy look that appeals to Gen Z. Deliverables include logo, style guide, and fully responsive Figma files.',
    budget: '100.000.000 đ',
    duration: 'Due in 10 days',
    company: 'NextGen Finance',
    proposals: 28,
    skills: ['Figma', 'Branding'],
    urgent: true,
    verified: true,
    numericBudget: 4000
  }
];

export default function Projects() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [categories, setCategories] = useState({
    // Technology
    'Web Development': true,
    'Mobile Apps': false,
    'UI/UX Design': true,
    'Data Science': false,
    'AI & Machine Learning': false,
    'Cybersecurity': false,
    // Creative
    'Graphic Design': false,
    'Video Editing': false,
    'Photography': false,
    'Animation & 3D': false,
    'Music & Audio': false,
    // Writing & Content
    'Content Writing': false,
    'Translation': false,
    'Copywriting': false,
    // Business & Marketing
    'Digital Marketing': false,
    'SEO & SEM': false,
    'Social Media': false,
    'Business Consulting': false,
    // Finance & Legal
    'Accounting': false,
    'Legal Services': false,
    // Other
    'Virtual Assistant': false,
    'Data Entry': false,
    'Customer Support': false,
  });
  const [sortBy, setSortBy] = useState('Most Relevant');
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
    if (sortBy === 'Highest Budget') {
      return b.numericBudget - a.numericBudget;
    }
    if (sortBy === 'Newest First') {
      return b.id - a.id;
    }
    return 0; // Most Relevant (default ID order)
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
                placeholder="Search projects..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-gutter">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/">
              Marketplace
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/login">
              Proposals
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/login">
              Messages
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-md">
            <Link className="hidden md:block font-label-md text-label-md text-primary bg-white border border-primary px-lg py-sm rounded-2xl hover:bg-surface-container-low transition-colors" to="/login">
              Login
            </Link>
            <Link className="font-label-md text-label-md text-white bg-primary px-lg py-sm rounded-2xl hover:bg-primary-container transition-colors inline-flex justify-center items-center" to="/register">
              Register
            </Link>
            <img
              alt="User profile"
              className="w-8 h-8 rounded-full border border-outline-variant hidden md:block"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGRyoCLs1tse0wYQZCEYk0qzJJOKv5RyV8olMGkRRpKPQag53dGb403l_MjAUMi1Dgh1MXawig4xkkgY722-GhgSesa3ViLmOQ0_nmgDB_eydU2HvRMG7nljfD4-9Gdw5K4WORApkCwIIsmlx7cRfPlsFzAAnQwCYUpFN2D70AwzmclNgRGZ_LoAHHtCz8yzeBaJMQ7YNn7oubzJiDwOvCUQA_1j7xxMWVgyoHDtsatONW_nSNCVnd1n_Yloedl9usoLU4_TFagXxE"
            />
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="flex-grow flex w-full max-w-container-max mx-auto px-gutter py-xl gap-xl items-start">
        
        {/* Filter Sidebar (Left) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-lg sticky top-[112px] h-[calc(100vh-140px)] filter-scroll overflow-y-auto pr-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Filters</h2>
            <button
              onClick={handleClearFilters}
              className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-sm border-b border-outline-variant pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Category</h3>

            {/* Technology */}
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-xs">💻 Technology</p>
            {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Data Science', 'AI & Machine Learning', 'Cybersecurity'].map(cat => (
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
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">🎨 Creative</p>
            {['Graphic Design', 'Video Editing', 'Photography', 'Animation & 3D', 'Music & Audio'].map(cat => (
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
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">✍️ Writing & Content</p>
            {['Content Writing', 'Translation', 'Copywriting'].map(cat => (
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
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">📈 Business & Marketing</p>
            {['Digital Marketing', 'SEO & SEM', 'Social Media', 'Business Consulting'].map(cat => (
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
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">⚖️ Finance & Legal</p>
            {['Accounting', 'Legal Services'].map(cat => (
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
            <p className="font-label-xs text-[10px] uppercase tracking-widest text-outline mt-sm">🛠️ Other</p>
            {['Virtual Assistant', 'Data Entry', 'Customer Support'].map(cat => (
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
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Budget (VND)</h3>
            <div className="flex gap-sm items-center">
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Minimum"
                type="number"
              />
              <span className="text-on-surface-variant">-</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Maximum"
                type="number"
              />
            </div>
            
            <div className="flex flex-col gap-xs mt-sm">
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Under 10M</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input defaultChecked className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">10M - 50M</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">50M - 250M</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer group">
                <input className="text-primary focus:ring-primary w-4 h-4 border-outline-variant bg-surface-container-low cursor-pointer" name="budget" type="radio" />
                <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Above 250M</span>
              </label>
            </div>
          </div>


          {/* Skills Filter */}
          <div className="flex flex-col gap-sm border-b border-outline-variant pb-md">
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Skills</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
              <input
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-lg pr-sm py-sm text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
                placeholder="Search skills"
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
            <h3 className="font-label-md text-label-md text-on-surface font-semibold">Deadline</h3>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface-variant cursor-pointer">
              <option>Any Time</option>
              <option>Less than 1 week</option>
              <option>1 to 4 weeks</option>
              <option>1 to 3 months</option>
            </select>
          </div>
          
          <button className="w-full py-sm bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded-2xl hover:bg-surface-container-highest transition-colors mt-auto cursor-pointer">
            Apply Filters
          </button>
        </aside>

        {/* Main Project Canvas (Right) */}
        <main className="flex-grow flex flex-col gap-lg min-w-0 w-full">
          
          {/* Header for Canvas */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-sm">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Available Projects</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                Showing {sortedProjects.length} projects matching your filters.
              </p>
            </div>
            
            <div className="flex items-center gap-sm self-start md:self-auto">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
              <select
                className="bg-surface border border-outline-variant rounded-lg px-sm py-xs font-label-md text-label-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Most Relevant">Most Relevant</option>
                <option value="Newest First">Newest First</option>
                <option value="Highest Budget">Highest Budget</option>
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
                    <span className="material-symbols-outlined text-[14px]">bolt</span> Urgent
                  </div>
                )}

                <div className={`flex justify-between items-start gap-md ${project.urgent ? 'mt-sm' : ''}`}>
                  <div className="flex flex-col gap-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{project.category}</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                  </div>
                  <button aria-label="Save project" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                      {project.verified ? 'bookmark' : 'bookmark_border'}
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
                    <span>{project.proposals} Proposals</span>
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
                        <span className="material-symbols-outlined text-[12px]">verified</span> Verified Employer
                      </span>
                    )}
                  </div>
                  
                  <Link
                    to={`/projects/${project.id}`}
                    className="font-label-md text-label-md text-white bg-primary px-md py-sm rounded-2xl hover:bg-primary-container transition-colors shrink-0 inline-flex items-center justify-center cursor-pointer"
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            ))}

            {sortedProjects.length === 0 && (
              <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-2xl text-slate-500">
                <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2">find_in_page</span>
                <p className="font-body-lg text-body-lg">No projects match your current filters.</p>
                <button onClick={handleClearFilters} className="text-primary font-semibold mt-2 hover:underline">
                  Clear all filters
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
              © {new Date().getFullYear()} FJMS Premium Marketplace. All rights reserved.
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-md">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Privacy Policy</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Terms of Service</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Support</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Contact Us</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
