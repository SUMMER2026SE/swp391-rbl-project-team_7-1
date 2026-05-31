import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex selection:bg-teal-100 selection:text-teal-900 w-full">
      {/* SideNavBar */}
      {/* SideNavBar */}
      <nav className="bg-gradient-to-br from-[#0F766E] to-[#042F2E] h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-teal-800 z-50 shadow-xl transition-all duration-300">
        <div className="flex flex-col h-full py-8 px-4">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-md shadow-sm border border-white/20 text-white">
              <span className="material-symbols-outlined filled">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-white tracking-tight">FJMS Admin</h1>
              <p className="font-label-sm text-label-sm text-teal-200">Enterprise Control</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="space-y-1 flex-1 px-2 custom-scrollbar">
            {/* Active Tab: Dashboard */}
            <Link className="flex items-center gap-3 px-4 py-2.5 bg-white/20 text-white rounded-xl font-label-md text-label-md font-semibold shadow-sm border border-white/10 translate-x-1 transition-all" to="/admin/dashboard">
              <span className="material-symbols-outlined filled">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">group</span>
              <span>Users</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">work</span>
              <span>Projects</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">assessment</span>
              <span>Reports</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">gavel</span>
              <span>Disputes</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">receipt_long</span>
              <span>Transactions</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">payments</span>
              <span>Payouts</span>
            </Link>
            <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-xl font-label-md text-label-md" to="#">
              <span className="material-symbols-outlined">monetization_on</span>
              <span>Platform Fees</span>
            </Link>
          </div>
          {/* Footer area within SideNav */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4 px-2">
            <button className="w-full bg-white/10 text-white border border-white/20 py-2.5 rounded-xl font-label-md text-label-md hover:bg-white/20 hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Monthly Report
            </button>
            <div className="space-y-1">
              <Link className="flex items-center gap-3 px-4 py-2.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 font-label-md text-label-md" to="#">
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-300 hover:text-red-200 hover:bg-white/10 rounded-xl transition-all duration-200 font-label-md text-label-md cursor-pointer outline-none text-left"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        {/* Shared Component: TopNavBar */}
        <header className="flex justify-between items-center w-full pl-[280px] pr-8 h-[72px] z-40 fixed bg-white/80 backdrop-blur-xl border-b border-slate-200 left-0 shadow-sm transition-all duration-300">
          {/* Left: Search */}
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full bg-slate-100 border border-transparent rounded-full py-2.5 pl-10 pr-4 text-body-sm font-body-sm focus:outline-none focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E] focus:bg-white transition-all shadow-inner placeholder-slate-400 text-slate-800" placeholder="Search users, projects, or txns..." type="text" />
            </div>
          </div>
          {/* Middle: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 mx-8">
            <Link className="text-[#0F766E] font-bold border-b-2 border-[#0F766E] pb-1 font-label-sm text-label-sm" to="#">Overview</Link>
            <Link className="text-slate-500 font-medium font-label-sm text-label-sm hover:text-[#0F766E] transition-all" to="#">System Status</Link>
            <Link className="text-slate-500 font-medium font-label-sm text-label-sm hover:text-[#0F766E] transition-all" to="#">Audit Logs</Link>
          </nav>
          {/* Right: Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <button className="relative text-slate-500 hover:text-[#0F766E] transition-colors p-2 rounded-full hover:bg-teal-50">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button className="hidden md:flex bg-white border border-slate-200 text-slate-600 hover:text-[#0F766E] hover:border-[#0F766E] px-4 py-2 rounded-xl font-label-sm text-label-sm transition-all shadow-sm items-center cursor-pointer font-semibold">
              Create Admin
            </button>
            <div className="relative group cursor-pointer ml-1">
              <div className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full transition-colors">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold border border-teal-200 shadow-sm">
                  A
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Canvas */}
        <main className="flex-1 pt-24 pb-xl px-lg lg:px-xl max-w-[1600px] mx-auto w-full">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Overview</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time metrics and system health for FJMS.</p>
            </div>
            <div className="flex items-center gap-md">
              <span className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-highest px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary"></span> System Healthy
              </span>
              <select className="bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-3 pr-8 text-body-sm font-label-md text-on-surface focus:ring-primary focus:border-primary">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>
          </div>
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {/* Stat Card 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>
                <span className="font-label-sm text-label-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-slate-500 font-medium mb-1">Total Users</p>
                <h3 className="font-headline-xl text-headline-xl text-slate-800 tracking-tight font-bold">8.2k</h3>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[24px]">work_outline</span>
                </div>
                <span className="font-label-sm text-label-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 8%
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-slate-500 font-medium mb-1">Total Projects</p>
                <h3 className="font-headline-xl text-headline-xl text-slate-800 tracking-tight font-bold">1.4k</h3>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <span className="font-label-sm text-label-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 24%
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-slate-500 font-medium mb-1">Active Escrows</p>
                <h3 className="font-headline-xl text-headline-xl text-slate-800 tracking-tight font-bold">$42k</h3>
              </div>
            </div>
            {/* Stat Card 4 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] flex flex-col justify-between group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                </div>
                <span className="font-label-sm text-label-sm text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 18%
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-slate-500 font-medium mb-1">Platform Revenue</p>
                <h3 className="font-headline-xl text-headline-xl text-slate-800 tracking-tight font-bold">$12.5k</h3>
              </div>
            </div>
            {/* Stat Card 5 (Warning) */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <span className="font-label-sm text-label-sm text-red-700 bg-red-100 px-2.5 py-1 rounded-md flex items-center gap-1 font-bold">
                  Requires Action
                </span>
              </div>
              <div className="relative z-10">
                <p className="font-label-md text-label-md text-red-600 font-medium mb-1">Open Disputes</p>
                <h3 className="font-headline-xl text-headline-xl text-red-700 tracking-tight font-bold">4</h3>
              </div>
            </div>
          </div>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
            {/* Line Chart (Large) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight">User Growth Dynamics</h3>
                  <p className="font-body-sm text-body-sm text-slate-500 mt-1">Freelancers vs Employers (Trailing 6 Months)</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              {/* Chart Simulation Canvas */}
              <div className="flex-1 min-h-[300px] relative flex flex-col justify-end">
                {/* Y-axis lines */}
                <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-8 z-0">
                  <div className="border-b border-slate-100 w-full h-0"></div>
                  <div className="border-b border-slate-100 w-full h-0"></div>
                  <div className="border-b border-slate-100 w-full h-0"></div>
                  <div className="border-b border-slate-100 w-full h-0"></div>
                </div>
                {/* SVG Line Chart Mockup */}
                <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Freelancers (Primary) */}
                  <path d="M 0,80 C 20,70 40,85 60,40 C 80,-5 100,20 100,20" fill="none" stroke="#0F766E" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                  {/* Fill Area */}
                  <path d="M 0,80 C 20,70 40,85 60,40 C 80,-5 100,20 100,20 L 100,100 L 0,100 Z" fill="url(#primaryGradient)" opacity="0.15"></path>
                  {/* Employers (Tertiary/Gold) */}
                  <path d="M 0,90 C 30,85 50,95 70,60 C 90,25 100,50 100,50" fill="none" stroke="#0ea5e9" strokeDasharray="6" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0F766E"></stop>
                      <stop offset="100%" stopColor="transparent"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                {/* X-axis Labels */}
                <div className="flex justify-between items-center text-label-sm text-slate-500 font-medium mt-4 z-20 px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0F766E]"></div>
                  <span className="font-label-sm text-label-sm text-slate-600 font-semibold">Freelancers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500 border border-sky-500 border-dashed"></div>
                  <span className="font-label-sm text-label-sm text-slate-600 font-semibold">Employers</span>
                </div>
              </div>
            </div>
            {/* Donut Chart & Bar Chart Column */}
            <div className="flex flex-col gap-6">
              {/* Project Status Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex-1 shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight mb-6">Project Status</h3>
                <div className="space-y-4">
                  {/* Bar 1 */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-label-sm text-label-sm text-slate-500 font-medium">In Progress</span>
                      <span className="font-label-sm text-label-sm text-slate-800 font-bold">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-[#0F766E] h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  {/* Bar 2 */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-label-sm text-label-sm text-slate-500 font-medium">Open</span>
                      <span className="font-label-sm text-label-sm text-slate-800 font-bold">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  {/* Bar 3 */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-label-sm text-label-sm text-slate-500 font-medium">Completed</span>
                      <span className="font-label-sm text-label-sm text-slate-800 font-bold">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  {/* Bar 4 */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-label-sm text-label-sm text-red-500 font-medium">Disputed</span>
                      <span className="font-label-sm text-label-sm text-red-600 font-bold">3%</span>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Revenue Distribution Donut */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0F766E] via-sky-500 to-amber-500"></div>
                <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight w-full text-left mb-auto mt-2">Revenue Source</h3>
                {/* Simple Donut Simulation */}
                <div className="relative w-36 h-36 my-6">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                    {/* Segment 1 (Service Fees - 60%) */}
                    <path className="text-[#0F766E]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeWidth="4"></path>
                    {/* Segment 2 (Premium Upgrades - 25%) offset 60 */}
                    <path className="text-amber-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="4"></path>
                    {/* Segment 3 (Escrow Interest - 15%) offset 85 */}
                    <path className="text-sky-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-85" stroke-width="4"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="font-headline-md text-headline-md text-slate-800 font-bold leading-none">60%</span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center text-label-sm font-label-sm">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#0F766E]"></div><span className="font-medium text-slate-600">Service</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="font-medium text-slate-600">Premium</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-sky-500"></div><span className="font-medium text-slate-600">Escrow</span></div>
                </div>
              </div>
          </div>
          {/* Data Tables Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
            {/* Pending Moderation */}
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">shield</span>
                  Pending Moderation
                </h3>
                <button className="text-[#0F766E] font-label-sm text-label-sm hover:underline font-bold">View All</button>
              </div>
              <div className="p-0 flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Project Name</th>
                      <th className="py-4 px-6 font-semibold">Employer</th>
                      <th className="py-4 px-6 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <p className="font-label-md text-label-md text-slate-800 font-bold group-hover:text-[#0F766E] transition-colors">Enterprise React Dashboard</p>
                        <p className="font-body-sm text-body-sm text-slate-500 truncate w-48 mt-0.5">Needs review for prohibited keywords in desc.</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">AC</div>
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium">Acme Corp</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="bg-white border border-slate-200 text-slate-600 hover:border-[#0F766E] hover:text-[#0F766E] px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-colors shadow-sm">Review</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-amber-50/50 transition-colors group cursor-pointer bg-amber-50/20">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <p className="font-label-md text-label-md text-slate-800 font-bold group-hover:text-[#0F766E] transition-colors">Smart Contract Audit</p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase border border-amber-200">High Value</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-500 truncate w-48 mt-0.5">Budget exceeds auto-approval limits.</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">NL</div>
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium">Nexus Labs</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="bg-[#0F766E] text-white hover:bg-[#0D5E58] px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold transition-colors shadow-sm">Review</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Active Disputes */}
            <div className="bg-white border border-red-200 rounded-2xl flex flex-col overflow-hidden relative shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white pl-8">
                <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">warning</span>
                  Active Disputes
                </h3>
                <span className="bg-red-100 text-red-700 border border-red-200 font-label-sm text-label-sm px-3 py-1 rounded-full font-bold">4 Requires Attention</span>
              </div>
              <div className="p-0 flex-1 overflow-x-auto pl-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold">Case ID</th>
                      <th className="py-4 px-6 font-semibold">Parties</th>
                      <th className="py-4 px-6 font-semibold text-right">Escrow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-label-md text-label-md text-[#0F766E] font-bold font-mono cursor-pointer hover:underline">#DSP-8821</p>
                        <p className="font-body-sm text-body-sm text-red-500 mt-1 font-medium">Missed Milestones</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium"><span className="text-slate-400 font-bold mr-1">E:</span> StartupX Inc.</span>
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium"><span className="text-slate-400 font-bold mr-1">F:</span> DevStudio Pro</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <p className="font-label-md text-label-md text-slate-800 font-bold">$4,500</p>
                        <button className="mt-2 text-[#0F766E] font-label-sm text-label-sm hover:underline font-bold">Mediate</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-label-md text-label-md text-[#0F766E] font-bold font-mono cursor-pointer hover:underline">#DSP-8819</p>
                        <p className="font-body-sm text-body-sm text-slate-500 mt-1 font-medium">Quality Concerns</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium"><span className="text-slate-400 font-bold mr-1">E:</span> Global Retail</span>
                          <span className="font-body-sm text-body-sm text-slate-700 font-medium"><span className="text-slate-400 font-bold mr-1">F:</span> Jane Doe Designs</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <p className="font-label-md text-label-md text-slate-800 font-bold">$1,200</p>
                        <button className="mt-2 text-[#0F766E] font-label-sm text-label-sm hover:underline font-bold">Mediate</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
