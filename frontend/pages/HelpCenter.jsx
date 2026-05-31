import React from 'react';

export default function HelpCenter() {
  return (
    <main className="pt-28 flex-grow">
{/*  Hero Search Section  */}
<section className="bg-gradient-to-b from-[#475569] to-[#526171] py-16 md:py-24 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden border-b border-slate-200">
{/*  Decorative blur background  */}
<div className="absolute inset-0 pointer-events-none opacity-40">
<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ "animationDelay": "2s" }}></div>
</div>
<div className="max-w-3xl mx-auto relative z-10">
<h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero mb-8 text-slate-800 text-white">How can we help?</h1>
<div className="relative w-full max-w-2xl mx-auto">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="search">search</span>
</div>
<input className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.015)] text-slate-800 focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] text-base placeholder-[#475569]/60 transition-shadow duration-200 ease-in-out" placeholder="Search for articles, topics, or issues..." type="text"/>
<div className="absolute inset-y-0 right-0 pr-2 flex items-center">
<button className="bg-[#0F766E] hover:bg-[#0D635C] text-white px-6 py-2 rounded-2xl text-sm font-medium font-semibold transition-colors duration-200">
                            Search
                        </button>
</div>
</div>
<div className="mt-4 flex flex-wrap justify-center gap-2">
<span className="text-sm font-medium text-on-surface-variant">Popular:</span>
<a className="text-sm font-medium text-primary hover:underline px-3 py-1 rounded-full" href="#">Reset Password</a>
<a className="text-sm font-medium text-primary hover:underline px-3 py-1 rounded-full" href="#">Payment Methods</a>
<a className="text-sm font-medium text-primary hover:underline px-3 py-1 rounded-full" href="#">Escrow Disputes</a>
</div>
</div>
</section>
{/*  Category Grid  */}
<section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-gutter">
{/*  Card 1  */}
<a className="block bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover-lift group relative overflow-hidden" href="#">
<div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-300">
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300" data-icon="payments">payments</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2 text-slate-800">Payments &amp; Escrow</h3>
<p className="text-sm font-medium text-on-surface-variant mb-4">Managing billing, invoices, withdrawal methods, and escrow protection rules.</p>
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300">
                        View Topics <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
{/*  Card 2  */}
<a className="block bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover-lift group relative overflow-hidden" href="#">
<div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-300">
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300" data-icon="work">work</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2 text-slate-800">Finding Work</h3>
<p className="text-sm font-medium text-on-surface-variant mb-4">Optimizing your profile, submitting proposals, and navigating the job feed.</p>
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300">
                        View Topics <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
{/*  Card 3  */}
<a className="block bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover-lift group relative overflow-hidden" href="#">
<div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-300">
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300" data-icon="person_search">person_search</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2 text-slate-800">Hiring Talent</h3>
<p className="text-sm font-medium text-on-surface-variant mb-4">Posting jobs, evaluating candidates, and managing contracts effectively.</p>
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300">
                        View Topics <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
{/*  Card 4  */}
<a className="block bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover-lift group relative overflow-hidden" href="#">
<div className="flex items-start justify-between">
<div>
<div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-300">
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300" data-icon="security">security</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2 text-slate-800">Account Security</h3>
<p className="text-sm font-medium text-on-surface-variant mb-4 max-w-md">Two-factor authentication, identity verification, password management, and securing your personal data.</p>
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300">
                                View Topics <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</div>
<div className="hidden md:block w-32 h-32 opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[128px] text-on-surface" data-icon="shield">shield</span>
</div>
</div>
</a>
{/*  Card 5  */}
<a className="block bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover-lift group relative overflow-hidden" href="#">
<div className="absolute top-0 right-0 mt-4 mr-4 bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">Priority</div>
<div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0F766E] transition-colors duration-300">
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300" data-icon="verified_user">verified_user</span>
</div>
<h3 className="text-lg font-bold text-on-surface mb-2 text-slate-800">Trust &amp; Safety</h3>
<p className="text-sm font-medium text-on-surface-variant mb-4">Community guidelines, reporting suspicious activity, and platform policies.</p>
<span className="material-symbols-outlined text-[#0F766E] group-hover:text-white transition-colors duration-300">
                        View Topics <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</span>
</a>
</div>
</section>
{/*  Trending Articles Section  */}
<section className="bg-surface-container-low py-16 px-margin-mobile md:px-margin-desktop border-t border-outline-variant">
<div className="max-w-container-max mx-auto">
<div className="flex items-center justify-between mb-8">
<h2 className="text-2xl font-bold text-on-surface text-slate-800">Trending Articles</h2>
<a className="text-base hover:underline hidden md:block" href="#">View all articles</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/*  Article List  */}
<div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<ul className="space-y-6">
<li className="flex items-start gap-4 group">
<span className="material-symbols-outlined text-outline-variant mt-1" data-icon="article">article</span>
<div>
<a className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors text-base mb-1 block text-slate-800" href="#">How to verify your identity</a>
<p className="text-sm font-medium text-on-surface-variant">Step-by-step guide for completing the mandatory ID verification process.</p>
</div>
</li>
<li className="flex items-start gap-4 group">
<span className="material-symbols-outlined text-outline-variant mt-1" data-icon="article">article</span>
<div>
<a className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors text-base mb-1 block text-slate-800" href="#">Understanding fixed-price contracts</a>
<p className="text-sm font-medium text-on-surface-variant">Learn how milestones and escrow deposits work for project-based jobs.</p>
</div>
</li>
<li className="flex items-start gap-4 group">
<span className="material-symbols-outlined text-outline-variant mt-1" data-icon="article">article</span>
<div>
<a className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors text-base mb-1 block text-slate-800" href="#">Troubleshooting payment withdrawals</a>
<p className="text-sm font-medium text-on-surface-variant">Common reasons why bank transfers might fail and how to fix them.</p>
</div>
</li>
</ul>
</div>
{/*  Contact Support Callout  */}
<div className="bg-[#0F766E] text-white rounded-2xl p-8 flex flex-col justify-center items-start shadow-[0_4px_20px_rgba(15,23,42,0.03)] relative overflow-hidden">
<div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[200px]" data-icon="support_agent">support_agent</span>
</div>
<h3 className="text-2xl font-bold mb-4 relative z-10 text-slate-800">Still need help?</h3>
<p className="text-base mb-8 relative z-10 opacity-90 max-w-sm">Our premium support team is available 24/7 to assist you with complex issues.</p>
<button className="bg-white text-[#0F766E] px-6 py-3 rounded-2xl text-base font-semibold hover:bg-slate-50 transition-colors relative z-10 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="chat">chat</span> Open a Ticket
                        </button>
</div>
</div>
</div>
</section>
</main>
  );
}
