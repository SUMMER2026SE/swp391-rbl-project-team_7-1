import React from 'react';

export default function RevisionRequested() {
  return (
    <main className="flex-grow pb-margin-desktop px-gutter max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50">
{/*  Left Column: Details & Feedback  */}
<div className="lg:col-span-8 flex flex-col gap-8">
{/*  Header Section  */}
<div>
<div className="flex items-center gap-2 mb-2">
<a className="text-slate-600 hover:text-[#0F766E] transition-colors flex items-center gap-1 text-sm font-medium" href="#">
<span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                        Back to Active Projects
                    </a>
</div>
<h1 className="font-display-hero text-display-hero md:font-display-hero text-display-hero text-slate-800 mb-2">E-Commerce Website Redesign</h1>
<p className="text-base text-slate-600">Client: Acme Corp • Milestone 2: Wireframes</p>
</div>
{/*  Status Banner  */}
<div className="bg-tertiary-fixed rounded-2xl p-6 border border-[#EAB308] flex items-start gap-4 shadow-sm">
<div className="text-[#CA8A04] mt-1">
<span className="material-symbols-outlined" data-icon="warning" data-weight="fill">warning</span>
</div>
<div>
<h2 className="text-lg font-bold text-slate-800 mb-1">Revision Requested</h2>
<p className="text-base text-slate-600">The client has reviewed your submission and requested some changes before approving this milestone.</p>
</div>
</div>
{/*  Feedback Section  */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
<h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
<span className="material-symbols-outlined text-slate-600" data-icon="comment">comment</span>
                        Client Feedback
                    </h3>
<span className="text-sm font-medium text-slate-600">Received: Today, 10:30 AM</span>
</div>
<div className="prose prose-sm max-w-none text-slate-800 text-base mb-8">
<p>Hi there, thanks for submitting the initial wireframes. They look great overall, but we have a few adjustments we'd like to see before moving to high-fidelity design.</p>
<ul className="list-disc pl-5 mt-4 space-y-2">
<li><strong>Homepage Hero:</strong> Can we try a version where the primary CTA is more prominent? Maybe move it above the secondary text.</li>
<li><strong>Product Grid:</strong> Please change the layout from 3 columns to 4 columns on desktop view.</li>
<li><strong>Footer:</strong> Add a placeholder for a newsletter signup form.</li>
</ul>
<p className="mt-4">Looking forward to seeing the revised version. Let me know if you need any clarification!</p>
</div>
<div className="bg-slate-50 border border-slate-200 rounded p-4 flex items-center gap-4 mb-6">
<span className="material-symbols-outlined text-slate-600" data-icon="attach_file">attach_file</span>
<div className="flex-grow">
<p className="text-sm font-medium font-semibold text-slate-800">acme_wireframes_v1_markup.pdf</p>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">2.4 MB</p>
</div>
<button className="text-[#0F766E] hover:text-[#0F766E]/80 transition-colors text-sm font-medium font-semibold">Download</button>
</div>
{/*  Action Area  */}
<div className="border-t border-slate-200 pt-6 mt-6">
<h4 className="text-base font-semibold text-slate-800 mb-4">Submit Revised Work</h4>
<div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 mb-6 hover:border-[#0F766E] transition-colors cursor-pointer">
<span className="material-symbols-outlined text-slate-600 text-4xl mb-2" data-icon="cloud_upload">cloud_upload</span>
<p className="text-base text-slate-800 font-semibold">Drag &amp; drop files here</p>
<p className="text-sm font-medium text-slate-600 mt-1">or click to browse from your computer</p>
</div>
<div className="flex flex-col gap-2 mb-6">
<label className="text-sm font-medium font-semibold text-slate-800" htmlFor="submission_notes">Submission Notes (Optional)</label>
<textarea className="w-full rounded border-slate-200 focus:border-[#0F766E] focus:ring-[#0F766E] text-sm font-medium p-3 text-slate-800" id="submission_notes" placeholder="Explain what changes you made..." rows="3"></textarea>
</div>
<div className="flex justify-end gap-4">
<button className="bg-white border border-slate-200 text-slate-800 px-6 py-2 rounded text-base font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
<button className="bg-[#0F766E] text-white px-6 py-2 rounded text-base font-semibold hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)]">Resubmit Work</button>
</div>
</div>
</div>
</div>
{/*  Right Column: Context & History  */}
<div className="lg:col-span-4 flex flex-col gap-8">
{/*  Project Details Card  */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Milestone Details</h3>
<div className="space-y-4">
<div>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Budget</p>
<p className="text-base text-[#0F766E] font-semibold">$1,200.00</p>
</div>
<div>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Original Deadline</p>
<p className="text-base text-slate-800">Oct 24, 2024</p>
</div>
<div>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Status</p>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mt-1 border border-slate-200">
                            Revision
                        </span>
</div>
</div>
</div>
{/*  Activity Log Card  */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Activity Log</h3>
<div className="relative border-l border-slate-200 ml-3 space-y-6 mt-4">
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#EAB308] border-2 border-white"></span>
<p className="text-sm font-medium font-semibold text-slate-800">Revision Requested</p>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Today, 10:30 AM</p>
</div>
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#E2E8F0] border-2 border-white"></span>
<p className="text-sm font-medium font-semibold text-slate-800">Work Submitted</p>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Yesterday, 4:15 PM</p>
<p className="text-sm font-medium text-slate-600 mt-1 text-xs">acme_wireframes_v1.pdf</p>
</div>
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#E2E8F0] border-2 border-white"></span>
<p className="text-sm font-medium font-semibold text-slate-800">Milestone Started</p>
<p className="text-xs font-bold uppercase tracking-wider text-slate-600">Oct 10, 2024</p>
</div>
</div>
</div>
</div>
</main>
  );
}
