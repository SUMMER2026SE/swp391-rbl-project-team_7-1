import React from 'react';

export default function AdminGenerateReport() {
  return (
    <main className="flex-1 overflow-y-auto pt-24 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
<div className="mb-8">
<h1 className="font-headline-2xl text-headline-2xl text-[#334155]">Generate New Report</h1>
<p className="font-body-base text-body-base text-[#475569] mt-2">Configure data parameters and export settings for your custom report.</p>
</div>
{/*  Configuration Form Area  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Left Column: Primary Settings  */}
<div className="lg:col-span-2 space-y-6">
{/*  Step 1: Report Type  */}
<section className="card-elite">
<div className="flex items-center gap-2 mb-4">
<span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-primary font-label-caps text-label-caps">1</span>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Select Report Type</h3>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<label className="relative flex p-4 border border-[#0F766E] rounded-lg cursor-pointer hover-lift group ring-1 ring-[#0F766E] bg-slate-50">
<input checked="" className="sr-only" name="report_type" type="radio" value="financial"/>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0F766E] mt-0.5">account_balance</span>
<div>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Financial Summary</span>
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">Aggregated revenue, payouts, and platform fees.</span>
</div>
</div>
</label>
<label className="relative flex p-4 border border-[#E2E8F0] rounded-lg cursor-pointer hover-lift group">
<input className="sr-only" name="report_type" type="radio" value="escrow"/>
<div className="flex items-start gap-3">
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">lock_clock</span>
<div>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Escrow Activity</span>
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">Funds held, released, and pending arbitration.</span>
</div>
</div>
</label>
<label className="relative flex p-4 border border-[#E2E8F0] rounded-lg cursor-pointer hover-lift group">
<input className="sr-only" name="report_type" type="radio" value="user"/>
<div className="flex items-start gap-3">
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">trending_up</span>
<div>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">User Growth</span>
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">New registrations, active talent, and client retention.</span>
</div>
</div>
</label>
<label className="relative flex p-4 border border-[#E2E8F0] rounded-lg cursor-pointer hover-lift group">
<input className="sr-only" name="report_type" type="radio" value="dispute"/>
<div className="flex items-start gap-3">
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">gavel</span>
<div>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Dispute Logs</span>
<span className="block font-body-sm text-body-sm text-[#475569] mt-1">Active conflicts, resolution times, and outcomes.</span>
</div>
</div>
</label>
</div>
</section>
{/*  Step 2: Date Range  */}
<section className="card-elite">
<div className="flex items-center gap-2 mb-4">
<span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">2</span>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Date Range</h3>
</div>
<div className="flex flex-wrap gap-3 mb-6">
<button className="px-4 py-2 rounded-full border border-[#0F766E] bg-slate-50 text-[#0F766E] font-body-sm text-body-sm font-medium">Last 30 Days</button>
<button className="px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm hover:bg-surface-container transition-colors">This Quarter</button>
<button className="px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm hover:bg-surface-container transition-colors">Year to Date</button>
<button className="px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm hover:bg-surface-container transition-colors">Custom Range</button>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Start Date</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">calendar_today</span>
<input className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-on-surface font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" type="date" value="2023-09-01"/>
</div>
</div>
<div>
<label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">End Date</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">calendar_today</span>
<input className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-on-surface font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" type="date" value="2023-09-30"/>
</div>
</div>
</div>
</section>
</div>
{/*  Right Column: Secondary Settings & Actions  */}
<div className="space-y-6">
{/*  Step 3: Filters  */}
<section className="card-elite">
<div className="flex items-center gap-2 mb-4">
<span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">3</span>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Filters</h3>
</div>
<div className="space-y-4">
<div>
<label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">User Tier</label>
<select className="w-full px-4 py-2 rounded-lg border border-[#E2E8F0] text-on-surface font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white">
<option>All Tiers</option>
<option>Premium Plus</option>
<option>Standard</option>
</select>
</div>
<div>
<label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Status</label>
<div className="flex flex-col gap-2 mt-2">
<label className="flex items-center gap-2 cursor-pointer">
<input checked="" className="material-symbols-outlined text-[#0F766E] mt-0.5" type="checkbox"/>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Completed</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input checked="" className="material-symbols-outlined text-[#0F766E] mt-0.5" type="checkbox"/>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Pending</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="material-symbols-outlined text-[#0F766E] mt-0.5" type="checkbox"/>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">Failed/Refunded</span>
</label>
</div>
</div>
</div>
</section>
{/*  Step 4: Export Format & Actions  */}
<section className="card-elite">
<div className="flex items-center gap-2 mb-4">
<span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">4</span>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Export Setup</h3>
</div>
<div className="space-y-3 mb-6">
<label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#E11D48]">picture_as_pdf</span>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">PDF Document</span>
</div>
<input className="material-symbols-outlined text-[#0F766E] mt-0.5" name="export_format" type="radio" value="pdf"/>
</label>
<label className="relative flex p-4 border border-[#0F766E] rounded-lg cursor-pointer hover-lift group ring-1 ring-[#0F766E] bg-slate-50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#16A34A]">table_chart</span>
<span className="block font-body-base text-body-base font-semibold text-[#334155]">CSV Spreadsheet</span>
</div>
<input checked="" className="material-symbols-outlined text-[#0F766E] mt-0.5" name="export_format" type="radio" value="csv"/>
</label>
</div>
<div className="border-t border-[#E2E8F0] pt-6">
<button className="w-full btn-primary-elite text-white py-3 rounded-lg font-body-base text-body-base font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm">
<span className="material-symbols-outlined">bolt</span>
                                Generate Report
                            </button>
<p className="font-body-base text-body-base text-[#475569] mt-2">Estimated time: ~30 seconds</p>
</div>
</section>
</div>
</div>
</main>
  );
}
