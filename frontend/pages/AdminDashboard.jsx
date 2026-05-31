import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex selection:bg-primary-container selection:text-on-primary-container w-full">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-inverse-surface h-screen w-64 fixed left-0 top-0 overflow-y-auto border-r border-outline-variant dark:border-outline z-50">
        <div className="flex flex-col h-full py-xl px-md">
          {/* Header */}
          <div className="flex items-center gap-md px-lg mb-xl">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container filled">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed">FJMS Admin</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Enterprise Control</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="space-y-sm flex-1">
            {/* Active Tab: Dashboard */}
            <Link className="flex items-center gap-md px-lg py-md bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-xl font-semibold scale-95 transition-transform duration-150" to="/admin/dashboard">
              <span className="material-symbols-outlined filled">dashboard</span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">group</span>
              <span className="font-label-md text-label-md">Users</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">work</span>
              <span className="font-label-md text-label-md">Projects</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">assessment</span>
              <span className="font-label-md text-label-md">Reports</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">gavel</span>
              <span className="font-label-md text-label-md">Disputes</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="font-label-md text-label-md">Transactions</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-label-md">Payouts</span>
            </Link>
            <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl duration-200" to="#">
              <span className="material-symbols-outlined">monetization_on</span>
              <span className="font-label-md text-label-md">Platform Fees</span>
            </Link>
          </div>
          {/* Footer area within SideNav */}
          <div className="mt-xl pt-lg border-t border-outline-variant space-y-md">
            <button className="w-full bg-primary text-on-primary py-md rounded-xl font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Generate Monthly Report
            </button>
            <div className="space-y-sm">
              <Link className="flex items-center gap-md px-lg py-md text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-xl duration-200" to="#">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label-md text-label-md">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-md px-lg py-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-all duration-200 font-label-md text-label-md cursor-pointer outline-none text-left"
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
        <header className="flex justify-between items-center w-full pl-72 pr-lg h-16 z-40 fixed bg-surface/80 backdrop-blur-md border-b border-outline-variant dark:border-outline left-0">
          {/* Left: Search */}
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline" placeholder="Search users, projects, or txns..." type="text" />
            </div>
          </div>
          {/* Middle: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-lg mx-lg">
            <Link className="text-primary dark:text-primary-fixed font-bold border-b-2 border-primary pb-base font-label-sm text-label-sm opacity-80 transition-opacity" to="#">Overview</Link>
            <Link className="text-on-surface-variant dark:text-surface-variant font-medium font-label-sm text-label-sm hover:text-primary dark:hover:text-primary-fixed transition-all" to="#">System Status</Link>
            <Link className="text-on-surface-variant dark:text-surface-variant font-medium font-label-sm text-label-sm hover:text-primary dark:hover:text-primary-fixed transition-all" to="#">Audit Logs</Link>
          </nav>
          {/* Right: Actions */}
          <div className="flex items-center gap-md shrink-0">
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <div className="h-6 w-[1px] bg-outline-variant mx-2"></div>
            <button className="hidden md:block bg-surface-container-lowest border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-lg font-label-sm text-label-sm transition-colors">
              Create Admin
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors ml-2">
              <span className="material-symbols-outlined filled text-[32px]">account_circle</span>
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter mb-xl">
            {/* Stat Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg ambient-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-md">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary bg-primary-container/10 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Users</p>
              <h3 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">8.2k</h3>
            </div>
            {/* Stat Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg ambient-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined">work_outline</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary bg-primary-container/10 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 8%
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Total Projects</p>
              <h3 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">1.4k</h3>
            </div>
            {/* Stat Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg ambient-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary bg-primary-container/10 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 24%
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Active Escrows</p>
              <h3 class="font-headline-xl text-headline-xl text-on-surface tracking-tight">$42k</h3>
            </div>
            {/* Stat Card 4 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg ambient-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-md">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary bg-primary-container/10 px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 18%
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1">Platform Revenue</p>
              <h3 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">$12.5k</h3>
            </div>
            {/* Stat Card 5 (Warning) */}
            <div className="bg-surface-container-lowest border border-error-container rounded-2xl p-lg ambient-shadow-hover transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full"></div>
              <div className="flex items-start justify-between mb-md relative z-10">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                  <span className="material-symbols-outlined">gavel</span>
                </div>
                <span className="font-label-sm text-label-sm text-error bg-error-container/50 px-2 py-1 rounded-md flex items-center gap-1">
                  Requires Action
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mb-1 relative z-10">Open Disputes</p>
              <h3 className="font-headline-xl text-headline-xl text-error tracking-tight relative z-10">4</h3>
            </div>
          </div>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
            {/* Line Chart (Large) */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col">
              <div className="flex justify-between items-center mb-lg">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">User Growth Dynamics</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Freelancers vs Employers (Trailing 6 Months)</p>
                </div>
                <button className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              {/* Chart Simulation Canvas */}
              <div className="flex-1 min-h-[300px] relative flex flex-col justify-end">
                {/* Y-axis lines */}
                <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-8 z-0">
                  <div className="border-b border-outline-variant/30 w-full h-0"></div>
                  <div className="border-b border-outline-variant/30 w-full h-0"></div>
                  <div className="border-b border-outline-variant/30 w-full h-0"></div>
                  <div className="border-b border-outline-variant/30 w-full h-0"></div>
                </div>
                {/* SVG Line Chart Mockup */}
                <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Freelancers (Primary) */}
                  <path d="M 0,80 C 20,70 40,85 60,40 C 80,-5 100,20 100,20" fill="none" stroke="#005c55" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  {/* Fill Area */}
                  <path d="M 0,80 C 20,70 40,85 60,40 C 80,-5 100,20 100,20 L 100,100 L 0,100 Z" fill="url(#primaryGradient)" opacity="0.1"></path>
                  {/* Employers (Tertiary/Gold) */}
                  <path d="M 0,90 C 30,85 50,95 70,60 C 90,25 100,50 100,50" fill="none" stroke="#694d00" strokeDasharray="4" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <defs>
                    <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#005c55"></stop>
                      <stop offset="100%" stopColor="transparent"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                {/* X-axis Labels */}
                <div className="flex justify-between items-center text-label-sm text-on-surface-variant font-label-sm mt-4 z-20 px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-lg mt-md border-t border-outline-variant pt-md">
                <div className="flex items-center gap-sm">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-label-sm text-label-sm text-on-surface">Freelancers</span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="w-3 h-3 rounded-full bg-tertiary border border-tertiary border-dashed"></div>
                  <span className="font-label-sm text-label-sm text-on-surface">Employers</span>
                </div>
              </div>
            </div>
            {/* Donut Chart & Bar Chart Column */}
            <div className="flex flex-col gap-gutter">
              {/* Project Status Bar Chart */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg">Project Status</h3>
                <div className="space-y-md">
                  {/* Bar 1 */}
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">In Progress</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">65%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  {/* Bar 2 */}
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Open</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">20%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  {/* Bar 3 */}
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span class="font-label-sm text-label-sm text-on-surface-variant">Completed</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">12%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-outline h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  {/* Bar 4 */}
                  <div>
                    <div className="flex justify-between mb-xs">
                      <span className="font-label-sm text-label-sm text-error">Disputed</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">3%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2">
                      <div className="bg-error h-2 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Revenue Distribution Donut */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface w-full text-left mb-auto">Revenue Source</h3>
                {/* Simple Donut Simulation */}
                <div className="relative w-32 h-32 my-md">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
                    {/* Segment 1 (Service Fees - 60%) */}
                    <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeWidth="4"></path>
                    {/* Segment 2 (Premium Upgrades - 25%) offset 60 */}
                    <path className="text-tertiary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="4"></path>
                    {/* Segment 3 (Escrow Interest - 15%) offset 85 */}
                    <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-85" stroke-width="4"></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="font-headline-md text-headline-md text-on-surface leading-none">60%</span>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center text-label-sm font-label-sm">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div>Service</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-tertiary"></div>Premium</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-secondary"></div>Escrow</div>
                </div>
              </div>
            </div>
          </div>
          {/* Data Tables Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
            {/* Pending Moderation */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col overflow-hidden">
              <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">shield</span>
                  Pending Moderation
                </h3>
                <button className="text-primary font-label-sm text-label-sm hover:underline">View All</button>
              </div>
              <div className="p-0 flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium">Project Name</th>
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium">Employer</th>
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="py-md px-lg">
                        <p className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors cursor-pointer">Enterprise React Dashboard</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate w-48">Needs review for prohibited keywords in desc.</p>
                      </td>
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs">AC</div>
                          <span className="font-body-sm text-body-sm text-on-surface">Acme Corp</span>
                        </div>
                      </td>
                      <td className="py-md px-lg text-right">
                        <button className="bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary hover:text-primary px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors">Review</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors group bg-tertiary-container/5">
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-2">
                          <p className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors cursor-pointer">Smart Contract Audit</p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-container text-tertiary uppercase">High Value</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate w-48">Budget exceeds auto-approval limits.</p>
                      </td>
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-xs">NL</div>
                          <span className="font-body-sm text-body-sm text-on-surface">Nexus Labs</span>
                        </div>
                      </td>
                      <td className="py-md px-lg text-right">
                        <button className="bg-primary text-on-primary hover:bg-primary-container px-3 py-1 rounded-md font-label-sm text-label-sm transition-colors">Review</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* Active Disputes */}
            <div className="bg-surface-container-lowest border border-error-container/30 rounded-2xl flex flex-col overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
              <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright pl-xl">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">warning</span>
                  Active Disputes
                </h3>
                <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">4 Requires Attention</span>
              </div>
              <div className="p-0 flex-1 overflow-x-auto pl-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium">Case ID</th>
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium">Parties</th>
                      <th className="py-md px-lg font-label-sm text-label-sm text-on-surface-variant font-medium text-right">Escrow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-lg">
                        <p className="font-label-md text-label-md text-primary font-mono cursor-pointer hover:underline">#DSP-8821</p>
                        <p className="font-body-sm text-body-sm text-error mt-0.5">Missed Milestones</p>
                      </td>
                      <td className="py-md px-lg">
                        <div className="flex flex-col gap-1">
                          <span className="font-body-sm text-body-sm text-on-surface">E: StartupX Inc.</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">F: DevStudio Pro</span>
                        </div>
                      </td>
                      <td className="py-md px-lg text-right">
                        <p className="font-label-md text-label-md text-on-surface font-semibold">$4,500</p>
                        <button className="mt-1 text-primary font-label-sm text-label-sm hover:underline">Mediate</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-lg">
                        <p className="font-label-md text-label-md text-primary font-mono cursor-pointer hover:underline">#DSP-8819</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Quality Concerns</p>
                      </td>
                      <td className="py-md px-lg">
                        <div className="flex flex-col gap-1">
                          <span className="font-body-sm text-body-sm text-on-surface">E: Global Retail</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">F: Jane Doe Designs</span>
                        </div>
                      </td>
                      <td className="py-md px-lg text-right">
                        <p className="font-label-md text-label-md text-on-surface font-semibold">$1,200</p>
                        <button className="mt-1 text-primary font-label-sm text-label-sm hover:underline">Mediate</button>
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
