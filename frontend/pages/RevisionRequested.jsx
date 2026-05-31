import React from 'react';

export default function RevisionRequested() {
  return (
    <main className="flex-grow pb-margin-desktop px-gutter max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F8FAFC]">
{/*  Left Column: Details & Feedback  */}
<div className="lg:col-span-8 flex flex-col gap-8">
{/*  Header Section  */}
<div>
<div className="flex items-center gap-2 mb-2">
<a className="text-[#475569] hover:text-[#0F766E] transition-colors flex items-center gap-1 font-body-sm text-body-sm" href="#">
<span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                        Back to Active Projects
                    </a>
</div>
<h1 className="font-display-hero text-display-hero md:font-display-hero text-display-hero text-[#334155] mb-2">E-Commerce Website Redesign</h1>
<p className="font-body-base text-body-base text-[#475569]">Client: Acme Corp • Milestone 2: Wireframes</p>
</div>
{/*  Status Banner  */}
<div className="bg-tertiary-fixed rounded-lg p-6 border border-[#EAB308] flex items-start gap-4 shadow-sm">
<div className="text-[#CA8A04] mt-1">
<span className="material-symbols-outlined" data-icon="warning" data-weight="fill">warning</span>
</div>
<div>
<h2 className="font-headline-xl text-headline-xl text-[#334155] mb-1">Revision Requested</h2>
<p className="font-body-base text-body-base text-[#475569]">The client has reviewed your submission and requested some changes before approving this milestone.</p>
</div>
</div>
{/*  Feedback Section  */}
<div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<div className="flex items-center justify-between mb-6 border-b border-[#E2E8F0] pb-4">
<h3 className="font-headline-xl text-headline-xl text-[#334155] flex items-center gap-2">
<span className="material-symbols-outlined text-[#475569]" data-icon="comment">comment</span>
                        Client Feedback
                    </h3>
<span className="font-body-sm text-body-sm text-[#475569]">Received: Today, 10:30 AM</span>
</div>
<div className="prose prose-sm max-w-none text-[#334155] font-body-base text-body-base mb-8">
<p>Hi there, thanks for submitting the initial wireframes. They look great overall, but we have a few adjustments we'd like to see before moving to high-fidelity design.</p>
<ul className="list-disc pl-5 mt-4 space-y-2">
<li><strong>Homepage Hero:</strong> Can we try a version where the primary CTA is more prominent? Maybe move it above the secondary text.</li>
<li><strong>Product Grid:</strong> Please change the layout from 3 columns to 4 columns on desktop view.</li>
<li><strong>Footer:</strong> Add a placeholder for a newsletter signup form.</li>
</ul>
<p className="mt-4">Looking forward to seeing the revised version. Let me know if you need any clarification!</p>
</div>
<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-4 flex items-center gap-4 mb-6">
<span className="material-symbols-outlined text-[#475569]" data-icon="attach_file">attach_file</span>
<div className="flex-grow">
<p className="font-body-sm text-body-sm font-semibold text-[#334155]">acme_wireframes_v1_markup.pdf</p>
<p className="font-label-caps text-label-caps text-[#475569]">2.4 MB</p>
</div>
<button className="text-[#0F766E] hover:text-[#0F766E]/80 transition-colors font-body-sm text-body-sm font-semibold">Download</button>
</div>
{/*  Action Area  */}
<div className="border-t border-[#E2E8F0] pt-6 mt-6">
<h4 className="font-body-base text-body-base font-semibold text-[#334155] mb-4">Submit Revised Work</h4>
<div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 flex flex-col items-center justify-center bg-[#F8FAFC] mb-6 hover:border-[#0F766E] transition-colors cursor-pointer">
<span className="material-symbols-outlined text-[#475569] text-4xl mb-2" data-icon="cloud_upload">cloud_upload</span>
<p className="font-body-base text-body-base text-[#334155] font-semibold">Drag &amp; drop files here</p>
<p className="font-body-sm text-body-sm text-[#475569] mt-1">or click to browse from your computer</p>
</div>
<div className="flex flex-col gap-2 mb-6">
<label className="font-body-sm text-body-sm font-semibold text-[#334155]" htmlFor="submission_notes">Submission Notes (Optional)</label>
<textarea className="w-full rounded border-[#E2E8F0] focus:border-[#0F766E] focus:ring-[#0F766E] font-body-sm text-body-sm p-3 text-[#334155]" id="submission_notes" placeholder="Explain what changes you made..." rows="3"></textarea>
</div>
<div className="flex justify-end gap-4">
<button className="bg-white border border-[#E2E8F0] text-[#334155] px-6 py-2 rounded font-body-base text-body-base font-semibold hover:bg-[#F8FAFC] transition-colors">Cancel</button>
<button className="bg-gradient-to-r from-[#475569] to-[#526171] text-white px-6 py-2 rounded font-body-base text-body-base font-semibold hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)]">Resubmit Work</button>
</div>
</div>
</div>
</div>
{/*  Right Column: Context & History  */}
<div className="lg:col-span-4 flex flex-col gap-8">
{/*  Project Details Card  */}
<div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<h3 className="font-headline-xl text-headline-xl text-[#334155] mb-4 border-b border-[#E2E8F0] pb-2">Milestone Details</h3>
<div className="space-y-4">
<div>
<p className="font-label-caps text-label-caps text-[#475569]">Budget</p>
<p className="font-body-base text-body-base text-[#0F766E] font-semibold">$1,200.00</p>
</div>
<div>
<p className="font-label-caps text-label-caps text-[#475569]">Original Deadline</p>
<p className="font-body-base text-body-base text-[#334155]">Oct 24, 2024</p>
</div>
<div>
<p className="font-label-caps text-label-caps text-[#475569]">Status</p>
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569] mt-1 border border-[#E2E8F0]">
                            Revision
                        </span>
</div>
</div>
</div>
{/*  Activity Log Card  */}
<div className="bg-white rounded-lg border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 p-6">
<h3 className="font-headline-xl text-headline-xl text-[#334155] mb-4 border-b border-[#E2E8F0] pb-2">Activity Log</h3>
<div className="relative border-l border-[#E2E8F0] ml-3 space-y-6 mt-4">
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#EAB308] border-2 border-white"></span>
<p className="font-body-sm text-body-sm font-semibold text-[#334155]">Revision Requested</p>
<p className="font-label-caps text-label-caps text-[#475569]">Today, 10:30 AM</p>
</div>
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#E2E8F0] border-2 border-white"></span>
<p className="font-body-sm text-body-sm font-semibold text-[#334155]">Work Submitted</p>
<p className="font-label-caps text-label-caps text-[#475569]">Yesterday, 4:15 PM</p>
<p className="font-body-sm text-body-sm text-[#475569] mt-1 text-xs">acme_wireframes_v1.pdf</p>
</div>
<div className="relative pl-6">
<span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#E2E8F0] border-2 border-white"></span>
<p className="font-body-sm text-body-sm font-semibold text-[#334155]">Milestone Started</p>
<p className="font-label-caps text-label-caps text-[#475569]">Oct 10, 2024</p>
</div>
</div>
</div>
</div>
</main>
  );
}
