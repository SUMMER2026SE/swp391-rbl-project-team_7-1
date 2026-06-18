import React from 'react';

export default function AdminAnalytics() {
  return (
    <main className="flex-1 overflow-y-auto bg-background p-margin-desktop">
<div className="max-w-[1280px] mx-auto flex flex-col gap-8 pb-12">
{/*  Financial Overview & Key Metrics  */}
<section className="bento-grid">
{/*  Main Line Chart  */}
<div className="col-span-12 lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6 transition-all duration-300">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="font-headline-xl text-headline-xl text-on-surface text-[#334155]">Financial Overview</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1 text-[#475569]">Platform Revenue vs Escrow Volume</p>
</div>
<div className="flex gap-2"><span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full font-label-caps text-label-caps text-[#0F766E]"><span className="w-2 h-2 rounded-full bg-[#0F766E]"></span> Revenue</span><span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full font-label-caps text-label-caps text-[#475569]"><span className="w-2 h-2 rounded-full bg-[#475569]"></span> Escrow</span></div>
</div>
<div className="h-72 chart-placeholder rounded-lg flex items-center justify-center border border-dashed border-outline-variant">
<span className="font-body-sm text-on-surface-variant italic text-[#475569]">Interactive Line Chart Canvas</span>
</div>
</div>
{/*  KPI Stack  */}
<div className="col-span-12 lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6 transition-all duration-300">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl premium-shadow p-6 flex-1 flex flex-col justify-center premium-hover-shadow transition-all duration-300">
<h4 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider text-[#334155] text-[#475569]">Avg Transaction Value</h4>
<div className="mt-2 flex items-baseline gap-3">
<span className="font-display-hero-mobile text-display-hero-mobile text-on-surface">$1,450</span>
<span className="font-label-caps text-label-caps text-[#0F766E] bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> +12%</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl premium-shadow p-6 flex-1 flex flex-col justify-center premium-hover-shadow transition-all duration-300 relative overflow-hidden">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary-container opacity-5 rounded-bl-full"></div>
<h4 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider text-[#334155] text-[#475569]">Effective Take Rate</h4>
<div className="mt-2 flex items-baseline gap-3">
<span className="font-display-hero-mobile text-display-hero-mobile text-[#0F766E]">10.2%</span>
<span className="font-body-sm text-body-sm text-on-surface-variant text-[#475569]">Avg across tiers</span>
</div>
<div className="w-full bg-surface-container-low h-2 rounded-full mt-4">
<div className="bg-[#0F766E] h-2 rounded-full" style={{ "width": "75%" }}></div>
</div>
</div>
</div>
</section>
</div>
</main>
  );
}
