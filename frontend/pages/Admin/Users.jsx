import React from 'react';

export default function AdminUsers() {
  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
<div className="max-w-container-max mx-auto w-full flex flex-col gap-8">
{/*  Page Header & Filters  */}
<div className="flex flex-col gap-6">
<div>
<h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">User Management</h1>
<p className="font-body-base text-body-base text-[#475569]">Manage, verify, and monitor network participants.</p>
</div>
{/*  Action Bar  */}
<div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
{/*  Search  */}
<div className="relative flex-1 min-w-[280px] max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-body-sm text-body-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors" placeholder="Search by name, email, or ID..." type="text"/>
</div>
{/*  Filters  */}
<div className="flex items-center gap-3">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="form-checkbox rounded text-[#0F766E] focus:ring-[#0F766E] border-[#E2E8F0] group-hover:border-[#0F766E] transition-colors" type="checkbox"/>
<span className="font-body-sm text-body-sm text-[#475569] group-hover:text-[#334155]">Unverified Users</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group ml-4">
<input className="form-checkbox rounded text-error focus:ring-error border-[#E2E8F0] group-hover:border-error transition-colors" type="checkbox"/>
<span className="font-body-sm text-body-sm text-error group-hover:text-error-container">High Risk</span>
</label>
<div className="w-px h-6 bg-[#E2E8F0] mx-2"></div>
<button className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-label-caps text-label-caps text-[#334155] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
                                More Filters
                            </button>
</div>
</div>
</div>
{/*  Data Table  */}
<div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
<div className="overflow-x-auto w-full">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">User</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Role</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Verification</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Trust Score</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Total Volume</th>
<th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-[#E2E8F0]">
{/*  Row 1  */}
<tr className="hover:bg-[#F8FAFC] transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] font-bold font-body-sm">
                                                EC
                                            </div>
<div>
<div className="font-body-base text-body-base font-semibold text-[#334155]">Elena Corwin</div>
<div className="font-body-sm text-body-sm text-[#475569]">elena.c@example.com</div>
</div>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#334155]">Freelancer</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F766E]/10 text-[#0F766E] font-label-caps text-label-caps border border-[#0F766E]/20">
<span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
                                            Verified
                                        </span>
</td>
<td className="py-4 px-6">
<div className="flex items-center gap-2">
<div className="w-full bg-[#E2E8F0] rounded-full h-2 max-w-[100px]">
<div className="bg-[#0F766E] h-2 rounded-full" style={{ "width": "92%" }}></div>
</div>
<span className="font-body-sm text-body-sm text-[#334155] font-semibold">92</span>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#0F766E] font-mono">$45,200</td>
<td className="py-4 px-6 text-right">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] font-label-caps text-label-caps transition-colors">View Profile</button>
<button className="p-1.5 rounded-md text-error hover:bg-error-container transition-colors" title="Suspend">
<span className="material-symbols-outlined text-[20px]">block</span>
</button>
</div>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-[#F8FAFC] transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] font-bold font-body-sm">
                                                TC
                                            </div>
<div>
<div className="font-body-base text-body-base font-semibold text-[#334155]">TechCorp Inc.</div>
<div className="font-body-sm text-body-sm text-[#475569]">billing@techcorp.io</div>
</div>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#334155]">Employer</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-label-caps text-label-caps border border-amber-200">
<span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            Pending
                                        </span>
</td>
<td className="py-4 px-6">
<div className="flex items-center gap-2">
<div className="w-full bg-[#E2E8F0] rounded-full h-2 max-w-[100px]">
<div className="bg-amber-500 h-2 rounded-full" style={{ "width": "65%" }}></div>
</div>
<span className="font-body-sm text-body-sm text-[#334155] font-semibold">65</span>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#0F766E] font-mono">$12,050</td>
<td className="py-4 px-6 text-right">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-3 py-1.5 rounded-md border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white font-label-caps text-label-caps transition-colors">Verify</button>
<button className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] font-label-caps text-label-caps transition-colors">View</button>
</div>
</td>
</tr>
{/*  Row 3 (High Risk)  */}
<tr className="hover:bg-[#F8FAFC] transition-colors group bg-error-container/10">
<td className="py-4 px-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error font-bold font-body-sm">
                                                JD
                                            </div>
<div>
<div className="font-body-base text-body-base font-semibold text-[#334155] flex items-center gap-2">
                                                    John Doe
                                                    <span className="material-symbols-outlined text-[16px] text-error" title="High Risk Flag">warning</span>
</div>
<div className="font-body-sm text-body-sm text-[#475569]">j.doe99@unknown.net</div>
</div>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#334155]">Freelancer</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#475569] font-label-caps text-label-caps border border-[#E2E8F0]">
<span className="w-1.5 h-1.5 rounded-full bg-[#475569]"></span>
                                            Unverified
                                        </span>
</td>
<td className="py-4 px-6">
<div className="flex items-center gap-2">
<div className="w-full bg-[#E2E8F0] rounded-full h-2 max-w-[100px]">
<div className="bg-error h-2 rounded-full" style={{ "width": "25%" }}></div>
</div>
<span className="font-body-sm text-body-sm text-error font-semibold">25</span>
</div>
</td>
<td className="py-4 px-6 font-body-sm text-body-sm text-[#475569] font-mono">$0</td>
<td className="py-4 px-6 text-right">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="px-3 py-1.5 rounded-md bg-error text-white hover:bg-red-700 font-label-caps text-label-caps transition-colors shadow-sm">Suspend</button>
<button className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] font-label-caps text-label-caps transition-colors">Review</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between">
<span className="font-body-sm text-body-sm text-[#475569]">Showing 1 to 3 of 1,248 entries</span>
<div className="flex items-center gap-2">
<button className="p-1 rounded text-[#475569] hover:text-[#334155] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-8 h-8 rounded bg-[#0F766E] text-white font-body-sm text-body-sm font-semibold flex items-center justify-center">1</button>
<button className="w-8 h-8 rounded text-[#475569] hover:bg-[#0F766E] hover:text-white font-body-sm text-body-sm flex items-center justify-center transition-colors">2</button>
<button className="w-8 h-8 rounded text-[#475569] hover:bg-[#0F766E] hover:text-white font-body-sm text-body-sm flex items-center justify-center transition-colors">3</button>
<span className="text-[#475569]">...</span>
<button className="p-1 rounded text-[#475569] hover:text-[#334155] hover:bg-[#F8FAFC] transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
  );
}
