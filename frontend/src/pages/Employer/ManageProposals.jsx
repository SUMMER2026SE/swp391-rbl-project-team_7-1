import React from 'react';

export default function ManageProposals() {
  return (
    <main className="flex-1 p-margin-desktop pt-12 overflow-y-auto">
<div className="max-w-container-max mx-auto">
{/*  Page Header  */}
<div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<a className="flex items-center gap-1 text-sm font-medium hover:underline mb-2 text-[#0F766E]" href="#">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Quay lại Chi tiết dự án
                        </a>
<h1 className="text-2xl font-bold tracking-tight text-slate-800">
                            Quản lý Đề xuất cho: <span className="font-normal text-slate-600">Enterprise Dashboard Redesign</span>
</h1>
</div>
<div className="flex gap-2">
<select className="bg-surface-container-lowest border border-outline-variant rounded-2xl px-3 py-2 text-sm font-medium text-on-surface focus:outline-none focus:border-primary">
<option>Tất cả đề xuất (12)</option>
<option>Được chọn (3)</option>
<option>Đã lưu trữ (0)</option>
</select>
<select className="bg-surface-container-lowest border border-outline-variant rounded-2xl px-3 py-2 text-sm font-medium text-on-surface focus:outline-none focus:border-primary">
<option>Sắp xếp: Phù hợp nhất</option>
<option>Sắp xếp: Giá thấp nhất</option>
<option>Sắp xếp: Đánh giá cao nhất</option>
</select>
</div>
</div>
{/*  Proposals Bento Grid Layout  */}
<div className="grid grid-cols-1 gap-6">
{/*  Proposal Card 1 (Shortlisted)  */}
<article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
{/*  Subtle Status Indicator Strip  */}
<div className="absolute top-0 left-0 w-1 h-full bg-[#0F766E]"></div>
<div className="flex flex-col md:flex-row gap-8">
{/*  Left: Freelancer Info  */}
<div className="flex-shrink-0 w-full md:w-64 flex flex-col gap-4">
<div className="flex items-start gap-4">
<img alt="Freelancer Avatar" className="w-16 h-16 rounded-full border border-outline-variant object-cover" data-alt="A professional headshot of a confident female UX designer in a bright, modern studio. She is smiling softly, wearing a smart casual blazer. The background is a clean, out-of-focus white wall with subtle warm lighting. Premium and trustworthy aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2yKdruJi_LRm4ZdIB5C9XSk1koO9YmwORHNx2bhV0b5lRFdSrIGn0Q05HQ89QSNDQImXFubVWQ7NXrZwnfvepGXAE9QuXulWUabMPuZlKA_Be7L86KpfXgiG7RzvrLLdENz_YCQKJB8bW24xLopwB9qV8GG5mb-iHtVSwFCFx1N9knA22LqEWi82PIlnN87SmOOXbwjfyRVbLisG25H1lHTVI3Wq4fIvh8b2fkxRRGGg0S2mWv5_3K-vdA6dbeusPEN-nkom8NA0"/>
<div>
<h3 className="text-lg font-bold text-slate-800">Elena Rostova</h3>
<p className="text-sm font-medium text-slate-600">Senior Product Designer</p>
<div className="flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-tertiary-container text-[16px] font-variation-settings-'FILL'-1">star</span>
<span className="text-sm font-medium font-semibold text-[#0F766E]">4.9</span>
<span className="text-sm font-medium text-outline">(124 việc)</span>
</div>
</div>
</div>
<div className="flex flex-wrap gap-2">
<span className="px-2 py-1 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30 text-slate-600">Figma</span>
<span className="px-2 py-1 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30 text-slate-600">Design Systems</span>
</div>
</div>
{/*  Middle: Proposal Content  */}
<div className="flex-1 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="flex gap-2">
<span className="px-3 py-1 bg-tertiary-container/10 text-xs font-bold uppercase tracking-wider rounded-full border border-tertiary-container/30 bg-slate-100 text-[#0F766E]">Được chọn</span>
</div>
<div className="text-right">
<div className="text-lg font-bold font-bold text-[#0F766E]">$4,500</div>
<div className="text-sm font-medium text-outline">trong 3 tuần</div>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50">
<p className="text-sm font-medium line-clamp-3 text-slate-600">
                                        Hi there, I read your requirements for the Enterprise Dashboard Redesign. I recently completed a similar complex data visualization project for a FinTech client using Figma and React. I propose starting with a comprehensive UX audit of your current dashboard before moving into wireframing. My approach ensures we solve the core navigation issues you mentioned...
                                    </p>
</div>
</div>
{/*  Right: Actions  */}
<div className="flex-shrink-0 w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6">
<button className="w-full py-3 bg-[#0F766E] text-white rounded-2xl text-sm font-medium font-semibold border-t border-white/20 border-x border-white/10 shadow-[0_4px_15px_rgba(71,85,105,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 ease-out hover:bg-none hover:bg-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">account_balance</span>
                                    Thuê &amp; Thanh toán Escrow
                                </button>
<button className="w-full py-2 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-2xl text-sm font-medium font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">chat</span>
                                    Nhắn tin
                                </button>
<div className="flex gap-2 mt-2">
<button className="flex-1 py-2 text-primary text-sm font-medium font-medium hover:bg-primary/5 rounded-2xl transition-colors">
                                        Xem đầy đủ
                                    </button>
<button className="p-2 text-outline hover:text-tertiary hover:bg-tertiary/5 rounded-2xl transition-colors tooltip-trigger" title="Remove from shortlist">
<span className="material-symbols-outlined font-variation-settings-'FILL'-1">bookmark</span>
</button>
</div>
</div>
</div>
</article>
{/*  Proposal Card 2 (Pending)  */}
<article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
<div className="flex flex-col md:flex-row gap-8">
{/*  Left: Freelancer Info  */}
<div className="flex-shrink-0 w-full md:w-64 flex flex-col gap-4">
<div className="flex items-start gap-4">
<div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-lg font-bold border border-outline-variant">
                                        MJ
                                    </div>
<div>
<h3 className="text-lg font-bold text-slate-800">Marcus Johnson</h3>
<p className="text-sm font-medium text-slate-600">UI/UX Agency Lead</p>
<div className="flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-tertiary-container text-[16px] font-variation-settings-'FILL'-1">star</span>
<span className="text-sm font-medium font-semibold text-[#0F766E]">4.7</span>
<span className="text-sm font-medium text-outline">(89 việc)</span>
</div>
</div>
</div>
<div className="flex flex-wrap gap-2">
<span className="px-2 py-1 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30 text-slate-600">UI Design</span>
<span className="px-2 py-1 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30 text-slate-600">Prototyping</span>
</div>
</div>
{/*  Middle: Proposal Content  */}
<div className="flex-1 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="flex gap-2">
<span className="px-3 py-1 bg-surface-container text-xs font-bold uppercase tracking-wider rounded-full border border-outline-variant/50 text-slate-600 bg-slate-100">Chờ duyệt</span>
</div>
<div className="text-right">
<div className="text-lg font-bold font-bold text-[#0F766E]">$3,800</div>
<div className="text-sm font-medium text-outline">trong 4 tuần</div>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50">
<p className="text-sm font-medium line-clamp-3 text-slate-600">
                                        Hello, my team and I would love to tackle this dashboard redesign. We specialize in B2B enterprise software interfaces. Our typical process involves user interviews, wireframing in Whimsical, and high-fidelity design in Figma. We've attached a portfolio link featuring three similar projects we delivered last quarter...
                                    </p>
</div>
</div>
{/*  Right: Actions  */}
<div className="flex-shrink-0 w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-6">
<button className="w-full py-3 bg-[#0F766E] text-white rounded-2xl text-sm font-medium font-semibold border-t border-white/20 border-x border-white/10 shadow-[0_4px_15px_rgba(71,85,105,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500 ease-out hover:bg-none hover:bg-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">account_balance</span>
                                    Thuê &amp; Thanh toán Escrow
                                </button>
<button className="w-full py-2 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-2xl text-sm font-medium font-medium hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">chat</span>
                                    Nhắn tin
                                </button>
<div className="flex gap-2 mt-2">
<button className="flex-1 py-2 text-primary text-sm font-medium font-medium hover:bg-primary/5 rounded-2xl transition-colors">
                                        Xem đầy đủ
                                    </button>
<button className="p-2 text-outline hover:text-tertiary hover:bg-tertiary/5 rounded-2xl transition-colors tooltip-trigger" title="Shortlist">
<span className="material-symbols-outlined">bookmark_add</span>
</button>
</div>
</div>
</div>
</article>
</div>
</div>
</main>
  );
}
