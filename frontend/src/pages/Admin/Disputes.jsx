import React from 'react';

export default function AdminDisputes() {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
{/*  TopNavBar  */}
<header className="hidden md:flex bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-sm full-width sticky top-0 z-30 h-16 justify-between items-center px-margin-desktop">
<div className="flex items-center gap-6">
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3 text-[#475569]" data-icon="search">search</span>
<input className="pl-10 pr-4 py-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[#475569] font-body-sm w-64 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]" placeholder="Search disputes..." type="text"/>
</div>
<nav className="flex gap-6">
<a className="text-[#475569] hover:text-[#0F766E] transition-colors font-body-base text-body-base" href="#">Analytics</a>
<a className="text-[#475569] hover:text-[#0F766E] transition-colors font-body-base text-body-base" href="#">Audit Logs</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="font-body-sm text-body-sm font-semibold text-[#0F766E] hover:text-[#0F766E] transition-colors border border-[#E2E8F0] rounded-lg px-4 py-2 bg-[#FFFFFF]">
                    System Status
                </button>
<div className="flex gap-2">
<button className="p-2 text-[#475569] hover:text-[#0F766E] hover:bg-[#F8FAFC] rounded-full transition-colors scale-95 hover:scale-100 duration-150">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 text-[#475569] hover:text-[#0F766E] hover:bg-[#F8FAFC] rounded-full transition-colors scale-95 hover:scale-100 duration-150">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</div>
</header>
{/*  Mobile Header (Simplified)  */}
<header className="md:hidden flex items-center justify-between p-margin-mobile bg-[#FFFFFF] border-b border-[#E2E8F0] sticky top-0 z-30 shadow-sm">
<h1 className="font-headline-xl text-headline-xl font-bold text-[#334155]">EliteMarket Admin</h1>
<button className="p-2 text-[#475569]">
<span className="material-symbols-outlined" data-icon="menu">menu</span>
</button>
</header>
{/*  Page Content  */}
<div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex-1">
{/*  Page Title & Trust Mark  */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
<div>
<h2 className="font-headline-2xl text-headline-2xl text-[#334155]">Dispute Resolution</h2>
<p className="font-body-base text-body-base text-[#475569] mt-2">Manage active financial conflicts and escrow releases.</p>
</div>
<div className="flex items-center gap-2 bg-[#F1F5F9] px-4 py-2 rounded-lg border border-[#E2E8F0]">
<span className="material-symbols-outlined text-[#0F766E]" data-icon="verified_user" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>verified_user</span>
<span className="font-label-caps text-label-caps text-[#334155]">Secured by VNPay</span>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Left Column: Active Disputes List  */}
<div className="lg:col-span-4 flex flex-col gap-4">
<h3 className="font-headline-xl text-headline-xl text-[#334155] mb-2">Active Cases</h3>
{/*  Dispute Card: Urgent  */}
<div className="bg-[#FFFFFF] border-l-4 border-l-error border border-y-[#E2E8F0] border-r-[#E2E8F0] rounded-r-lg p-4 ambient-shadow-sm hover-lift cursor-pointer">
<div className="flex justify-between items-start mb-2">
<span className="bg-error-container text-on-error-container font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" data-icon="warning">warning</span> Urgent
                            </span>
<span className="font-body-sm text-body-sm text-[#475569]">10m ago</span>
</div>
<h4 className="font-body-base text-body-base font-semibold text-[#334155]">E-commerce App UI/UX Redesign</h4>
<div className="mt-3 flex justify-between items-end">
<div>
<p className="font-body-sm text-body-sm text-[#475569]">Case #DSP-8892</p>
<p className="font-body-sm text-body-sm font-semibold text-[#0F766E] mt-1">Escrow: $4,500.00</p>
</div>
<span className="material-symbols-outlined text-[#475569]" data-icon="chevron_right">chevron_right</span>
</div>
</div>
{/*  Dispute Card: Standard  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-4 ambient-shadow-sm hover-lift cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
<div className="flex justify-between items-start mb-2">
<span className="bg-[#F1F5F9] text-[#475569] font-label-caps text-label-caps px-2 py-1 rounded-full">Standard</span>
<span className="font-body-sm text-body-sm text-[#475569]">2h ago</span>
</div>
<h4 className="font-body-base text-body-base font-semibold text-[#334155]">Backend API Integration (Node.js)</h4>
<div className="mt-3 flex justify-between items-end">
<div>
<p className="font-body-sm text-body-sm text-[#475569]">Case #DSP-8891</p>
<p className="font-body-sm text-body-sm font-semibold text-[#334155] mt-1">Escrow: $850.00</p>
</div>
<span className="material-symbols-outlined text-[#475569]" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
{/*  Right Column: Detail View  */}
<div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl ambient-shadow-md flex flex-col h-[800px]">
{/*  Detail Header  */}
<div className="p-6 border-b border-[#E2E8F0] flex justify-between items-start bg-[#F8FAFC] rounded-t-xl">
<div>
<div className="flex items-center gap-3 mb-2">
<h3 className="font-headline-xl text-headline-xl text-[#334155]">E-commerce App UI/UX Redesign</h3>
<span className="bg-error-container text-on-error-container font-label-caps text-label-caps px-2 py-1 rounded-full">High Value</span>
</div>
<p className="font-body-sm text-body-sm text-[#475569]">Case #DSP-8892 • Initiated by Employer</p>
</div>
<div className="text-right">
<p className="font-label-caps text-label-caps text-[#475569]">Total Escrow Funds</p>
<p className="font-headline-2xl text-headline-2xl text-[#0F766E] mt-1 font-bold">$4,500.00</p>
</div>
</div>
{/*  Detail Content (Scrollable)  */}
<div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F8FAFC]">
{/*  Timeline  */}
<section>
<h4 className="font-body-base text-body-base font-semibold text-[#334155] mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[#475569]" data-icon="timeline">timeline</span> Project Timeline
                            </h4>
<div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] before:to-transparent">
{/*  Timeline Item  */}
<div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
<div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FFFFFF] bg-[#E2E8F0] text-[#0F766E] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
<span className="material-symbols-outlined text-[20px]" data-icon="check">check</span>
</div>
<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] ambient-shadow-sm">
<div className="flex items-center justify-between mb-1">
<span className="font-body-sm text-body-sm font-semibold text-[#334155]">Milestone 1 Approved</span>
<span className="font-label-caps text-label-caps text-[#475569]">Oct 12</span>
</div>
<p className="font-body-sm text-body-sm text-[#475569]">$1,500 released via VNPay.</p>
</div>
</div>
{/*  Timeline Item  */}
<div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
<div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FFFFFF] bg-error-container text-on-error-container shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
<span className="material-symbols-outlined text-[20px]" data-icon="priority_high">priority_high</span>
</div>
<div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-error border-opacity-30 bg-[#FFFFFF] ambient-shadow-sm">
<div className="flex items-center justify-between mb-1">
<span className="font-body-sm text-body-sm font-semibold text-error">Dispute Filed (Milestone 2)</span>
<span className="font-label-caps text-label-caps text-[#475569]">Oct 24</span>
</div>
<p className="font-body-sm text-body-sm text-[#475569]">Employer claims deliverables do not meet specifications.</p>
</div>
</div>
</div>
</section>
{/*  Evidence & Attachments  */}
<section>
<h4 className="font-body-base text-body-base font-semibold text-[#334155] mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-[#475569]" data-icon="attachment">attachment</span> Evidence Attachments
                            </h4>
<div className="grid grid-cols-2 gap-4">
<div className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
<div className="w-10 h-10 bg-[#F1F5F9] rounded flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div className="overflow-hidden">
<p className="font-body-sm text-body-sm font-semibold text-[#334155] truncate">original_brief_v2.pdf</p>
<p className="font-label-caps text-label-caps text-[#475569]">Employer • 2.4 MB</p>
</div>
</div>
<div className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
<div className="w-10 h-10 bg-[#F1F5F9] rounded flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined" data-icon="image">image</span>
</div>
<div className="overflow-hidden">
<p className="font-body-sm text-body-sm font-semibold text-[#334155] truncate">figma_handoff_proof.png</p>
<p className="font-label-caps text-label-caps text-[#475569]">Freelancer • 4.1 MB</p>
</div>
</div>
</div>
</section>
</div>
{/*  Decision Actions Footer  */}
<div className="p-6 border-t border-[#E2E8F0] bg-[#FFFFFF] rounded-b-xl flex flex-wrap gap-4 items-center justify-between">
<p className="font-body-sm text-body-sm text-[#475569] italic w-full md:w-auto mb-2 md:mb-0">
                            Please review all evidence carefully before making a final escrow decision.
                        </p>
<div className="flex gap-3 w-full md:w-auto">
<button className="flex-1 md:flex-none px-6 py-2 bg-[#FFFFFF] border border-[#E2E8F0] text-[#334155] rounded-lg font-body-sm text-body-sm font-semibold hover:bg-[#F8FAFC] hover:text-[#0F766E] transition-colors ambient-shadow-sm flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="call_split">call_split</span> Split Payment
                            </button>
<button className="flex-1 md:flex-none px-6 py-2 bg-error text-on-error rounded-lg font-body-sm text-body-sm font-semibold hover:bg-[#93000a] transition-colors ambient-shadow-sm flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="keyboard_return">keyboard_return</span> Refund Employer
                            </button>
<button className="flex-1 md:flex-none px-6 py-2 bg-gradient-to-b from-[#475569] to-[#526171] text-white rounded-lg font-body-sm text-body-sm font-semibold hover:bg-[#0F766E] hover:from-[#0F766E] hover:to-[#0F766E] transition-colors ambient-shadow-sm flex justify-center items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="payments">payments</span> Release to Freelancer
                            </button>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
