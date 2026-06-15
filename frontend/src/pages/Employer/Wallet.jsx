import React from 'react';

export default function EmployerWallet() {
  return (
    <main className="flex-1 ml-0 overflow-y-auto w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 bg-[#F8FAFC]">
<header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
<div>
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-[#334155] mb-2">Wallet &amp; Transactions</h1>
<p className="font-body-base text-body-base text-[#475569]">Manage your payments, view active escrow, and track spending history.</p>
</div>
<button className="bg-[#0F766E] hover:bg-[#0F766E] text-white font-body-base font-semibold py-3 px-6 rounded-lg transition-colors shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex items-center justify-center gap-2 shrink-0">
<span className="material-symbols-outlined">add_circle</span>
                    Fund Escrow
                </button>
</header>
{/*  Bento Grid: Financial Summary  */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
{/*  Total Spent Card  */}
<div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0F766E]">
<span className="material-symbols-outlined">account_balance_wallet</span>
</div>
<span className="font-label-caps text-label-caps bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded-full uppercase">All Time</span>
</div>
<div>
<p className="font-body-sm text-body-sm text-[#475569] mb-1">Total Spent</p>
<h3 className="font-headline-2xl text-headline-2xl text-[#334155]">$124,500.00</h3>
</div>
</div>
{/*  Active Escrow Card  */}
<div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
<div className="absolute inset-0 bg-gradient-to-br from-[#FFFFFF] to-[#F1F5F9] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
<div className="relative z-10 flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#475569] to-[#526171] flex items-center justify-center text-white">
<span className="material-symbols-outlined">lock</span>
</div>
<span className="font-label-caps text-label-caps bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded-full uppercase flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-[#0F766E]"></span>
                            Secured by VNPay Escrow
                        </span>
</div>
<div className="relative z-10">
<p className="font-body-sm text-body-sm text-[#475569] mb-1">Active Escrow Funds</p>
<h3 className="font-headline-2xl text-headline-2xl text-[#334155]">$18,250.00</h3>
<p className="font-body-sm text-body-sm text-[#0F766E] mt-2 flex items-center gap-1 cursor-pointer hover:underline w-fit">
                            View 3 active holds <span className="material-symbols-outlined text-sm">arrow_forward</span>
</p>
</div>
</div>
{/*  Saved Payment Methods Card  */}
<div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div className="flex justify-between items-start mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">credit_card</span>
</div>
<button className="text-[#475569] hover:text-[#0F766E] transition-colors">
<span className="material-symbols-outlined">edit</span>
</button>
</div>
<div>
<p className="font-body-sm text-body-sm text-[#475569] mb-3">Saved Payment Methods</p>
<div className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] mb-2">
<span className="material-symbols-outlined text-[#0F766E]">credit_score</span>
<div className="flex-1">
<p className="font-body-sm text-body-sm font-semibold text-[#334155]">Visa ending in 4242</p>
<p className="text-xs text-[#475569]">Primary</p>
</div>
</div>
</div>
</div>
</section>
{/*  Transaction History Table  */}
<section className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden mb-12">
<div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Transaction History</h3>
<div className="flex gap-2">
<button className="p-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button className="p-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
<span className="material-symbols-outlined">download</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-label-caps text-label-caps text-[#475569] uppercase tracking-wider">
<th className="px-6 py-4 font-semibold">ID</th>
<th className="px-6 py-4 font-semibold">Date</th>
<th className="px-6 py-4 font-semibold">Project / Freelancer</th>
<th className="px-6 py-4 font-semibold">Type</th>
<th className="px-6 py-4 font-semibold text-right">Amount</th>
<th className="px-6 py-4 font-semibold text-center">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-[#E2E8F0] font-body-sm text-body-sm">
<tr className="hover:bg-[#F1F5F9] transition-colors group">
<td className="px-6 py-4 font-mono text-[#475569]">TXN-9021A</td>
<td className="px-6 py-4 text-[#475569]">Oct 24, 2024</td>
<td className="px-6 py-4">
<p className="font-semibold text-[#334155]">Enterprise Dashboard Redesign</p>
<p className="text-[#475569] text-xs">Elena R.</p>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-[#0F766E]">arrow_upward</span>
                                        Escrow Funding
                                    </span>
</td>
<td className="px-6 py-4 text-right font-semibold text-[#334155]">
                                    $4,500.00
                                </td>
<td className="px-6 py-4 text-center">
<span className="inline-block px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-label-caps text-[10px] uppercase">Held</span>
</td>
</tr>
<tr className="hover:bg-[#F1F5F9] transition-colors group">
<td className="px-6 py-4 font-mono text-[#475569]">TXN-8842B</td>
<td className="px-6 py-4 text-[#475569]">Oct 18, 2024</td>
<td className="px-6 py-4">
<p className="font-semibold text-[#334155]">Backend API Migration</p>
<p className="text-[#475569] text-xs">David K.</p>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-[#0F766E]">check_circle</span>
                                        Payment Release
                                    </span>
</td>
<td className="px-6 py-4 text-right font-semibold text-[#334155]">
                                    $2,800.00
                                </td>
<td className="px-6 py-4 text-center">
<span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] font-label-caps text-[10px] uppercase border border-[#A7F3D0]">Completed</span>
</td>
</tr>
<tr className="hover:bg-[#F1F5F9] transition-colors group">
<td className="px-6 py-4 font-mono text-[#475569]">TXN-8711C</td>
<td className="px-6 py-4 text-[#475569]">Oct 12, 2024</td>
<td className="px-6 py-4">
<p className="font-semibold text-[#334155]">Mobile App QA Testing</p>
<p className="text-[#475569] text-xs">Sarah T.</p>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-[#475569]">undo</span>
                                        Refund
                                    </span>
</td>
<td className="px-6 py-4 text-right font-semibold text-[#475569]">
                                    +$500.00
                                </td>
<td className="px-6 py-4 text-center">
<span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] font-label-caps text-[10px] uppercase border border-[#A7F3D0]">Completed</span>
</td>
</tr>
<tr className="hover:bg-[#F1F5F9] transition-colors group">
<td className="px-6 py-4 font-mono text-[#475569]">TXN-8650D</td>
<td className="px-6 py-4 text-[#475569]">Oct 05, 2024</td>
<td className="px-6 py-4">
<p className="font-semibold text-[#334155]">Brand Identity Update</p>
<p className="text-[#475569] text-xs">Marcus W.</p>
</td>
<td className="px-6 py-4">
<span className="inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-[#0F766E]">check_circle</span>
                                        Payment Release
                                    </span>
</td>
<td className="px-6 py-4 text-right font-semibold text-[#334155]">
                                    $1,200.00
                                </td>
<td className="px-6 py-4 text-center">
<span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] font-label-caps text-[10px] uppercase border border-[#A7F3D0]">Completed</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#FFFFFF] flex justify-center">
<button className="text-[#0F766E] hover:text-[#0F766E] font-body-sm font-semibold transition-colors">Load More Transactions</button>
</div>
</section>
</main>
  );
}
