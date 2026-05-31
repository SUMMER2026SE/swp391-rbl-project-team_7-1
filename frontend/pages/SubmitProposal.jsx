import React from 'react';

export default function SubmitProposal() {
  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop overflow-y-auto">
<div className="max-w-container-max mx-auto">
{/*  Header  */}
<div className="mb-10">
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">Submit Proposal</h1>
<p className="text-base text-slate-600 max-w-2xl">
                        You are bidding on <strong className="text-on-surface text-slate-800">Senior UX/UI Designer for FinTech Dashboard</strong>. Take your time to write a compelling proposal.
                    </p>
</div>
<form className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
{/*  Left Form Canvas (8 cols)  */}
<div className="md:col-span-8 flex flex-col gap-8">
{/*  Terms & Basics Card  */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Terms &amp; Duration
                            </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Bid Amount (USD)</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">$</span>
<input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base" id="bid-input" placeholder="0.00" type="number"/>
</div>
<p className="text-sm font-medium text-[#0F766E] mt-2 text-right">Client Budget: $5k - $8k</p>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Estimated Duration</label>
<select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer">
<option disabled="" selected="" value="">Select duration...</option>
<option>Less than 1 month</option>
<option>1 to 3 months</option>
<option>3 to 6 months</option>
<option>More than 6 months</option>
</select>
</div>
</div>
</div>
{/*  Cover Letter Card  */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">description</span> Cover Letter
                            </h2>
<p className="text-sm font-medium text-slate-600 mb-6">Introduce yourself and explain why you're a strong candidate for this job.</p>
<textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base resize-y" placeholder="Dear Client, I recently completed a similar FinTech dashboard project..." rows="8"></textarea>
</div>
{/*  Milestones Bento Section  */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Terms &amp; Duration
                            </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Bid Amount (USD)</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">$</span>
<input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base" id="bid-input" placeholder="0.00" type="number"/>
</div>
<p className="text-sm font-medium text-[#0F766E] mt-2 text-right">Client Budget: $5k - $8k</p>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Estimated Duration</label>
<select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer">
<option disabled="" selected="" value="">Select duration...</option>
<option>Less than 1 month</option>
<option>1 to 3 months</option>
<option>3 to 6 months</option>
<option>More than 6 months</option>
</select>
</div>
</div>
</div>
{/*  Attachments & Portfolio  */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Terms &amp; Duration
                            </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Bid Amount (USD)</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">$</span>
<input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base" id="bid-input" placeholder="0.00" type="number"/>
</div>
<p className="text-sm font-medium text-[#0F766E] mt-2 text-right">Client Budget: $5k - $8k</p>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Estimated Duration</label>
<select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer">
<option disabled="" selected="" value="">Select duration...</option>
<option>Less than 1 month</option>
<option>1 to 3 months</option>
<option>3 to 6 months</option>
<option>More than 6 months</option>
</select>
</div>
</div>
</div>
</div>
{/*  Right Summary Sidebar (4 cols)  */}
<div className="md:col-span-4 relative">
<div className="sticky top-24">
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Terms &amp; Duration
                            </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Bid Amount (USD)</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">$</span>
<input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base" id="bid-input" placeholder="0.00" type="number"/>
</div>
<p className="text-sm font-medium text-[#0F766E] mt-2 text-right">Client Budget: $5k - $8k</p>
</div>
<div>
<label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 uppercase tracking-wider">Estimated Duration</label>
<select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer">
<option disabled="" selected="" value="">Select duration...</option>
<option>Less than 1 month</option>
<option>1 to 3 months</option>
<option>3 to 6 months</option>
<option>More than 6 months</option>
</select>
</div>
</div>
</div>
</div>
</div>
</form>
</div>
</main>
  );
}
