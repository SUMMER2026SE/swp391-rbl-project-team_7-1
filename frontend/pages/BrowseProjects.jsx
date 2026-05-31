import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const ALL_PROJECTS = [
  {
    id: 1,
    category: 'Web Development',
    projectType: 'Fixed Price',
    title: 'Enterprise SaaS Dashboard Redesign',
    description: 'Looking for a senior product designer to overhaul our main enterprise analytics dashboard. Need clean, modern UI with a focus on data visualization, scalable components, and high ease of use.',
    budget: '$5,000 - $8,000',
    numericBudget: 6000,
    duration: '4 Weeks',
    company: 'TechNova Corp',
    proposals: 12,
    skills: ['Figma', 'React', 'UI/UX', 'Dashboard'],
    premium: true,
    verified: true
  },
  {
    id: 2,
    category: 'Mobile Apps',
    projectType: 'Hourly Rate',
    title: 'React Native App Development',
    description: 'We need a skilled React Native developer to build a cross-platform mobile app for our new delivery service. Experience with Google Maps API integration is highly desired.',
    budget: '$3,000 - $4,500',
    numericBudget: 3000,
    duration: '2 Months',
    company: 'Startup Inc.',
    proposals: 5,
    skills: ['React Native', 'Mobile Apps', 'Node.js'],
    premium: false,
    verified: false
  },
  {
    id: 3,
    category: 'UI/UX Design',
    projectType: 'Fixed Price',
    title: 'Fintech Brand Identity & High-Fi Prototyping',
    description: 'We are launching a new fintech startup and need a complete visual identity and landing page design. Looking for a modern, trustworthy look that appeals to youth.',
    budget: '$2,000 - $3,500',
    numericBudget: 2000,
    duration: '10 Days',
    company: 'NextGen Finance',
    proposals: 28,
    skills: ['Figma', 'Branding', 'UI/UX'],
    premium: true,
    verified: true
  },
  {
    id: 4,
    category: 'Web Development',
    projectType: 'Fixed Price',
    title: 'Next.js E-Commerce Platform Overhaul',
    description: 'Complete storefront refactoring using Next.js 14, TailwindCSS, and Shopify Storefront API. Must ensure excellent SEO scores and fast loading speeds.',
    budget: '$4,000 - $6,000',
    numericBudget: 4000,
    duration: '6 Weeks',
    company: 'RetailFlow Co.',
    proposals: 9,
    skills: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
    premium: false,
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
    'Web Development': false,
    'UI/UX Design': false,
    'Mobile Apps': false
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
      'Web Development': false,
      'UI/UX Design': false,
      'Mobile Apps': false
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
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col w-full">
      
      {/* Full-width Hero Banner from the design screenshot */}
      <section className={`bg-gradient-to-b from-[#F1F5F9] to-[#F8FAFC] border-b border-slate-200/50 py-12 px-margin-mobile md:px-margin-desktop w-full ${!token ? 'pt-[116px] md:pt-[124px]' : 'pt-8'}`}>
        <div className="max-w-container-max mx-auto">
          <h1 className="font-headline-2xl-mobile md:font-headline-3xl text-[#1E293B] font-extrabold tracking-tight mb-3">
            Find High-Value Projects
          </h1>
          <p className="font-body-md text-slate-500 max-w-2xl font-medium">
            Discover opportunities that match your expertise. Filter by budget, skills, and timeline to find your next engagement.
          </p>
        </div>
      </section>

      {/* Main Grid View */}
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col md:flex-row gap-gutter">
        
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] sticky top-[104px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="font-headline-xl text-headline-xl text-[#1E293B] font-bold">Filters</h2>
              <button 
                onClick={handleClearFilters}
                className="text-[#1E293B] font-body-sm text-body-sm font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category / Role Required (Rounded tag style from the screenshot) */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="font-body-base text-body-base font-semibold text-[#1E293B] mb-3">Role Required</h3>
              <div className="flex flex-wrap gap-2">
                {['Web Development', 'UI/UX Design', 'Mobile Apps'].map(cat => {
                  const active = selectedCategories[cat];
                  return (
                    <span 
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`font-body-sm text-body-sm px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-200 border select-none ${
                        active 
                          ? 'bg-[#1E293B]/10 border-[#1E293B] text-[#1E293B] font-semibold' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'Web Development' ? 'Developer' : cat === 'UI/UX Design' ? 'Designer' : 'Mobile Apps'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="font-body-base text-body-base font-semibold text-[#1E293B] mb-3">Budget Range (USD)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    className="w-full font-body-sm text-body-sm p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B] text-slate-700 font-semibold" 
                    placeholder="$ Min" 
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    className="w-full font-body-sm text-body-sm p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B] text-slate-700 font-semibold" 
                    placeholder="$ Max" 
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Project Type Filter (Checkbox style from the screenshot) */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="font-body-base text-body-base font-semibold text-[#1E293B] mb-3">Project Type</h3>
              <div className="space-y-2.5">
                {['Fixed Price', 'Hourly Rate'].map(type => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-[#1E293B] focus:ring-[#1E293B] w-4 h-4 cursor-pointer"
                      checked={projectType === type}
                      onChange={() => setProjectType(projectType === type ? '' : type)}
                    />
                    <span className="font-body-sm text-body-sm text-slate-600 group-hover:text-[#1E293B] transition-colors font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Tag Filters */}
            <div>
              <h3 className="font-body-base text-body-base font-semibold text-[#1E293B] mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Figma', 'React', 'Node.js', 'UI/UX', 'Branding', 'React Native'].map(skill => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <span 
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`font-body-sm text-body-sm px-3 py-1 rounded-full cursor-pointer transition-all duration-200 select-none ${
                        active 
                          ? 'bg-[#1E293B] text-white shadow-sm font-semibold' 
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-slate-200'
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
          <div className="flex justify-between items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
            <span className="font-body-sm text-body-sm text-slate-600 font-medium">
              Showing <strong className="text-slate-800 font-semibold">{sortedProjects.length}</strong> projects {searchWord ? `for "${searchWord}"` : ''}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-body-sm text-body-sm text-slate-500 font-medium">Sort by:</span>
              <select 
                className="font-body-sm text-body-sm border-none bg-transparent text-[#1E293B] font-bold focus:ring-0 cursor-pointer pl-0 pr-8"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest First">Newest First</option>
                <option value="Highest Budget">Highest Budget</option>
              </select>
            </div>
          </div>

          {/* Bento Grid List */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sortedProjects.map(project => (
              <article 
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col group overflow-hidden"
              >
                {/* Premium Badge */}
                {project.premium && (
                  <div className="absolute top-0 right-0 bg-[#FFFBEB] text-[#B45309] font-label-caps text-label-caps px-3 py-1 rounded-bl-xl border-l border-b border-[#FDE68A] flex items-center gap-1 shadow-sm font-bold select-none">
                    <span className="material-symbols-outlined text-[14px]">star</span> Premium
                  </div>
                )}

                <div className={`flex items-start gap-4 mb-4 ${project.premium ? 'mt-2' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden text-[#1E293B]">
                    <span className="material-symbols-outlined text-[28px]">
                      {project.category === 'Mobile Apps' ? 'phone_iphone' : project.category === 'UI/UX Design' ? 'palette' : 'code'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-xl text-headline-xl text-[#1E293B] mb-1 font-extrabold group-hover:text-[#1E293B] transition-colors cursor-pointer" onClick={() => navigate(token ? '/project-details' : '/login')}>
                      {project.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-slate-500 flex items-center gap-2.5">
                      <span className="flex items-center gap-1 font-medium"><span className="material-symbols-outlined text-[16px] text-slate-400">domain</span> {project.company}</span>
                      {project.verified && (
                        <span className="flex items-center gap-0.5 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-bold border border-slate-200">
                          <span className="material-symbols-outlined text-[12px] font-fill-1">verified</span> Verified
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="font-body-base text-body-base text-slate-600 mb-6 line-clamp-3 flex-grow">
                  {project.description}
                </p>

                {/* Stats Panel */}
                <div className="grid grid-cols-2 gap-4 mb-6 bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="block font-label-caps text-label-caps text-slate-400 mb-0.5">Budget</span>
                    <span className="font-body-base text-body-base font-bold text-slate-800">{project.budget}</span>
                  </div>
                  <div>
                    <span className="block font-label-caps text-label-caps text-slate-400 mb-0.5">Timeline</span>
                    <span className="font-body-base text-body-base font-bold text-slate-800">{project.duration}</span>
                  </div>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.skills.map(skill => (
                    <span key={skill} className="bg-slate-100 text-slate-600 font-body-sm text-body-sm px-2.5 py-0.5 rounded-md border border-slate-200/50 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-auto border-t border-slate-100 pt-4">
                  <button 
                    onClick={() => navigate(token ? '/project-details' : '/login')}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 font-body-sm text-body-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors active:scale-[0.98] text-center"
                  >
                    View Detail
                  </button>
                  <div className="flex-1 relative tooltip-container">
                    {token ? (
                      <button 
                        onClick={() => navigate('/submit-proposal')}
                        className="w-full bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-body-sm text-body-sm font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] text-center border-none"
                      >
                        Submit Proposal
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate('/login')}
                          className="w-full bg-slate-200 text-slate-400 font-body-sm text-body-sm font-semibold py-2.5 px-4 rounded-xl cursor-pointer text-center border-none active:scale-[0.98]"
                        >
                          Submit Proposal
                        </button>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white font-body-sm text-body-sm rounded-lg opacity-0 invisible transition-all duration-200 whitespace-nowrap z-10 shadow-md">
                          Login to Bid
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {sortedProjects.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
                <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2">find_in_page</span>
                <h4 className="font-headline-xl text-headline-xl text-slate-700 font-bold mb-1">No Projects Found</h4>
                <p className="font-body-md text-body-md text-slate-500">We couldn't find any projects matching your exact filters.</p>
                <button 
                  onClick={handleClearFilters}
                  className="mt-4 px-5 py-2.5 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white rounded-xl font-body-sm text-body-sm font-semibold hover:shadow-md transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedProjects.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1.5">
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-body-sm text-body-sm font-semibold flex items-center justify-center shadow-sm">1</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 font-body-sm text-body-sm hover:bg-slate-50 transition-colors">2</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 font-body-sm text-body-sm hover:bg-slate-50 transition-colors">3</button>
                <span className="text-slate-400 px-1 select-none">...</span>
                <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
