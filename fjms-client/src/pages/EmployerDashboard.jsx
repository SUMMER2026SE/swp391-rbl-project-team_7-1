import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const handleLogout = () => {
    alert('Logging out from Employer Portal...');
    window.location.href = '/login';
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex overflow-hidden font-body-md text-body-md w-full antialiased">
      
      {/* SideNavBar (Shared Component) */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-surface-container-lowest border-r border-outline-variant shrink-0 z-40 transition-all duration-300">
        
        {/* Header/Brand */}
        <div className="p-lg border-b border-outline-variant flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              business_center
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm text-primary">FJMS</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Employer Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-md space-y-xs">
          {/* Active Navigation Item */}
          <Link className="flex items-center gap-md bg-secondary-container text-on-secondary-container rounded-lg px-md py-sm Active:scale-98 transition-transform" to="/employer/dashboard">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>

          {/* Workspace */}
          <div className="pt-sm pb-xs">
            <p className="px-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Workspace</p>
          </div>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg" to="/projects">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="font-label-md text-label-md">Create Project</span>
          </Link>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg" to="/projects">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-label-md text-label-md">My Projects</span>
          </Link>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg justify-between" to="/projects">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined">description</span>
              <span className="font-label-md text-label-md">Proposals</span>
            </div>
            <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </Link>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg" to="/projects">
            <span className="material-symbols-outlined">workspaces</span>
            <span className="font-label-md text-label-md">Workspaces</span>
          </Link>

          {/* Management */}
          <div className="pt-md pb-xs">
            <p className="px-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Management</p>
          </div>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg justify-between" to="/projects">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined">mail</span>
              <span className="font-label-md text-label-md">Messages</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-error"></div>
          </Link>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg" to="/projects">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="font-label-md text-label-md">Wallet</span>
          </Link>
          <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg" to="/projects">
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="font-label-md text-label-md">Reports</span>
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className="p-md border-t border-outline-variant space-y-sm bg-surface-container-low">
          <Link className="flex items-center justify-center gap-sm w-full py-2 px-4 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md cursor-pointer" to="/freelancer/dashboard">
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
            Switch to Freelancer
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top App Bar */}
        <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-lg shrink-0 z-30">
          <div className="flex items-center gap-md md:hidden">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-headline-sm text-headline-sm font-bold text-primary">FJMS</span>
          </div>
          
          <div className="hidden md:block">
            {/* Search */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none text-on-surface"
                placeholder="Search projects, freelancers..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface-container-lowest"></span>
            </button>
            
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            
            <div onClick={handleLogout} className="flex items-center gap-sm cursor-pointer hover:opacity-85 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV5E44BaBriBWglj-I_k6fwz7toiSkY3RG0i_as2Vx4plgcOeM-ugBtLj5LErl0oXuEReJVuj9Y0IW5lSPdFPogcZavrOMGgS4n3Vh0RKyOoP5K50yloSHNSwKDWcciuFKjMbpkIHFQRJtvgk4cqQG81yUmywRJgN8uc29Ntu1JVC0tx-RUene-ZIGaY0Q0yNNiQ5FpV7EXom55VRkaquFY4Fy6BHa52Qxth80wESlSibki-sYINRQxS3iHPzXf3mqL_AmTP9OEynz"
                />
              </div>
              <span className="font-label-md text-label-md hidden lg:block">TechCorp Inc.</span>
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-md lg:p-xl scroll-smooth">
          <div className="max-w-container-max mx-auto space-y-xl pb-24">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface">Overview</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track your projects, proposals, and team activity.</p>
              </div>
              
              <div className="flex gap-sm">
                <button
                  onClick={() => alert('Exporting report (CSV/Excel)...')}
                  className="bg-surface-container-lowest border border-primary text-primary hover:bg-surface-container-low font-label-md text-label-md px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Report
                </button>
                <Link
                  to="/projects"
                  className="bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Post New Project
                </Link>
              </div>
            </div>

            {/* Stats Grid (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-md">
              
              {/* Stat 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bento-hover transition-all duration-300 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary flex items-center bg-primary/10 px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> 12%
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Posted Projects</p>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">24</h3>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bento-hover transition-all duration-300 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary-container">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center bg-surface-variant px-2 py-1 rounded-md">
                    New 3
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Pending Proposals</p>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">18</h3>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bento-hover transition-all duration-300 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">handshake</span>
                  </div>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Active Contracts</p>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">7</h3>
                </div>
              </div>

              {/* Stat 4 (Escrow) */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bento-hover transition-all duration-300 flex flex-col justify-between lg:col-span-1 border-b-4 border-b-primary hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container border border-outline-variant px-2 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">VNPay Secure</span>
                  </div>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Escrow Balance</p>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">300.000.000 đ</h3>
                </div>
              </div>

              {/* Stat 5 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg bento-hover transition-all duration-300 flex flex-col justify-between hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Completed</p>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">156</h3>
                </div>
              </div>

            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              
              {/* Left Column (Wider) */}
              <div className="lg:col-span-2 space-y-lg">
                
                {/* Pending Submissions */}
                <div className="bg-tertiary-fixed/30 border border-tertiary-fixed-dim rounded-xl p-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-tertiary-fixed-dim/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                  <div className="flex items-start gap-md relative z-10">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0 shadow-sm">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Action Required: Milestone Approvals</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-4">
                        You have 2 pending submissions from freelancers waiting for your review. Approving releases funds from Escrow.
                      </p>
                      
                      <div className="space-y-sm">
                        <div className="bg-surface-container-lowest rounded-lg p-sm px-md border border-outline-variant flex items-center justify-between">
                          <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-outline text-[20px]">inventory_2</span>
                            <span className="font-label-md text-label-md text-on-surface">E-commerce UI Design - Phase 1</span>
                          </div>
                          <button onClick={() => alert('Reviewing E-commerce UI Design')} className="text-primary font-label-md text-label-md hover:underline cursor-pointer">
                            Review Work
                          </button>
                        </div>
                        <div className="bg-surface-container-lowest rounded-lg p-sm px-md border border-outline-variant flex items-center justify-between">
                          <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-outline text-[20px]">code</span>
                            <span className="font-label-md text-label-md text-on-surface">API Integration Script</span>
                          </div>
                          <button onClick={() => alert('Reviewing API Script')} className="text-primary font-label-md text-label-md hover:underline cursor-pointer">
                            Review Work
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Projects Table */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Projects</h3>
                    <Link className="text-primary font-label-md text-label-md hover:underline flex items-center cursor-pointer" to="/projects">
                      View All <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                    </Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                          <th className="p-md font-medium">Project Name</th>
                          <th className="p-md font-medium">Status</th>
                          <th className="p-md font-medium">Freelancer</th>
                          <th className="p-md font-medium text-right">Spent</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-on-surface">
                        <tr className="border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                          <td className="p-md font-medium">CRM Dashboard Migration</td>
                          <td className="p-md">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-semibold flex w-fit items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> In Progress
                            </span>
                          </td>
                          <td className="p-md flex items-center gap-2">
                            <img alt="Freelancer" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjBlZNIzWxT6IcbVh2b6hE--DsefCpGZXj6GQlVFZC-bO5BtcfGFzdbRRKUIt49FzvNvkUQaSOLvDGH81jggwpy80aEZlq6wqZxtTvuc8K2thln1MKqda6CirVCTvDddBupnFyZPJKxW8kPX5KLQ9uLaEvb7fO6kROgqDP9DRh-380EBT0EFJwtHkirke6uVHLtskftOE64pNNHjTgKPb7uqRx_XhII3aHHvoVsjIwPlffQltfWvzQnQx4IBOtt0lfNKZZrAJ2x36z" />
                            <span>Sarah J.</span>
                          </td>
                          <td className="p-md text-right font-medium">80.000.000 đ</td>
                        </tr>
                        <tr className="border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                          <td className="p-md font-medium">Mobile App Concept Design</td>
                          <td className="p-md">
                            <span className="bg-tertiary-container/10 text-tertiary px-2 py-1 rounded-md text-xs font-semibold flex w-fit items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div> Review
                            </span>
                          </td>
                          <td className="p-md flex items-center gap-2">
                            <img alt="Freelancer" className="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr-lEyw_grSf6UEk4B8rJif4KoisfbufyZv0Wd7INAyVSqzWQMNQZIh5HlIilOrH4Gm2a2V_nE8IW2QGYwMWeHVTs0vxuWhb6l75TuDE_fpwiLxuoEQ22nRbGGM7ZBp-6K8XyzGoLbYCpEasKIUk4BfLcB9lJ-MqZbLjOFNPXk0dEdGdEIrEYObFNIVdm9OCGinxY3Ohd5Ek7jc1UT8Mb7K0vHjj3vwHTXHey1gD9DkagBdPv2BjUcROnelJDhYohCthlXuqGSmRof" />
                            <span>Marcus T.</span>
                          </td>
                          <td className="p-md text-right font-medium">37.500.000 đ</td>
                        </tr>
                        <tr className="hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                          <td className="p-md font-medium">SEO Optimization 2024</td>
                          <td className="p-md">
                            <span className="bg-surface-variant text-on-surface-variant px-2 py-1 rounded-md text-xs font-semibold flex w-fit items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-outline"></div> Sourcing
                            </span>
                          </td>
                          <td className="p-md text-outline italic">3 Proposals</td>
                          <td className="p-md text-right font-medium text-outline-variant">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-lg">
                {/* Freelancer Suggestions */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
                  <div className="flex items-center gap-sm mb-6">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Top Talent for You</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Based on your recent \'React Native\' searches.</p>
                  
                  <div className="space-y-md">
                    {/* Talent Card 1 */}
                    <div className="group flex gap-md p-sm -mx-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                      <div className="relative shrink-0">
                        <img alt="Talent" className="w-12 h-12 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkgmoFOT-W3CVER-UmrnvEBpdFyj7t7LYMy9ANhG2hNi0ZfgUJl6EKPKSHCHAchhJ9FwkdMrhmGqOZkywmarGXGS0aOrpexZHyD0qAKd-7RGRpgcQdw2xQwjIn_fDRI09Usb50Wwl2V_NyBLujCK_lgs7_afKq2MbLFYqra0e-sLBJrRZXhO2odKdcRdFHMUFoDwzYT_uSnX3xCS-AfCy1WnrfsMboeEuCUuicBCSx6wHyVfFKG40uuMAdb3A-2VPf8lJYTcE23FA-" />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-surface-container-lowest"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors">Elena Rodriguez</h4>
                          <span className="flex items-center text-tertiary-fixed-dim font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Senior React Native Dev</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/10">PRO</span>
                          <span className="text-outline text-xs">850.000 đ/giờ</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Talent Card 2 */}
                    <div className="group flex gap-md p-sm -mx-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                      <div className="relative shrink-0">
                        <img alt="Talent" className="w-12 h-12 rounded-full object-cover border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7d5Jgziido1vt-U-JTa9dpm9FWbgGXbg9rRygv4JiqXWYLURHlGmpuOysCvBC5s2i4hD9kN0V77uiIlq-wsc0O23H7t65eOpJzPhEPIyoyraxPaAc7bZd13y8PpDyXMn_jZ4F7dOm9AGRMmZEWI0vB9YK9tnIPTXQy-rox6QhmmRdJm8R59t7YOveljWxbceibkyYQRlqHCGUvlwTwJktk6YeAfSOwvpjfNOwuTP7Ka6gywCHsD4liWLoI25RRelfU8ybo6jDqDRO" />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-outline-variant rounded-full border-2 border-surface-container-lowest"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors">David Kim</h4>
                          <span className="flex items-center text-tertiary-fixed-dim font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 5.0
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Full Stack Engineer</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-outline text-xs">950.000 đ/giờ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/projects" className="w-full mt-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-variant transition-colors text-center inline-block cursor-pointer">
                    Browse Network
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* Floating AI Chatbox Support Button */}
      <button
        onClick={() => alert('Employer Support Agent is under construction!')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_10px_25px_-5px_rgba(0,92,85,0.4)] flex items-center justify-center hover:bg-primary-container hover:scale-105 transition-all duration-300 z-50 group cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform duration-300">smart_toy</span>
        <span className="absolute top-0 right-0 w-3 h-3 bg-tertiary-fixed-dim rounded-full border-2 border-surface-container-lowest"></span>
      </button>

    </div>
  );
}
