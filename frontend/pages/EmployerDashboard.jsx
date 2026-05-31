import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-[#F8FAFC]">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-md lg:p-xl scroll-smooth">
          <div className="max-w-container-max mx-auto space-y-xl pb-24">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-headline-xl text-headline-xl text-slate-800 font-bold tracking-tight">Overview</h2>
                <p className="font-body-md text-body-md text-slate-500 mt-1">Track your projects, proposals, and team activity.</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => alert('Exporting report (CSV/Excel)...')}
                  className="bg-white border border-slate-200 text-slate-600 hover:text-[#0F766E] hover:border-[#0F766E] font-label-md text-label-md px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Report
                </button>
                <Link
                  to="/projects"
                  className="bg-[#0F766E] text-white hover:bg-[#0D5E58] font-label-md text-label-md px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(15,118,110,0.2)] hover:shadow-[0_6px_16px_rgba(15,118,110,0.3)] hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Post New Project
                </Link>
              </div>
            </div>

            {/* Stats Grid (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              
              {/* Stat 1 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-emerald-600 flex items-center bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
                    <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> 12%
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-slate-500 font-medium">Posted Projects</p>
                  <h3 className="font-headline-lg text-headline-lg text-slate-800 mt-1 font-bold">24</h3>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-slate-600 flex items-center bg-slate-100 px-2.5 py-1 rounded-md font-semibold">
                    New 3
                  </span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-slate-500 font-medium">Pending Proposals</p>
                  <h3 className="font-headline-lg text-headline-lg text-slate-800 mt-1 font-bold">18</h3>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined">handshake</span>
                  </div>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-slate-500 font-medium">Active Contracts</p>
                  <h3 className="font-headline-lg text-headline-lg text-slate-800 mt-1 font-bold">7</h3>
                </div>
              </div>

              {/* Stat 4 (Escrow) */}
              <div className="bg-gradient-to-br from-[#0F766E] to-[#042F2E] border border-teal-800 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between lg:col-span-1 border-b-4 border-b-teal-400 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,118,110,0.3)] group shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[14px] text-teal-300" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-sm text-label-sm text-teal-50 font-semibold">VNPay Secure</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="font-label-md text-label-md text-teal-200 font-medium">Escrow Balance</p>
                  <h3 className="font-headline-lg text-headline-lg text-white mt-1 font-bold">300M đ</h3>
                </div>
              </div>

              {/* Stat 5 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700 transition-colors duration-300">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-slate-500 font-medium">Completed</p>
                  <h3 className="font-headline-lg text-headline-lg text-slate-800 mt-1 font-bold">156</h3>
                </div>
              </div>

            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              
              {/* Left Column (Wider) */}
              <div className="lg:col-span-2 space-y-lg">
                
                {/* Pending Submissions */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                  <div className="absolute right-0 top-0 w-40 h-40 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>priority_high</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight">Action Required: Milestone Approvals</h3>
                      <p className="font-body-sm text-body-sm text-slate-600 mt-1 mb-5">
                        You have 2 pending submissions from freelancers waiting for your review. Approving releases funds from Escrow.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-3.5 px-4 border border-amber-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-[22px]">inventory_2</span>
                            <span className="font-label-md text-label-md text-slate-700 font-semibold">E-commerce UI Design - Phase 1</span>
                          </div>
                          <button onClick={() => alert('Reviewing E-commerce UI Design')} className="text-amber-600 font-label-md text-label-md font-bold hover:text-amber-700 cursor-pointer flex items-center gap-1">
                            Review Work <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </button>
                        </div>
                        <div className="bg-white rounded-xl p-3.5 px-4 border border-amber-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-[22px]">code</span>
                            <span className="font-label-md text-label-md text-slate-700 font-semibold">API Integration Script</span>
                          </div>
                          <button onClick={() => alert('Reviewing API Script')} className="text-amber-600 font-label-md text-label-md font-bold hover:text-amber-700 cursor-pointer flex items-center gap-1">
                            Review Work <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Projects Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight">Recent Projects</h3>
                    <Link className="text-[#0F766E] font-label-md text-label-md font-bold hover:text-[#0D5E58] flex items-center cursor-pointer transition-colors" to="/projects">
                      View All <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                    </Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-sm text-label-sm uppercase tracking-wider">
                          <th className="p-4 px-6 font-semibold">Project Name</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Freelancer</th>
                          <th className="p-4 px-6 font-semibold text-right">Spent</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm text-slate-700">
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="p-4 px-6 font-semibold group-hover:text-[#0F766E] transition-colors">CRM Dashboard Migration</td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 border border-emerald-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> In Progress
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            <img alt="Freelancer" className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjBlZNIzWxT6IcbVh2b6hE--DsefCpGZXj6GQlVFZC-bO5BtcfGFzdbRRKUIt49FzvNvkUQaSOLvDGH81jggwpy80aEZlq6wqZxtTvuc8K2thln1MKqda6CirVCTvDddBupnFyZPJKxW8kPX5KLQ9uLaEvb7fO6kROgqDP9DRh-380EBT0EFJwtHkirke6uVHLtskftOE64pNNHjTgKPb7uqRx_XhII3aHHvoVsjIwPlffQltfWvzQnQx4IBOtt0lfNKZZrAJ2x36z" />
                            <span className="font-medium">Sarah J.</span>
                          </td>
                          <td className="p-4 px-6 text-right font-bold text-slate-800">80.000.000 đ</td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="p-4 px-6 font-semibold group-hover:text-[#0F766E] transition-colors">Mobile App Concept Design</td>
                          <td className="p-4">
                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 border border-amber-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Review
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            <img alt="Freelancer" className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr-lEyw_grSf6UEk4B8rJif4KoisfbufyZv0Wd7INAyVSqzWQMNQZIh5HlIilOrH4Gm2a2V_nE8IW2QGYwMWeHVTs0vxuWhb6l75TuDE_fpwiLxuoEQ22nRbGGM7ZBp-6K8XyzGoLbYCpEasKIUk4BfLcB9lJ-MqZbLjOFNPXk0dEdGdEIrEYObFNIVdm9OCGinxY3Ohd5Ek7jc1UT8Mb7K0vHjj3vwHTXHey1gD9DkagBdPv2BjUcROnelJDhYohCthlXuqGSmRof" />
                            <span className="font-medium">Marcus T.</span>
                          </td>
                          <td className="p-4 px-6 text-right font-bold text-slate-800">37.500.000 đ</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
                          <td className="p-4 px-6 font-semibold group-hover:text-[#0F766E] transition-colors">SEO Optimization 2024</td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 border border-slate-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Sourcing
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 italic">3 Proposals</td>
                          <td className="p-4 px-6 text-right font-bold text-slate-400">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (Sidebar) */}
              <div className="space-y-lg">
                {/* Freelancer Suggestions */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-amber-500 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <h3 className="font-headline-sm text-headline-sm text-slate-800 font-bold tracking-tight">Top Talent for You</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-slate-500 mb-6">Based on your recent 'React Native' searches.</p>
                  
                  <div className="space-y-4 flex-1">
                    {/* Talent Card 1 */}
                    <div className="group flex gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className="relative shrink-0">
                        <img alt="Talent" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkgmoFOT-W3CVER-UmrnvEBpdFyj7t7LYMy9ANhG2hNi0ZfgUJl6EKPKSHCHAchhJ9FwkdMrhmGqOZkywmarGXGS0aOrpexZHyD0qAKd-7RGRpgcQdw2xQwjIn_fDRI09Usb50Wwl2V_NyBLujCK_lgs7_afKq2MbLFYqra0e-sLBJrRZXhO2odKdcRdFHMUFoDwzYT_uSnX3xCS-AfCy1WnrfsMboeEuCUuicBCSx6wHyVfFKG40uuMAdb3A-2VPf8lJYTcE23FA-" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-label-md text-label-md text-slate-800 font-bold truncate group-hover:text-[#0F766E] transition-colors">Elena Rodriguez</h4>
                          <span className="flex items-center text-amber-500 font-label-sm text-label-sm font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            <span className="material-symbols-outlined text-[14px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-500 truncate mt-0.5">Senior React Native Dev</p>
                        <div className="flex gap-2 mt-2">
                          <span className="bg-[#0F766E]/10 text-[#0F766E] text-[10px] font-bold px-2 py-0.5 rounded border border-[#0F766E]/20">PRO</span>
                          <span className="text-slate-400 text-xs font-medium">850.000 đ/giờ</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Talent Card 2 */}
                    <div className="group flex gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className="relative shrink-0">
                        <img alt="Talent" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7d5Jgziido1vt-U-JTa9dpm9FWbgGXbg9rRygv4JiqXWYLURHlGmpuOysCvBC5s2i4hD9kN0V77uiIlq-wsc0O23H7t65eOpJzPhEPIyoyraxPaAc7bZd13y8PpDyXMn_jZ4F7dOm9AGRMmZEWI0vB9YK9tnIPTXQy-rox6QhmmRdJm8R59t7YOveljWxbceibkyYQRlqHCGUvlwTwJktk6YeAfSOwvpjfNOwuTP7Ka6gywCHsD4liWLoI25RRelfU8ybo6jDqDRO" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-slate-300 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h4 className="font-label-md text-label-md text-slate-800 font-bold truncate group-hover:text-[#0F766E] transition-colors">David Kim</h4>
                          <span className="flex items-center text-amber-500 font-label-sm text-label-sm font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            <span className="material-symbols-outlined text-[14px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 5.0
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-slate-500 truncate mt-0.5">Full Stack Engineer</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-slate-400 text-xs font-medium">950.000 đ/giờ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link to="/freelancers" className="w-full mt-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-label-md text-label-md font-bold text-slate-600 hover:bg-slate-100 hover:text-[#0F766E] hover:border-[#0F766E]/30 transition-all text-center inline-block cursor-pointer">
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
