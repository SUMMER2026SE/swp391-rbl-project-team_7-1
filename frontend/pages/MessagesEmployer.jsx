import React from 'react';

export default function MessagesEmployer() {
  return (
    <main className="flex-1 flex overflow-hidden bg-slate-50">
      {/*  Left Pane: Conversation List  */}
      <section className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-teal-950 mb-4 tracking-tight">Inbox</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all font-medium text-slate-700" placeholder="Search messages..." type="text"/>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/*  Active Chat Item  */}
          <div className="p-5 border-b border-slate-100 bg-teal-50/50 hover:bg-teal-50 cursor-pointer transition-colors relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r-full"></div>
            <div className="flex gap-4">
              <div className="relative">
                <img alt="Elena Rostova" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0oc8fVlniObATbJnQ0vldPUceIX09x6mKNMNbxlKE7Ebye75GnZfKbEuH4OGKxkO-Va0fbqWVROoEQg8KwkCmmuyMk7ySE14YuxGQ4y-lQdRQW9z-WE6TOe-ns60EQtcIkQvhLJpwmCjXsMWhZcdu6ikFCCFN4lvpV_pYAVHZknVzu_a666wJ4gySWweZAMClQ0E8VAPuv6s9GQj1o5VVU1jKyl3tSkzeWJpNhO6KyUeAwrZfPHzNa5D2WHC1mxm8KEvkVDx1OpI"/>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold truncate text-teal-950">Elena Rostova</h3>
                  <span className="text-xs text-slate-400 font-medium">10:42 AM</span>
                </div>
                <p className="text-sm text-slate-700 truncate font-semibold">Here are the final mockups for...</p>
                <p className="text-xs text-teal-700 mt-1.5 truncate font-medium bg-white px-2 py-0.5 rounded border border-teal-100 w-fit">Mobile App Development</p>
              </div>
            </div>
          </div>
          {/*  Inactive Chat Items  */}
          <div className="p-5 border-b border-slate-100 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg border border-slate-200 shadow-sm">DM</div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold truncate text-slate-800">David M.</h3>
                  <span className="text-xs text-slate-400 font-medium">Yesterday</span>
                </div>
                <p className="text-sm text-slate-500 truncate">I'll have the backend ready by Friday.</p>
                <p className="text-xs text-slate-500 mt-1.5 truncate font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 w-fit">API Integration Project</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/*  Right Pane: Active Chat  */}
      <section className="flex-1 flex flex-col bg-slate-50 relative">
        {/*  Chat Header  */}
        <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white z-10 shadow-sm">
          <div className="flex items-center gap-5">
            <img alt="Elena Rostova" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE2raFfqmy6Juko2qDOtxwTGXV0qlf3V-yOJnOIZntaGQWS3t0aff1HoA2BfOFSuY_ugCzBnzGDQSKh_WD0fUreGOwCn8aPrdIbupjPWHArIuaUfc1G_BNl0i77zFgZPqQXEKkjcqetHm_mpQPyeqxyOEjkSyj-goZh8yeI-8O8AmEBsJWUp-Mo--73YQJRa6xa79ZZI-6JmRHpDwvn4leI3QB2keRJv2vp9JFlnddLbblTSkn5EGlFaVTAUJpVLyu7ETvmv2JvB0"/>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-teal-950 tracking-tight">Elena Rostova</h2>
                <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-teal-100/50 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
                  Verified Pro
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span>Mobile App Development</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1.5 text-teal-600"><span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span> Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-teal-700 transition-all shadow-sm active:scale-[0.98] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              View Proposal
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-teal-700 rounded-xl border border-transparent transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        
        {/*  Chat History Area  */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50 flex flex-col">
          {/*  Date Divider  */}
          <div className="flex justify-center my-4">
            <span className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">Today</span>
          </div>
          
          {/*  Client Message  */}
          <div className="flex gap-4 max-w-2xl self-end">
            <div className="bg-[#0F766E] text-white rounded-2xl rounded-tr-sm p-5 shadow-sm border border-teal-800">
              <p className="text-base leading-relaxed">Hi Elena, how are the mockups coming along? We're hoping to present them to the stakeholders tomorrow afternoon.</p>
              <span className="text-xs text-teal-100 block mt-2 text-right font-medium">09:15 AM</span>
            </div>
          </div>
          
          {/*  Freelancer Message  */}
          <div className="flex gap-4 max-w-2xl">
            <img alt="Elena" className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvEZY4fq9ayyA44ey7BaP_lX7s8vAkDWQxuMfQnbyMMrC7ZsPFrcODZ3ES7H7q6oLbgEQk9lgvWARYiORSnDHve1GBYdC7cHi8JI1Vi9tS3WeoIAoy6pdGXXhh9kP9hxdBiRxUmvSOPa6oNLHsgkP76uQwV40GtJhpRSkHtBuAkUq3cis4MbKcOoicI5ErLPc0YCeE_uQW8HWZmsYYQtUtekRYMnw8FXXr0RR_8fO1h-rWwLKa1CF9cEN_NZra3nkY2ExQ8h3m8hQ"/>
            <div className="space-y-2">
              <div className="bg-white text-slate-700 rounded-2xl rounded-tl-sm p-5 shadow-sm border border-slate-200">
                <p className="text-base leading-relaxed mb-4">Hi! They are ready. I've refined the color palette as we discussed and ensured the touch targets are optimized for mobile. Let me know your thoughts!</p>
                {/*  File Attachment  */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-4 hover:bg-slate-100 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 flex items-center justify-center rounded-lg shrink-0 border border-teal-100">
                    <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>folder_zip</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-teal-700 transition-colors">Final_Mockups_V1.zip</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">24.5 MB • ZIP Archive</p>
                  </div>
                  <button className="p-2 text-slate-400 group-hover:text-teal-600 transition-colors rounded-full hover:bg-slate-200">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </div>
                <span className="text-xs text-slate-400 block mt-3 font-medium">10:42 AM</span>
              </div>
            </div>
          </div>
        </div>
        
        {/*  Message Input Area  */}
        <div className="p-5 bg-white border-t border-slate-200 z-10 shadow-[0_-4px_20px_rgba(15,23,42,0.02)]">
          {/*  Quick Replies  */}
          <div className="flex gap-3 mb-4 overflow-x-auto custom-scrollbar pb-2">
            <button className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 rounded-full text-sm font-semibold transition-all active:scale-[0.98]">
              Looks great!
            </button>
            <button className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 rounded-full text-sm font-semibold transition-all active:scale-[0.98]">
              Can we adjust the colors?
            </button>
            <button className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-slate-200 rounded-full text-sm font-semibold transition-all active:scale-[0.98]">
              When can we hop on a call?
            </button>
          </div>
          {/*  Input Box  */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl flex items-end gap-2 p-2 focus-within:ring-2 focus-within:ring-teal-600/20 focus-within:border-teal-600 transition-all shadow-sm">
            <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0 mb-0.5">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea className="flex-1 bg-transparent border-none text-base text-slate-700 focus:ring-0 resize-none py-3 font-medium max-h-32 custom-scrollbar" placeholder="Type a message..." rows="1"></textarea>
            <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0 mb-0.5">
              <span className="material-symbols-outlined">mood</span>
            </button>
            <button className="p-2.5 bg-[#0F766E] text-white hover:bg-[#0D5E58] rounded-xl transition-all shrink-0 mb-0.5 shadow-sm active:scale-[0.98]">
              <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
        
        {/*  Floating Assistant Widget  */}
        <div className="absolute right-8 top-24 w-80 bg-white/95 border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex flex-col z-20 backdrop-blur-md">
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">smart_toy</span>
            <span className="font-bold text-sm text-slate-800 tracking-tight">FJMS Assistant</span>
          </div>
          <div className="p-5 bg-white">
            <p className="text-sm text-slate-600 mb-5 leading-relaxed font-medium">
              Elena just shared the mockups. Would you like to fund the next milestone of <strong className="text-teal-700">$1,200.00</strong> in VNPay Escrow?
            </p>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#0F766E] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#0D5E58] transition-all shadow-sm active:scale-[0.98] text-center">
                Fund Escrow
              </button>
              <button className="px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98]">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
