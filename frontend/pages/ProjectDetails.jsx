import React from 'react';

export default function ProjectDetails() {
  const token = localStorage.getItem('token');

  return (
    <main className={`flex-1 p-margin-mobile md:p-margin-desktop w-full bg-[#F8FAFC] min-h-screen ${!token ? 'pt-28 md:pt-32' : ''}`}>
{/*  Breadcrumbs & Back  */}
<div className="mb-6 flex items-center justify-between w-full">
<a className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">
<span className="material-symbols-outlined text-sm">arrow_back</span> Back to Projects
                </a>
<div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-sm">share</span>
<span className="material-symbols-outlined text-sm">bookmark_border</span>
</div>
</div>
{/*  Bento Grid Layout for Project Details  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Main Brief Column (Left)  */}
<div className="lg:col-span-8 flex flex-col gap-gutter">
{/*  Header Card  */}
<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<div className="flex justify-between items-start mb-4">
<div>
<h1 className="font-display-hero-mobile md:font-headline-2xl text-headline-2xl mb-2 text-[#334155]">Enterprise Dashboard Redesign</h1>
<div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> Posted 2 hours ago</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">public</span> Remote</span>
</div>
</div>
<div className="bg-[#F1F5F9] text-[#475569] font-label-caps text-label-caps px-3 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-sm">verified_user</span> UI/UX Design
                            </div>
</div>
<div className="mt-6 flex flex-wrap gap-2">
<span className="bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm px-4 py-2 rounded-full border border-outline-variant">Figma</span>
<span className="bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm px-4 py-2 rounded-full border border-outline-variant">UI/UX</span>
<span className="bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm px-4 py-2 rounded-full border border-outline-variant">Dashboard Design</span>
</div>
</div>
{/*  Detailed Description Card  */}
<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h3 className="font-headline-xl text-headline-xl mb-4 text-[#334155]">Project Description</h3>
<div className="font-body-base text-body-base space-y-4 text-[#475569]">
<p>We are seeking an experienced UI/UX designer to completely overhaul our internal enterprise dashboard. The current system is outdated and our team needs a modern, highly efficient interface to manage daily operations, track analytics, and handle user permissions.</p>
<p><strong>Key Requirements:</strong></p>
<ul className="list-disc pl-5 space-y-2">
<li>Comprehensive audit of the existing dashboard.</li>
<li>Creation of wireframes and high-fidelity prototypes in Figma.</li>
<li>Design a scalable component library/design system.</li>
<li>Ensure accessibility (WCAG 2.1 AA) and responsive behavior for desktop and tablet.</li>
</ul>
<p><strong>Deliverables:</strong></p>
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
<div className="lg:col-span-4 flex flex-col gap-gutter">
{/*  Action Card  */}
<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<div className="mb-6">
<p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Budget Range</p>
<p className="font-headline-2xl text-headline-2xl font-bold text-[#334155]">$5,000 - $8,000</p>
</div>
<div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant">
<div className="flex-1">
<p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Deadline</p>
<p className="font-headline-xl text-headline-xl font-semibold text-[#334155]">4 Weeks</p>
</div>
<div className="flex-1">
<p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Proposal Stats</p>
<p className="font-body-base text-body-base font-semibold text-[#475569]">12 submitted</p>
</div>
</div>
<button className="w-full bg-gradient-to-r from-[#475569] to-[#526171] text-white font-headline-xl text-headline-xl py-4 rounded-lg transition-all duration-500 ease-out border-t border-white/20 border-x border-white/10 shadow-[0_4px_15px_rgba(71,85,105,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] hover:-translate-y-0.5 mb-4 flex justify-center items-center gap-2">Submit Proposal <span className="material-symbols-outlined">send</span></button>
<div className="flex items-center justify-center gap-2 font-body-sm text-body-sm bg-surface-container p-3 rounded-lg border border-[#e2e8f0] text-[#0F766E]">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
<strong>Secured by VNPay Escrow</strong>
</div>
</div>
{/*  Employer Info Card  */}
<div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h3 className="font-headline-xl text-headline-xl mb-4 text-[#334155]">About the Employer</h3>
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center font-bold text-xl border border-outline-variant text-[#0F766E]">
                                TN
                            </div>
<div>
<h4 className="font-body-base text-body-base font-semibold text-[#334155] text-[#475569]">TechNova Corp</h4>
<div className="flex items-center gap-1 font-body-sm text-body-sm text-[#0F766E]">
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span> Verified Employer
                                </div>
</div>
</div>
<div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant pt-4 mt-2">
<div className="flex justify-between">
<span>Location</span>
<span className="text-on-surface font-medium">United States</span>
</div>
<div className="flex justify-between">
<span>Projects Posted</span>
<span className="text-on-surface font-medium">45</span>
</div>
<div className="flex justify-between">
<span>Hire Rate</span>
<span className="text-on-surface font-medium">82%</span>
</div>
<div className="flex justify-between">
<span>Member Since</span>
<span className="text-on-surface font-medium">Oct 2021</span>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
