import React from 'react';

export default function FreelancerDashboard() {
  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-0 flex flex-col">
{/*  TopNavBar  */}
<header className="fixed top-0 left-0 md:left-64 right-0 z-30 flex justify-between items-center h-16 px-gutter bg-surface dark:bg-inverse-surface shadow-sm border-b-0 max-w-container-max mx-auto w-full transition-all text-primary dark:text-inverse-primary font-body-base text-body-base">
<div className="flex items-center flex-1">
<div className="font-headline-2xl text-headline-2xl font-bold text-primary dark:text-inverse-primary mr-8 md:hidden">FJMS</div>
{/*  Search  */}
<div className="hidden md:flex relative w-96">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-sm" placeholder="Search projects, messages..." type="text"/>
</div>
</div>
{/*  Navigation Links & Actions  */}
<div className="flex items-center space-x-6">
<nav className="hidden lg:flex space-x-6">
<a className="text-on-surface-variant dark:text-surface-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200 py-4 border-b-2 border-transparent" href="#">Marketplace</a>
<a className="text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary pb-1 py-4 hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">Find Work</a>
<a className="text-on-surface-variant dark:text-surface-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200 py-4 border-b-2 border-transparent" href="#">Solutions</a>
</nav>
<div className="flex items-center space-x-4 ml-6 pl-6 border-l border-outline-variant">
<button className="hidden md:block px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-lg text-sm font-medium hover:shadow-level-1 transition-all">Switch Role</button>
<button className="hidden md:block bg-gradient-to-r from-[#1E293B] to-[#334155] hover:ring-2 hover:ring-[#0F766E]/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">Post Project</button>
<div className="flex space-x-3 text-on-surface-variant">
<button className="hover:text-primary transition-colors relative"><span className="material-symbols-outlined">notifications</span><span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span></button>
<button className="hover:text-primary transition-colors hidden sm:block"><span className="material-symbols-outlined">account_balance_wallet</span></button>
<button className="hover:text-primary transition-colors hidden sm:block"><span className="material-symbols-outlined">mail</span></button>
</div>
</div>
</div>
</header>
{/*  Dashboard Content Canvas  */}
<div className="pt-24 px-gutter pb-12 max-w-container-max mx-auto w-full flex-1">
{/*  Welcome Section  */}
<section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
<div>
<h1 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Welcome back, Freelancer Name!</h1>
<p className="text-on-surface-variant text-lg">Here's what's happening with your freelance business today.</p>
</div>
<div className="mt-4 md:mt-0 flex items-center bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg shadow-level-1">
<span className="text-sm font-medium mr-3">Profile Completion</span>
<div className="w-32 bg-surface-container-low rounded-full h-2.5">
<div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "85%" }}></div>
</div>
<span className="text-sm font-bold ml-3 text-primary">85%</span>
</div>
</section>
{/*  Metrics Bento Grid  */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
{/*  Metric 1  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">work_history</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">4</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Active Projects</p>
</div>
{/*  Metric 2  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">description</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">12</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Submitted Proposals</p>
</div>
{/*  Metric 3  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-primary-container">
<span className="material-symbols-outlined">account_balance_wallet</span>
</div>
<span className="text-xs font-bold text-primary-container bg-[#F0FDF4] px-2 py-1 rounded-full">+14% this month</span>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">$4,250.00</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Total Earnings (Wallet)</p>
</div>
{/*  Metric 4  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">mail</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">3</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Unread Messages</p>
</div>
</section>
{/*  Main Split Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Active Projects (Col Span 2)  */}
<section className="lg:col-span-2 space-y-6">
<div className="flex justify-between items-center mb-2">
<h2 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Active Projects</h2>
<a className="text-sm font-medium text-primary hover:underline" href="#">View all</a>
</div>
{/*  Project Card 1  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 flex items-center space-x-2">
<span className="bg-[#F1F5F9] text-[#475569] text-xs font-bold px-2 py-1 rounded-full flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1">sync</span> In Progress
                            </span>
</div>
<h3 className="text-lg font-bold text-[#1E293B] mb-2 pr-24">UX/UI Design for FinTech Dashboard</h3>
<p className="text-sm text-on-surface-variant mb-4">Client: Acme Financial Corp.</p>
<div className="flex flex-wrap gap-4 mb-6">
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">payments</span>
<span className="font-medium">$3,500</span>
</div>
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
<span>Due: Oct 15, 2024</span>
</div>
</div>
<div className="w-full bg-surface-container-low rounded-full h-1.5 mb-2">
<div className="bg-[#1D4ED8] h-1.5 rounded-full" style={{ "width": "60%" }}></div>
</div>
<div className="flex justify-between text-xs text-on-surface-variant">
<span>Milestone 2/3</span>
<span>60% Complete</span>
</div>
</div>
{/*  Project Card 2  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 flex items-center space-x-2">
<span className="bg-[#F1F5F9] text-[#475569] text-xs font-bold px-2 py-1 rounded-full flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1">pending_actions</span> Under Review
                           </span>
</div>
<h3 className="text-lg font-bold text-[#1E293B] mb-2 pr-24">E-commerce Mobile App Development</h3>
<p className="text-sm text-on-surface-variant mb-4">Client: RetailNow LLC</p>
<div className="flex flex-wrap gap-4 mb-6">
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">payments</span>
<span className="font-medium">$5,200</span>
</div>
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
<span>Due: Nov 01, 2024</span>
</div>
</div>
<div className="w-full bg-surface-container-low rounded-full h-1.5 mb-2">
<div className="bg-[#B45309] h-1.5 rounded-full" style={{ "width": "95%" }}></div>
</div>
<div className="flex justify-between text-xs text-on-surface-variant">
<span>Final Review</span>
<span>95% Complete</span>
</div>
</div>
</section>
{/*  Sidebar / Recent Messages (Col Span 1)  */}
<section className="space-y-6">
<div className="flex justify-between items-center mb-2">
<h2 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Recent Messages</h2>
<a className="text-sm font-medium text-primary hover:underline" href="#">View inbox</a>
</div>
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
{/*  Message 1  */}
<div className="p-4 border-b border-[#E2E8F0] hover:bg-surface-container-low cursor-pointer transition-colors relative">
<div className="absolute top-4 right-4 w-2 h-2 bg-primary-container rounded-full"></div>
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
                                    A
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">Acme Financial</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5 font-medium text-on-background">Can we review the latest wireframes?</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">10 mins ago</span>
</div>
</div>
</div>
{/*  Message 2  */}
<div className="p-4 border-b border-[#E2E8F0] hover:bg-surface-container-low cursor-pointer transition-colors">
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold flex-shrink-0">
                                    R
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">RetailNow LLC</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5">Payment for milestone 1 has been released.</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">2 hours ago</span>
</div>
</div>
</div>
{/*  Message 3  */}
<div className="p-4 hover:bg-surface-container-low cursor-pointer transition-colors relative">
<div className="absolute top-4 right-4 w-2 h-2 bg-primary-container rounded-full"></div>
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold flex-shrink-0">
                                    S
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">Sarah Jenkins</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5 font-medium text-on-background">New opportunity matching your skills.</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">Yesterday</span>
</div>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
  );
}
