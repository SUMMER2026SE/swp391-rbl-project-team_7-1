import React from 'react';

export default function EmployerDashboard() {
  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-0">
{/*  TopNavBar (Web)  */}
<header className="hidden md:flex fixed top-0 left-64 right-0 h-16 z-30 bg-white border-b border-[#E2E8F0] justify-between items-center px-margin-desktop shadow-sm">
<div className="flex items-center gap-8">
{/*  Search could go here  */}
</div>
<div className="flex items-center gap-6">
<nav className="flex items-center gap-6">
<a className="font-body-base text-body-base text-[#475569] font-medium hover:text-[#0F766E] transition-colors duration-200" href="#">Marketplace</a>
<a className="font-body-base text-body-base text-[#475569] font-medium hover:text-[#0F766E] transition-colors duration-200" href="#">Solutions</a>
</nav>
<div className="h-6 w-px bg-outline-variant"></div>
<div className="flex items-center gap-4">
<button className="text-[#475569] hover:text-[#0F766E] transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-[#475569] hover:text-[#0F766E] transition-colors">
<span className="material-symbols-outlined">mail</span>
</button>
</div>
<button className="px-4 py-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg font-body-sm text-body-sm text-[#475569] hover:bg-white hover:text-[#1E293B] transition-all">
                    Switch to Freelancer
                </button>
</div>
</header>
{/*  Canvas  */}
<div className="pt-20 md:pt-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
{/*  Header  */}
<div className="mb-8">
<h1 className="font-display-hero text-display-hero text-[#1E293B] mb-2">Manage your Projects &amp; Hires.</h1>
<p className="font-body-base text-body-base text-[#475569]">Here is a summary of your active engagements and pending items.</p>
</div>
{/*  Key Metrics Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">post_add</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Total Projects</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">12</p>
<p className="font-body-sm text-body-sm text-[#0F766E] mt-2">+2 this month</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">group</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Active Hires</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">5</p>
<p className="font-body-base text-body-base text-[#475569]">Working on 3 projects</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Pending Proposals</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">18</p>
<p className="font-body-base text-body-base text-[#475569]">Needs review</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">account_balance</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Escrow Funds</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">$4,500</p>
<div className="flex items-center gap-2 mt-2">
<span className="material-symbols-outlined text-[14px] text-[#0F766E]">verified_user</span>
<p className="font-body-sm text-body-sm text-[#0F766E]">Secured by VNPay</p>
</div>
</div>
</div>
</div>
</main>
  );
}
