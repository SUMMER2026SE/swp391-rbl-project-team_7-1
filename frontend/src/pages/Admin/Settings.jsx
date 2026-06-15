import React from 'react';

export default function AdminSettings() {
  return (
    <main className="flex-1 ml-0 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F8FAFC]">
<div className="max-w-container-max mx-auto space-y-8">
{/*  Page Header  */}
<div>
<h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">System Settings &amp; Controls</h1>
<p className="font-body-base text-body-base text-[#475569]">Manage global platform configurations, API integrations, and review administrative audit logs.</p>
</div>
{/*  Settings Bento Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/*  Platform Fees Card  */}
<div className="col-span-1 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex flex-col justify-between">
<div>
<div className="flex items-center gap-3 mb-4 text-[#0F766E]">
<span className="material-symbols-outlined text-2xl">percent</span>
<h2 className="font-headline-xl text-headline-xl text-[#334155]">Platform Fee</h2>
</div>
<p className="font-body-sm text-body-sm text-[#475569] mb-6">Set the default commission rate applied to all successfully completed escrow contracts.</p>
<div className="flex items-end gap-4 mb-4">
<div className="w-full relative">
<label className="font-label-caps text-label-caps text-[#475569] block mb-2">Current Rate (%)</label>
<input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 text-body-base font-bold text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" type="number" value="10.0"/>
</div>
</div>
</div>
<button className="w-full bg-gradient-to-b from-[#475569] to-[#526171] text-white font-label-caps text-label-caps py-3 rounded-lg hover:bg-none hover:bg-[#0F766E] transition-all">
                            Update Fee Structure
                        </button>
</div>
{/*  VNPay Integration Card  */}
<div className="col-span-1 lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<div className="flex items-center justify-between mb-4">
<div className="flex items-center gap-3 text-[#0F766E]">
<span className="material-symbols-outlined text-2xl">account_balance</span>
<h2 className="font-headline-xl text-headline-xl text-[#334155]">VNPay API Configuration</h2>
</div>
<span className="bg-[#F1F5F9] text-[#475569] font-label-caps text-label-caps px-3 py-1 rounded-full flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-[#0F766E]"></span> Live Mode
                            </span>
</div>
<p className="font-body-sm text-body-sm text-[#475569] mb-6">Manage merchant credentials and webhook endpoints for the VNPay payment gateway integration.</p>
<div className="space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="font-label-caps text-label-caps text-[#475569] block mb-2">Merchant ID (vnp_TmnCode)</label>
<div className="relative">
<input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-body-sm text-[#334155] focus:outline-none" readOnly="" type="password" value="ELITE_MKT_PROD_99"/>
<button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F766E]"><span className="material-symbols-outlined text-sm">visibility</span></button>
</div>
</div>
<div>
<label className="font-label-caps text-label-caps text-[#475569] block mb-2">Hash Secret</label>
<div className="relative">
<input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-body-sm text-[#334155] focus:outline-none" readOnly="" type="password" value="************************"/>
<button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F766E]"><span className="material-symbols-outlined text-sm">edit</span></button>
</div>
</div>
</div>
<div>
<label className="font-label-caps text-label-caps text-[#475569] block mb-2">Webhook Return URL</label>
<input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-body-sm text-[#334155] focus:outline-none" readOnly="" type="text" value="https://api.elitemarket.com/v1/webhooks/vnpay/ipn"/>
</div>
</div>
</div>
</div>
{/*  Audit Logs Section (Tabbed Interface)  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
{/*  Tabs  */}
<div className="flex border-b border-[#E2E8F0] px-6 pt-4 gap-8">
<button className="font-label-caps text-label-caps font-bold text-[#0F766E] border-b-2 border-[#0F766E] pb-3 px-2 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">history</span> Security Audit Log
                        </button>
<button className="font-label-caps text-label-caps text-[#475569] hover:text-[#0F766E] transition-colors border-b-2 border-transparent pb-3 px-2 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">settings_suggest</span> System Events
                        </button>
<button className="font-label-caps text-label-caps text-[#475569] hover:text-[#0F766E] transition-colors border-b-2 border-transparent pb-3 px-2 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">manage_accounts</span> Admin Access
                        </button>
</div>
{/*  Log Controls  */}
<div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap gap-4 items-center justify-between">
<div className="flex gap-4 items-center">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-sm">filter_list</span>
<select className="pl-9 pr-8 py-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] appearance-none cursor-pointer text-[#334155]">
<option>All Actions</option>
<option>Settings Changed</option>
<option>Fee Updated</option>
<option>User Banned</option>
</select>
</div>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-sm">calendar_today</span>
<input className="pl-9 pr-4 py-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#334155] cursor-pointer" type="date"/>
</div>
</div>
<button className="flex items-center gap-2 text-[#475569] hover:text-[#0F766E] transition-colors font-label-caps text-label-caps">
<span className="material-symbols-outlined text-sm">download</span> Export CSV
                        </button>
</div>
{/*  Log Table  */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
<th className="py-3 px-6 font-label-caps text-label-caps text-[#475569]">Timestamp (UTC)</th>
<th className="py-3 px-6 font-label-caps text-label-caps text-[#475569]">Admin</th>
<th className="py-3 px-6 font-label-caps text-label-caps text-[#475569]">Action</th>
<th className="py-3 px-6 font-label-caps text-label-caps text-[#475569]">Resource / Detail</th>
<th className="py-3 px-6 font-label-caps text-label-caps text-[#475569]">IP Address</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm divide-y divide-[#E2E8F0]">
<tr className="hover:bg-[#F8FAFC] transition-colors">
<td className="py-4 px-6 text-[#475569]">2023-10-27 14:32:01</td>
<td className="py-4 px-6 font-medium text-[#334155]">System Operator</td>
<td className="py-4 px-6"><span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded font-label-caps text-[10px]">UPDATE</span> Fee Structure</td>
<td className="py-4 px-6 text-[#475569]">Changed default platform fee from 8.5% to 10.0%</td>
<td className="py-4 px-6 text-[#475569] font-mono text-xs">192.168.1.45</td>
</tr>
<tr className="hover:bg-[#F8FAFC] transition-colors">
<td className="py-4 px-6 text-[#475569]">2023-10-27 09:15:22</td>
<td className="py-4 px-6 font-medium text-[#334155]">Lead Admin</td>
<td className="py-4 px-6"><span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded font-label-caps text-[10px]">AUTH</span> Login</td>
<td className="py-4 px-6 text-[#475569]">Successful admin portal login via 2FA</td>
<td className="py-4 px-6 text-[#475569] font-mono text-xs">203.0.113.89</td>
</tr>
<tr className="hover:bg-[#F8FAFC] transition-colors">
<td className="py-4 px-6 text-[#475569]">2023-10-26 16:45:10</td>
<td className="py-4 px-6 font-medium text-[#334155]">System Operator</td>
<td className="py-4 px-6"><span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded font-label-caps text-[10px]">CONFIG</span> VNPay API</td>
<td className="py-4 px-6 text-[#475569]">Rotated Hash Secret for production environment</td>
<td className="py-4 px-6 text-[#475569] font-mono text-xs">192.168.1.45</td>
</tr>
<tr className="hover:bg-[#F8FAFC] transition-colors">
<td className="py-4 px-6 text-[#475569]">2023-10-25 11:20:05</td>
<td className="py-4 px-6 font-medium text-[#334155]">Support Staff A</td>
<td className="py-4 px-6"><span className="bg-red-100 text-red-700 px-2 py-1 rounded font-label-caps text-[10px]">MODERATE</span> User Ban</td>
<td className="py-4 px-6 text-[#475569]">Suspended Freelancer ID #8492 (TOS Violation)</td>
<td className="py-4 px-6 text-[#475569] font-mono text-xs">10.0.0.52</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination (Simplified)  */}
<div className="p-4 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
<span className="font-body-sm text-body-sm text-[#475569]">Showing 1-4 of 1,248 logs</span>
<div className="flex gap-2">
<button className="p-1 rounded text-[#475569] hover:bg-[#FFFFFF] hover:text-[#0F766E] transition-colors border border-transparent hover:border-[#E2E8F0]" disabled=""><span className="material-symbols-outlined text-sm">chevron_left</span></button>
<button className="p-1 rounded text-[#475569] hover:bg-[#FFFFFF] hover:text-[#0F766E] transition-colors border border-transparent hover:border-[#E2E8F0]"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
</div>
</div>
</main>
  );
}
