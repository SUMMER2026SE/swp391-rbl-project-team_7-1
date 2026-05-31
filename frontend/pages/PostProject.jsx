import React from 'react';

export default function PostProject() {
  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-72px)]">
<div className="max-w-4xl mx-auto">
<div className="mb-8">
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">Post a New Project</h1>
<p className="text-base text-slate-600">Fill out the details below to find the perfect freelancer for your project.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Form Area  */}
<div className="lg:col-span-2 space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
{/*  Project Title  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800" htmlFor="title">Project Title</label>
<input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50" id="title" placeholder="e.g., E-commerce Mobile App Development" type="text"/>
</div>
{/*  Category  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800" htmlFor="category">Category</label>
<div className="relative">
<select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all appearance-none text-base text-slate-800" id="category">
<option disabled="" selected="" value="">Select a category</option>
<option value="web">Web Development</option>
<option value="mobile">Mobile Development</option>
<option value="design">UI/UX Design</option>
<option value="writing">Content Writing</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">expand_more</span>
</div>
</div>
{/*  Description  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800" htmlFor="description">Project Description</label>
<textarea className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 resize-y" id="description" placeholder="Describe your project in detail..." rows="6"></textarea>
</div>
{/*  Required Skills  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800" htmlFor="skills">Required Skills</label>
<input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800 placeholder:text-slate-600/50 mb-2" id="skills" placeholder="Type a skill and press Enter (e.g., React Native)" type="text"/>
<div className="flex flex-wrap gap-2 mt-2">
<span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200">React Native <button className="text-slate-600 hover:text-[#0F766E] transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button></span>
<span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full border border-slate-200">Node.js <button className="text-slate-600 hover:text-[#0F766E] transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button></span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/*  Budget Type & Amount  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800">Budget</label>
<div className="flex gap-2 mb-2">
<label className="flex-1 flex items-center justify-center px-4 py-2 border border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] rounded-2xl cursor-pointer font-body-sm transition-colors">
<input checked="" className="sr-only" name="budget_type" type="radio" value="fixed"/>
                                        Fixed Price
                                    </label>
<label className="flex-1 flex items-center justify-center px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl cursor-pointer font-body-sm transition-colors">
<input className="sr-only" name="budget_type" type="radio" value="hourly"/>
                                        Hourly
                                    </label>
</div>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E] font-body-base">$</span>
<input className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-[#0F766E]" placeholder="Amount or Range" type="text"/>
</div>
</div>
{/*  Deadline  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800" htmlFor="deadline">Deadline</label>
<div className="relative">
<input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-base text-slate-800" id="deadline" type="date"/>
</div>
</div>
</div>
{/*  Attachments  */}
<div className="space-y-2">
<label className="block text-sm font-medium font-medium text-slate-800">Attachments</label>
<div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-[#0F766E] transition-all cursor-pointer">
<span className="material-symbols-outlined text-[32px] text-slate-600 mb-2">cloud_upload</span>
<p className="text-base text-slate-800 mb-1">Drag and drop files here or click to upload</p>
<p className="text-sm font-medium text-slate-600">PDF, DOCX, PNG, JPG up to 10MB</p>
</div>
</div>
{/*  Action Buttons  */}
<div className="pt-6 border-t border-slate-200 flex flex-col-reverse md:flex-row justify-end gap-4">
<button className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl text-base font-medium hover:bg-slate-50 transition-colors shadow-[0_2px_12px_rgba(15,23,42,0.015)]">Save as Draft</button>
<button className="px-6 py-3 bg-[#0F766E] text-white border-t border-white/20 border-x border-white/10 rounded-2xl text-base font-medium shadow-[0_4px_15px_rgba(71,85,105,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 ease-out hover:from-[#0F766E] hover:to-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2">Post Project <span className="material-symbols-outlined text-[20px]">send</span></button>
</div>
</div>
{/*  Sidebar Info Area  */}
<div className="lg:col-span-1 space-y-6">
{/*  How it Works Card  */}
<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
<h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">info</span>
                                How it Works
                            </h3>
<ul className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] before:to-transparent">
<li className="relative flex items-start gap-4">
<div className="w-8 h-8 rounded-full bg-white border-2 border-[#0F766E] flex items-center justify-center text-[#0F766E] font-bold font-body-sm flex-shrink-0 z-10 relative">1</div>
<div>
<h4 className="text-base font-medium text-slate-800">Post your project</h4>
<p className="text-sm font-medium text-slate-600 mt-1">Provide clear details to attract the right talent.</p>
</div>
</li>
<li className="relative flex items-start gap-4">
<div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10 relative">2</div>
<div>
<h4 className="text-base font-medium text-slate-800">Receive proposals</h4>
<p className="text-sm font-medium text-slate-600 mt-1">Review offers from qualified freelancers.</p>
</div>
</li>
<li className="relative flex items-start gap-4">
<div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold font-body-sm flex-shrink-0 z-10 relative">3</div>
<div>
<h4 className="text-base font-medium text-slate-800">Hire &amp; collaborate</h4>
<p className="text-sm font-medium text-slate-600 mt-1">Choose the best fit and start working.</p>
</div>
</li>
</ul>
</div>
{/*  Escrow Info Card  */}
<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-[#0F766E]/5 rounded-bl-full -mr-4 -mt-4"></div>
<span className="material-symbols-outlined text-[40px] text-[#0F766E] mb-4">gpp_good</span>
<h3 className="text-lg font-bold text-slate-800 mb-2">Secure Payments</h3>
<p className="text-sm font-medium text-slate-600 leading-relaxed">
                                Funds are held securely in <strong className="text-[#0F766E]">VNPay Escrow</strong> and only released when you confirm completion. This ensures peace of mind for both you and the freelancer.
                            </p>
</div>
</div>
</div>
</div>
</main>
  );
}
