import React from 'react';

export default function AdminReportHistory() {
  return (
    <main className="flex-grow pt-24 px-4 md:px-gutter max-w-container-max mx-auto w-full pb-12">
{/*  Page Header  */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
<div>
<h2 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-[#334155]">Report History</h2>
<p className="font-body-base text-body-base text-[#475569] mt-2">Manage and review previously generated system reports.</p>
</div>
<button className="bg-gradient-to-r from-[#475569] to-[#526171] text-white hover:bg-[#0F766E] transition-all font-label-caps text-label-caps py-3 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto shrink-0">
<span className="material-symbols-outlined text-[18px]">add</span>
                    Generate New Report
                </button>
</div>
{/*  Filter Bar (Simulated)  */}
<div className="bg-white border border-[#E2E8F0] rounded-t-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-[0_2px_12px_rgba(15,23,42,0.015)] border-b-0">
<div className="flex gap-2">
<button className="bg-[#F1F5F9] text-[#475569] font-body-sm text-body-sm px-4 py-1.5 rounded-full hover:bg-outline-variant transition-colors">All Reports</button>
<button className="bg-surface text-on-surface-variant font-body-sm text-body-sm px-4 py-1.5 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors">Completed</button>
<button className="bg-surface text-on-surface-variant font-body-sm text-body-sm px-4 py-1.5 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors">Processing</button>
</div>
<div className="relative">
<select className="appearance-none bg-surface border border-outline-variant rounded-lg pl-4 pr-10 py-1.5 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary">
<option>Last 30 Days</option>
<option>Last 7 Days</option>
<option>All Time</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
</div>
</div>
{/*  Table Container  */}
<div className="bg-white border border-[#E2E8F0] rounded-b-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
<th className="font-label-caps text-label-caps text-on-surface-variant py-4 px-6 font-semibold text-[#475569]">Report Name</th>
<th className="font-label-caps text-label-caps text-on-surface-variant py-4 px-6 font-semibold text-[#475569]">Type</th>
<th className="font-label-caps text-label-caps text-on-surface-variant py-4 px-6 font-semibold text-[#475569]">Date Generated</th>
<th className="font-label-caps text-label-caps text-on-surface-variant py-4 px-6 font-semibold text-[#475569]">Status</th>
<th className="font-label-caps text-label-caps text-on-surface-variant py-4 px-6 font-semibold text-right text-[#475569]">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{/*  Row 1  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-default">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-fixed flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">description</span>
</div>
<div>
<p className="font-body-base text-body-base text-[#475569] mt-2">Q3 Financial Summary</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">ID: RPT-8924</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="font-body-sm text-body-sm text-on-surface">Financial</span>
</td>
<td className="py-4 px-6">
<p className="font-body-sm text-body-sm text-on-surface">Oct 24, 2023</p>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">09:41 AM</p>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-body-sm text-[12px] font-medium border border-transparent">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container bg-[#0F766E]"></span>
                                        Ready
                                    </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" title="Download">
<span className="material-symbols-outlined text-[20px]">download</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-default">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">group</span>
</div>
<div>
<p className="font-body-base text-body-base text-[#475569] mt-2">Monthly Freelancer Activity</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">ID: RPT-8923</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="font-body-sm text-body-sm text-on-surface">User Metrics</span>
</td>
<td className="py-4 px-6">
<p className="font-body-sm text-body-sm text-on-surface">Oct 24, 2023</p>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">08:15 AM</p>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-body-sm text-[12px] font-medium border border-transparent">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                                        Processing
                                    </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-outline hover:text-on-surface-variant rounded-lg transition-colors cursor-not-allowed" disabled="" title="Processing...">
<span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Cancel/Delete">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-default">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">gavel</span>
</div>
<div>
<p className="font-body-base text-body-base text-[#475569] mt-2">Dispute Resolution Log YTD</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">ID: RPT-8910</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="font-body-sm text-body-sm text-on-surface">Compliance</span>
</td>
<td className="py-4 px-6">
<p className="font-body-sm text-body-sm text-on-surface">Oct 20, 2023</p>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">14:22 PM</p>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-body-sm text-[12px] font-medium border border-transparent">
<span className="material-symbols-outlined text-[14px]">error</span>
                                        Expired
                                    </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" title="Regenerate">
<span className="material-symbols-outlined text-[20px]">refresh</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-surface-container-lowest transition-colors group cursor-default">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-fixed flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[18px]">account_balance</span>
</div>
<div>
<p className="font-body-base text-body-base text-[#475569] mt-2">Enterprise Client Payouts</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">ID: RPT-8905</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<span className="font-body-sm text-body-sm text-on-surface">Financial</span>
</td>
<td className="py-4 px-6">
<p className="font-body-sm text-body-sm text-on-surface">Oct 18, 2023</p>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">11:05 AM</p>
</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-body-sm text-[12px] font-medium border border-transparent">
<span className="w-1.5 h-1.5 rounded-full bg-primary-container bg-[#0F766E]"></span>
                                        Ready
                                    </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors" title="Download">
<span className="material-symbols-outlined text-[20px]">download</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="bg-[#F8FAFC] border-t border-outline-variant p-4 flex items-center justify-between">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 4 of 48 entries</p>
<div className="flex gap-1">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed" disabled="">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-white font-body-sm text-body-sm">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low font-body-sm text-body-sm">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low font-body-sm text-body-sm">3</button>
<span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
</main>
  );
}
