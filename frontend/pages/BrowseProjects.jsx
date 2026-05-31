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
    <div className="bg-slate-50 min-h-screen flex flex-col w-full">
      
      {/* Full-width Hero Banner */}
      <section className={`bg-gradient-to-br from-teal-50 via-white to-teal-50/50 border-b border-teal-100/50 py-16 px-6 md:px-12 w-full ${!token ? 'pt-[116px] md:pt-[124px]' : 'pt-12'}`}>
        <div className="max-w-[1440px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl text-teal-950 font-extrabold tracking-tight mb-4">
            Find High-Value Projects
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium mx-auto md:mx-0">
            Discover opportunities that match your expertise. Filter by budget, skills, and timeline to find your next engagement.
          </p>
        </div>
      </section>

      {/* Main Grid View */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Filter Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-[104px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl text-teal-950 font-bold">Filters</h2>
              <button 
                onClick={handleClearFilters}
                className="text-teal-700 text-sm font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Category / Role Required */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Role Required</h3>
              <div className="flex flex-col gap-2">
                {['Web Development', 'UI/UX Design', 'Mobile Apps'].map(cat => {
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
                        {cat === 'Web Development' ? 'Developer' : cat === 'UI/UX Design' ? 'Designer' : 'Mobile Apps'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Budget Range (USD)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="$ Min" 
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="$ Max" 
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Project Type Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Project Type</h3>
              <div className="space-y-3">
                {['Fixed Price', 'Hourly Rate'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group select-none">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                      checked={projectType === type}
                      onChange={() => setProjectType(projectType === type ? '' : type)}
                    />
                    <span className="text-sm text-slate-600 group-hover:text-teal-700 transition-colors font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Tag Filters */}
            <div>
              <h3 className="text-base font-semibold text-teal-950 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'React', 'Node.js', 'UI/UX', 'Branding', 'React Native'].map(skill => {
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
              Showing <strong className="text-teal-900 font-bold">{sortedProjects.length}</strong> projects {searchWord ? `for "${searchWord}"` : ''}
            </span>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <span className="text-sm text-slate-500 font-medium">Sort by:</span>
              <select 
                className="text-sm border-none bg-transparent text-teal-900 font-bold focus:ring-0 cursor-pointer pl-1 pr-8 py-0"
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
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_8px_24px_rgba(15,118,110,0.06)] hover:-translate-y-1 transition-all duration-300 relative flex flex-col group overflow-hidden"
              >
                {/* Premium Badge */}
                {project.premium && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-bl-2xl font-bold flex items-center gap-1 shadow-sm select-none border-b border-l border-amber-200/50">
                    <span className="material-symbols-outlined text-[14px]">stars</span> Premium
                  </div>
                )}

                <div className={`flex items-start gap-4 mb-5 ${project.premium ? 'mt-2' : ''}`}>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600 border border-teal-100 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[28px]">
                      {project.category === 'Mobile Apps' ? 'phone_iphone' : project.category === 'UI/UX Design' ? 'palette' : 'code'}
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
                          <span className="material-symbols-outlined text-[14px] font-fill-1 text-teal-600">verified</span> Verified
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
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Budget</span>
                    <span className="text-base font-bold text-slate-800">{project.budget}</span>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div className="flex-1">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Timeline</span>
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
                    View Detail
                  </button>
                  <div className="flex-1 relative tooltip-container">
                    {token ? (
                      <button 
                        onClick={() => navigate('/submit-proposal')}
                        className="w-full bg-[#0F766E] text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all duration-300 active:scale-[0.98] text-center border-none"
                      >
                        Submit Proposal
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate('/login')}
                          className="w-full bg-slate-100 text-slate-400 text-sm font-semibold py-2.5 px-4 rounded-xl cursor-pointer text-center border-none active:scale-[0.98]"
                        >
                          Submit Proposal
                        </button>
                        <div className="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible transition-all duration-200 whitespace-nowrap z-10 shadow-md">
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
              <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-2xl text-slate-500 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">search_off</span>
                <h4 className="text-xl text-slate-800 font-bold mb-2">No Projects Found</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">We couldn't find any projects matching your exact filters. Try adjusting your criteria.</p>
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Clear all filters
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
