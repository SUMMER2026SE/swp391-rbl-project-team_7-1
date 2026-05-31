import React from 'react';

export default function SubmitWork() {
  return (
    <main className="flex-grow pt-24 pb-margin-desktop px-gutter w-full max-w-container-max mx-auto md:px-margin-desktop">
{/*  Context Header  */}
<div className="mb-8">
<a className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-[#0F766E] mb-4 transition-all" href="#">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Active Projects
            </a>
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">
                Enterprise Dashboard Redesign
            </h1>
<p className="text-base text-slate-600">
                Submit your final deliverables for Phase 2: High-Fidelity Mockups.
            </p>
</div>
<div className="grid grid-cols-12 gap-8">
{/*  Left Column: Form Canvas (Takes up 8 cols on desktop)  */}
<div className="col-span-12 lg:col-span-8 space-y-6">
{/*  Submission Card  */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
<div className="p-6 md:p-8">
{/*  File Upload Area  */}
<div className="mb-8">
<h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">cloud_upload</span>
                                Deliverables
                            </h2>
<div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-10 flex flex-col items-center justify-center text-center group hover:border-[#0F766E] transition-colors cursor-pointer relative overflow-hidden">
<input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple="" type="file"/>
<div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-[#0F766E] transition-colors">folder_open</span>
</div>
<p className="text-base text-slate-800 font-semibold mb-1">Click to upload or drag and drop</p>
<p className="text-sm font-medium text-slate-600">PDF, ZIP, PNG, or JPG (Max. 500MB)</p>
</div>
</div>
{/*  External Links  */}
<div className="mb-8">
<label className="block text-base text-slate-800 font-semibold mb-2">External Links (Optional)</label>
<div className="flex flex-col gap-3">
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-slate-600 text-[20px]">link</span>
</div>
<input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-base text-slate-800 focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] transition-all" placeholder="Figma, GitHub, or Drive link..." type="url"/>
</div>
<button className="self-start inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0F766E] hover:opacity-80 transition-colors">
<span className="material-symbols-outlined text-[16px]">add</span> Add another link
                                </button>
</div>
</div>
{/*  Submission Notes  */}
<div className="mb-8">
<label className="block text-base text-slate-800 font-semibold mb-2">Submission Notes</label>
<p className="text-sm font-medium text-slate-600 mb-3">Provide context, describe what was completed, or note any edge cases the client should review.</p>
<textarea className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-base text-slate-800 focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] transition-all resize-none" placeholder="e.g., 'Attached are the final 15 screens for the analytics dashboard. I have also included the updated design system library link...'" rows="5"></textarea>
</div>
{/*  Divider  */}
<hr className="border-t border-slate-200 my-6"/>
{/*  Footer Actions & Disclaimer  */}
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
<div className="flex items-start gap-2 text-slate-600 bg-slate-100 p-3 rounded-2xl md:max-w-md">
<span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">info</span>
<p className="text-sm font-medium">
                                    Submitting this work will notify the employer for review. Once approved, the milestone payment will be released.
                                </p>
</div>
<button className="w-full md:w-auto px-8 py-3 bg-[#0F766E] text-white text-lg font-bold rounded-2xl hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2">
                                Submit Work
                                <span className="material-symbols-outlined">send</span>
</button>
</div>
</div>
</div>
</div>
{/*  Right Column: Context/Milestone Tracker  */}
<div className="col-span-12 lg:col-span-4 space-y-6 hidden md:block">
{/*  Milestone Tracker Card  */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6 sticky top-24 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
<h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">Project Progress</h3>
<div className="relative">
{/*  Connecting Line  */}
<div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#E2E8F0]"></div>
{/*  Step 1: Completed  */}
<div className="flex gap-4 mb-6 relative">
<div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 z-10 text-[#0F766E] shadow-sm">
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
<div className="pt-1">
<h4 className="text-base text-slate-600 font-semibold line-through opacity-70">Phase 1: Wireframes</h4>
<p className="text-sm font-medium text-[#0F766E]">Approved • $1,500</p>
</div>
</div>
{/*  Step 2: Current  */}
<div className="flex gap-4 mb-6 relative">
<div className="w-8 h-8 rounded-full bg-[#0F766E] ring-4 ring-[#F8FAFC] flex items-center justify-center shrink-0 z-10 text-white shadow-md">
<span className="material-symbols-outlined text-[16px]">edit</span>
</div>
<div className="pt-1">
<h4 className="text-base text-slate-800 font-bold">Phase 2: High-Fidelity</h4>
<p className="text-sm font-medium text-[#0F766E]">In Progress • $2,000</p>
</div>
</div>
{/*  Step 3: Upcoming  */}
<div className="flex gap-4 relative">
<div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0 z-10 text-slate-600">
<span className="material-symbols-outlined text-[16px]">lock</span>
</div>
<div className="pt-1">
<h4 className="text-base text-slate-600 font-semibold">Phase 3: Prototyping</h4>
<p className="text-sm font-medium text-slate-600">Pending • $1,000</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
