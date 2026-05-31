import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectDetails() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  return (
    <main className={`flex-1 px-6 md:px-12 w-full bg-slate-50 min-h-screen ${!token ? 'pt-28 md:pt-32' : 'pt-8'}`}>
      <div className="max-w-[1440px] mx-auto">
        {/*  Breadcrumbs & Back  */}
        <div className="mb-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/browse-projects')} className="flex items-center gap-2 text-slate-500 hover:text-teal-700 transition-colors text-sm font-semibold cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to Projects
          </button>
          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-teal-600 transition-colors p-1"><span className="material-symbols-outlined text-[20px]">share</span></button>
            <button className="hover:text-teal-600 transition-colors p-1"><span className="material-symbols-outlined text-[20px]">bookmark_border</span></button>
          </div>
        </div>

        {/*  Bento Grid Layout for Project Details  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          
          {/*  Main Brief Column (Left)  */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/*  Header Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-teal-950 tracking-tight">Enterprise Dashboard Redesign</h1>
                  <div className="flex items-center gap-5 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> Posted 2 hours ago</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">public</span> Remote</span>
                  </div>
                </div>
                <div className="bg-teal-50 text-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold border border-teal-100/50">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span> UI/UX Design
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">Figma</span>
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">UI/UX</span>
                <span className="bg-slate-50 text-slate-600 text-xs px-4 py-1.5 rounded-lg border border-slate-200 font-semibold shadow-sm">Dashboard Design</span>
              </div>
            </div>

            {/*  Detailed Description Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 text-teal-950">Project Description</h3>
              <div className="text-base space-y-5 text-slate-600 leading-relaxed">
                <p>We are seeking an experienced UI/UX designer to completely overhaul our internal enterprise dashboard. The current system is outdated and our team needs a modern, highly efficient interface to manage daily operations, track analytics, and handle user permissions.</p>
                <p><strong className="text-teal-900">Key Requirements:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Comprehensive audit of the existing dashboard.</li>
                  <li>Creation of wireframes and high-fidelity prototypes in Figma.</li>
                  <li>Design a scalable component library/design system.</li>
                  <li>Ensure accessibility (WCAG 2.1 AA) and responsive behavior for desktop and tablet.</li>
                </ul>
                <p><strong className="text-teal-900">Deliverables:</strong></p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Figma file with organized components and variants.</li>
                  <li>Clickable prototype demonstrating key user flows.</li>
                  <li>Developer handoff documentation.</li>
                </ul>
                <p>We are looking for someone with a strong portfolio demonstrating complex data visualization and clean, modern corporate aesthetics. Please include relevant case studies in your proposal.</p>
              </div>
            </div>
          </div>

          {/*  Sidebar / Action Column (Right)  */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/*  Action Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-8">
                <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-2">Budget Range</p>
                <p className="text-3xl font-extrabold text-teal-950">$5,000 - $8,000</p>
              </div>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Deadline</p>
                  <p className="text-xl font-bold text-slate-800">4 Weeks</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Proposals</p>
                  <p className="text-xl font-bold text-slate-800">12</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(token ? '/submit-proposal' : '/login')}
                className="w-full bg-[#0F766E] text-white font-bold text-base py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#0D5E58] active:scale-[0.98] mb-5 flex justify-center items-center gap-2 border-none"
              >
                Submit Proposal <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-sm bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-emerald-700">
                <span className="material-symbols-outlined text-[20px]" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
                <strong className="font-semibold">Secured by VNPay Escrow</strong>
              </div>
            </div>

            {/*  Employer Info Card  */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-bold mb-6 text-teal-950">About the Employer</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center font-bold text-xl border border-teal-100 text-teal-700 shadow-sm">
                  TN
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">TechNova Corp</h4>
                  <div className="flex items-center gap-1 text-sm text-teal-600 font-medium mt-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span> Verified Employer
                  </div>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-500 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Location</span>
                  <span className="text-slate-800 font-bold">United States</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Projects Posted</span>
                  <span className="text-slate-800 font-bold">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Hire Rate</span>
                  <span className="text-slate-800 font-bold">82%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Member Since</span>
                  <span className="text-slate-800 font-bold">Oct 2021</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
