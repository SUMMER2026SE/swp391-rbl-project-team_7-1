import React from 'react';
import { Link } from 'react-router-dom';

export default function FreelancerDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Stat Card 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-[24px]">send</span>
              </div>
              <span className="font-label-sm text-label-sm font-semibold text-slate-600 px-2.5 py-1 bg-slate-100 rounded-md">+2 this week</span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-slate-800 font-bold">12</div>
              <div className="font-label-md text-label-md text-slate-500 font-medium">Active Proposals</div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-teal-50 w-12 h-12 rounded-xl text-[#0F766E] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-[24px]">handshake</span>
              </div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-slate-800 font-bold">4</div>
              <div className="font-label-md text-label-md text-slate-500 font-medium">Accepted Projects</div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(15,118,110,0.08)] group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-50 w-12 h-12 rounded-xl text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
              </div>
              <span className="font-label-sm text-label-sm text-emerald-700 font-semibold px-2.5 py-1 bg-emerald-100 rounded-md">+14% vs last month</span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-slate-800 font-bold">100M đ</div>
              <div className="font-label-md text-label-md text-slate-500 font-medium">Wallet Balance</div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-gradient-to-br from-[#0F766E] to-[#042F2E] border border-teal-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_24px_rgba(15,118,110,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="bg-white/20 w-12 h-12 rounded-xl text-white flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <span className="material-symbols-outlined text-amber-300 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="font-label-sm text-label-sm text-amber-300 font-bold px-2.5 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">Top Rated</span>
            </div>
            <div className="relative z-10">
              <div className="font-headline-lg text-headline-lg font-bold">4.9/5</div>
              <div className="font-label-md text-label-md text-teal-100 mt-1">Average Rating (42 reviews)</div>
            </div>
          </div>

        </section>

      </main>

      {/* Floating AI Chatbox Support Button */}
      <button
        onClick={() => alert('AI Support Chat is under construction!')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">support_agent</span>
      </button>

    </div>
  );
}
