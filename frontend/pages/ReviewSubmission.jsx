import React from 'react';

export default function ReviewSubmission() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
{/*  Breadcrumbs & Header  */}
<div className="mb-8">
<div className="flex items-center gap-2 font-body-sm text-body-sm text-[#475569] mb-4">
<a className="hover:text-[#0F766E] transition-colors" href="#">Dashboard</a>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
<a className="hover:text-[#0F766E] transition-colors" href="#">Active Projects</a>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
<span className="text-[#334155] font-semibold">Review Submission</span>
</div>
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-[#334155]">Milestone 2: Final Brand Identity Assets</h1>
<p className="font-body-base text-body-base text-[#475569] mt-2">Project: Acme Corp Global Rebranding</p>
</div>
{/*  Asymmetric Layout Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Left Column: Content Canvas (col-span-8)  */}
<div className="lg:col-span-8 flex flex-col gap-8">
{/*  Submission Notes  */}
<section className="bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md">
<div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
<span className="material-symbols-outlined text-[#0F766E] bg-[#F1F5F9] p-2 rounded-lg">description</span>
<h2 className="font-headline-xl text-headline-xl text-[#334155]">Freelancer Notes</h2>
</div>
<div className="font-body-base text-body-base text-[#475569] space-y-4">
<p>Hi team, please find attached the final finalized brand identity assets for Milestone 2. I have incorporated all the feedback from last week's review regarding the secondary color palette and typography hierarchy.</p>
<p>Key updates in this delivery:</p>
<ul className="list-disc pl-5 space-y-2">
<li>Refined logo marks (primary, secondary, monochrome) exported in vector and raster formats.</li>
<li>Updated Brand Guidelines PDF (V2) with the new structural grid examples.</li>
<li>Social media templates structured in Figma for easy export.</li>
</ul>
<p>Let me know if you need any minor adjustments before we close this milestone out. Thanks!</p>
</div>
</section>
{/*  Deliverables Bento Grid  */}
<section className="bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<div className="flex items-center justify-between mb-6 border-b border-[#E2E8F0] pb-4">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#0F766E] bg-[#F1F5F9] p-2 rounded-lg">folder_zip</span>
<h2 className="font-headline-xl text-headline-xl text-[#334155]">Deliverables</h2>
</div>
<button className="font-label-caps text-label-caps text-[#0F766E] hover:text-[#0F766E]/80 transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">download</span> Download All
                        </button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/*  Bento Item 1  */}
<div className="group relative overflow-hidden rounded-lg border border-[#E2E8F0] bg-white p-4 flex flex-col justify-between h-40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer">
<div className="flex justify-between items-start">
<div className="bg-[#F1F5F9] p-3 rounded-DEFAULT text-[#475569]">
<span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
</div>
<span className="font-label-caps text-label-caps text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-full">12.4 MB</span>
</div>
<div>
<h3 className="font-body-base text-body-base font-semibold text-[#334155] truncate group-hover:text-[#0F766E] transition-colors">Brand_Guidelines_V2.pdf</h3>
<p className="font-body-sm text-body-sm text-[#475569]">Uploaded 2 hours ago</p>
</div>
</div>
{/*  Bento Item 2  */}
<div className="group relative overflow-hidden rounded-lg border border-[#E2E8F0] bg-white p-4 flex flex-col justify-between h-40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer">
<div className="flex justify-between items-start">
<div className="bg-[#F1F5F9] p-3 rounded-DEFAULT text-[#475569]">
<span className="material-symbols-outlined text-3xl">draw</span>
</div>
<span className="font-label-caps text-label-caps text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-full">Figma Link</span>
</div>
<div>
<h3 className="font-body-base text-body-base font-semibold text-[#334155] truncate group-hover:text-[#0F766E] transition-colors">Social_Templates.fig</h3>
<p className="font-body-sm text-body-sm text-[#475569]">External URL</p>
</div>
</div>
{/*  Bento Item 3 (Spans 2 cols)  */}
<div className="group relative overflow-hidden rounded-lg border border-[#E2E8F0] bg-white p-4 flex items-center justify-between col-span-1 md:col-span-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer">
<div className="flex items-center gap-4">
<div className="bg-[#F1F5F9] p-3 rounded-DEFAULT text-[#475569]">
<span className="material-symbols-outlined text-3xl">folder</span>
</div>
<div>
<h3 className="font-body-base text-body-base font-semibold text-[#334155] group-hover:text-[#0F766E] transition-colors">Logo_Marks_Final_Export.zip</h3>
<p className="font-body-sm text-body-sm text-[#475569]">Contains AI, EPS, SVG, PNG formats • 45.2 MB</p>
</div>
</div>
<span className="material-symbols-outlined text-[#475569] group-hover:text-[#0F766E] transition-colors">download</span>
</div>
</div>
</section>
</div>
{/*  Right Column: Action & Context (col-span-4)  */}
<div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
{/*  Freelancer Profile Summary  */}
<div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<h3 className="font-label-caps text-label-caps text-[#475569] mb-4 uppercase tracking-wider">Submitted By</h3>
<div className="flex items-center gap-4 mb-4">
<img alt="Freelancer profile avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#E2E8F0]" data-alt="A high-quality professional portrait of a young female graphic designer with glasses, smiling confidently. She is in a bright, modern minimalist studio space with white walls and subtle indoor plants. The lighting is natural and even, reflecting a premium, creative professional aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi_R5ZVpIFJHk4yOHnLXHgfEQOOzHrKqOlIFZymm_nuhPF66c47fPPpC0ZxPYOKWZhapNSSUvl2LrtDFqXOdkU2fpwdSRXExpbtGqCTUj4IvE1I35AjfGPmsZE6zbm9GJxafmJWlsEBrzLSZjkoYf-Ptf2rmxuI_tStJJk6B3UpImojJlOz4zpp9uWx65kiSPV5VV7m_YZjUOVLdOeDL6OLr42VCYuMEi0n86sz3uHsA4bJ3W3a0K7eIyy6G9_4rwkwOdrSQlgnQQ"/>
<div>
<h4 className="font-headline-xl text-headline-xl text-[#334155]">Elena Rodriguez</h4>
<p className="font-body-sm text-body-sm text-[#475569]">Senior Brand Identity Designer</p>
</div>
</div>
<div className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-2 rounded-lg inline-flex">
<span className="material-symbols-outlined text-[#F59E0B] text-[18px]" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="font-label-caps text-label-caps text-[#334155]">4.9</span>
<span className="font-body-sm text-body-sm text-[#475569] ml-1">(124 Reviews)</span>
</div>
</div>
{/*  Action Panel  */}
<div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] relative overflow-hidden">
{/*  Subtle top decorative line  */}
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#475569] to-[#526171]"></div>
<h3 className="font-headline-xl text-headline-xl text-[#334155] mb-2">Review Decision</h3>
<p className="font-body-sm text-body-sm text-[#475569] mb-6">Please review the deliverables carefully. Approving this milestone releases funds to the freelancer.</p>
<div className="space-y-4">
<button className="w-full bg-white text-[#334155] font-label-caps text-label-caps px-4 py-4 rounded-DEFAULT border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors shadow-sm flex justify-center items-center gap-2 group">
<span className="material-symbols-outlined text-[#475569] group-hover:text-[#334155]">edit_note</span>
                            Request Revision
                        </button>
<button className="w-full bg-gradient-to-r from-[#475569] to-[#526171] text-white font-label-caps text-label-caps px-4 py-4 rounded-DEFAULT hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] shadow-sm flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-white">check_circle</span>
                            Confirm Completion
                        </button>
</div>
{/*  Security Badge  */}
<div className="mt-6 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-4 flex items-start gap-3">
<span className="material-symbols-outlined text-[#0F766E] mt-0.5">lock</span>
<div className="font-body-sm text-body-sm">
<strong className="text-[#334155] block mb-1">VNPay Escrow Protected</strong>
<span className="text-[#475569]">Confirming completion will release <span className="text-[#0F766E] font-semibold">$1,250.00 USD</span> from escrow directly to the freelancer.</span>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
