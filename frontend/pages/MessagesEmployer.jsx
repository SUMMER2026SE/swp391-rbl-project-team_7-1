import React from 'react';

export default function MessagesEmployer() {
  return (
    <main className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
{/*  Left Pane: Conversation List  */}
<section className="w-80 border-r border-[#E2E8F0] bg-[#FFFFFF] flex flex-col shrink-0">
<div className="p-4 border-b border-[#E2E8F0]">
<h2 className="font-headline-xl text-headline-xl text-[#334155] mb-4">Inbox</h2>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-[20px]">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all" placeholder="Search messages..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar">
{/*  Active Chat Item  */}
<div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F8FAFC] cursor-pointer transition-colors relative">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F766E] rounded-r-full"></div>
<div className="flex gap-3">
<div className="relative">
<img alt="Elena Rostova" className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]" data-alt="Professional headshot of a female freelancer with a friendly expression." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0oc8fVlniObATbJnQ0vldPUceIX09x6mKNMNbxlKE7Ebye75GnZfKbEuH4OGKxkO-Va0fbqWVROoEQg8KwkCmmuyMk7ySE14YuxGQ4y-lQdRQW9z-WE6TOe-ns60EQtcIkQvhLJpwmCjXsMWhZcdu6ikFCCFN4lvpV_pYAVHZknVzu_a666wJ4gySWweZAMClQ0E8VAPuv6s9GQj1o5VVU1jKyl3tSkzeWJpNhO6KyUeAwrZfPHzNa5D2WHC1mxm8KEvkVDx1OpI"/>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0F766E] border-2 border-[#FFFFFF] rounded-full"></span>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-1">
<h3 className="font-headline-xl text-[16px] truncate text-[#334155]">Elena Rostova</h3>
<span className="text-label-caps text-[#475569] font-normal">10:42 AM</span>
</div>
<p className="text-body-sm text-[#334155] truncate font-semibold">Here are the final mockups for...</p>
<p className="text-label-caps text-[#0F766E] mt-1 truncate font-normal">Mobile App Development</p>
</div>
</div>
</div>
{/*  Inactive Chat Items  */}
<div className="p-4 border-b border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
<div className="flex gap-3">
<div className="relative">
<div className="w-12 h-12 rounded-full bg-[#E2E8F0] text-[#334155] flex items-center justify-center font-bold text-lg border border-[#E2E8F0]">DM</div>
<span className="absolute bottom-0 right-0 w-3 h-3 bg-[#E2E8F0] border-2 border-[#FFFFFF] rounded-full"></span>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-1">
<h3 className="font-headline-xl text-[16px] truncate text-[#334155]">David M.</h3>
<span className="text-label-caps text-[#475569] font-normal">Yesterday</span>
</div>
<p className="text-body-sm text-[#475569] truncate">I'll have the backend ready by Friday.</p>
<p className="text-label-caps text-[#475569] mt-1 truncate font-normal">API Integration Project</p>
</div>
</div>
</div>
<div className="p-4 border-b border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
<div className="flex gap-3">
<div className="relative">
<img alt="Sarah J." className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]" data-alt="Headshot of a male freelancer looking professional." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLDhz32rAlCnYbUCNRGXbRk1_PZMTlkRPCT4Lzmv544PEV0p4J19FgT7e4GaKlB9yecWQY_gP3KMU87ICr8bTcK-JfXHGT8n6AZ5DXqGIaL0o2sDQcd1WVkeCuiF14-Cmh34waEQpEIJSlnDLk5VFQ8OhZRsI64ZmX0JJRrRNSCbCg1wlyUeZ1Exeu5JFGtZmI-mN7vMKi22p_w571jLIHrtH4nHVrVuEe58cABSCxOi_XDi4kkUSC3Opc5jQPLRksBB88N07V58E"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-1">
<h3 className="font-headline-xl text-[16px] truncate text-[#334155]">Marcus L.</h3>
<span className="text-label-caps text-[#475569] font-normal">Mon</span>
</div>
<p className="text-body-sm text-[#475569] truncate">Thanks for the quick payment!</p>
<p className="text-label-caps text-[#475569] mt-1 truncate font-normal">Copywriting - Landing Page</p>
</div>
</div>
</div>
</div>
</section>
{/*  Right Pane: Active Chat  */}
<section className="flex-1 flex flex-col bg-[#F8FAFC] relative">
{/*  Chat Header  */}
<div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#FFFFFF] z-10 shadow-sm">
<div className="flex items-center gap-4">
<img alt="Elena Rostova" className="w-14 h-14 rounded-full object-cover border-2 border-[#F8FAFC]" data-alt="Professional headshot of a female freelancer with a friendly expression." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE2raFfqmy6Juko2qDOtxwTGXV0qlf3V-yOJnOIZntaGQWS3t0aff1HoA2BfOFSuY_ugCzBnzGDQSKh_WD0fUreGOwCn8aPrdIbupjPWHArIuaUfc1G_BNl0i77zFgZPqQXEKkjcqetHm_mpQPyeqxyOEjkSyj-goZh8yeI-8O8AmEBsJWUp-Mo--73YQJRa6xa79ZZI-6JmRHpDwvn4leI3QB2keRJv2vp9JFlnddLbblTSkn5EGlFaVTAUJpVLyu7ETvmv2JvB0"/>
<div>
<div className="flex items-center gap-2 mb-1">
<h2 className="font-headline-xl text-headline-xl text-[#334155]">Elena Rostova</h2>
<span className="bg-[#F8FAFC] text-[#0F766E] px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border border-[#E2E8F0] flex items-center gap-1">
<span className="material-symbols-outlined text-[12px]" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
                                    Verified Pro
                                </span>
</div>
<div className="flex items-center gap-3 text-body-sm text-[#475569]">
<span>Mobile App Development</span>
<span className="w-1 h-1 rounded-full bg-[#E2E8F0]"></span>
<span className="flex items-center gap-1 text-[#0F766E]"><span className="w-2 h-2 rounded-full bg-[#0F766E]"></span> Online</span>
</div>
</div>
</div>
<div className="flex gap-3">
<button className="px-4 py-2 bg-[#FFFFFF] border border-[#E2E8F0] text-[#334155] rounded-lg font-body-sm hover:bg-[#F8FAFC] hover:text-[#0F766E] transition-colors shadow-sm active:scale-95 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">visibility</span>
                            View Proposal
                        </button>
<button className="p-2 text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F766E] rounded-lg border border-transparent hover:border-[#E2E8F0] transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
{/*  Chat History Area  */}
<div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#F8FAFC] flex flex-col">
{/*  Date Divider  */}
<div className="flex justify-center my-4">
<span className="bg-[#F8FAFC] text-[#475569] text-label-caps px-3 py-1 rounded-full border border-[#E2E8F0]">Today</span>
</div>
{/*  Client Message  */}
<div className="flex gap-4 max-w-2xl self-end">
<div className="bg-[#0F766E] text-white rounded-2xl rounded-tr-none p-4 shadow-[0_2px_12px_rgba(15,23,42,0.015)] border border-[#0F766E]/20">
<p className="text-body-base leading-relaxed">Hi Elena, how are the mockups coming along? We're hoping to present them to the stakeholders tomorrow afternoon.</p>
<span className="text-label-caps text-white/70 block mt-2 text-right">09:15 AM</span>
</div>
</div>
{/*  Freelancer Message  */}
<div className="flex gap-4 max-w-2xl">
<img alt="Elena" className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0] shrink-0" data-alt="Professional headshot of a female freelancer with a friendly expression." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvEZY4fq9ayyA44ey7BaP_lX7s8vAkDWQxuMfQnbyMMrC7ZsPFrcODZ3ES7H7q6oLbgEQk9lgvWARYiORSnDHve1GBYdC7cHi8JI1Vi9tS3WeoIAoy6pdGXXhh9kP9hxdBiRxUmvSOPa6oNLHsgkP76uQwV40GtJhpRSkHtBuAkUq3cis4MbKcOoicI5ErLPc0YCeE_uQW8HWZmsYYQtUtekRYMnw8FXXr0RR_8fO1h-rWwLKa1CF9cEN_NZra3nkY2ExQ8h3m8hQ"/>
<div className="space-y-2">
<div className="bg-[#FFFFFF] text-[#334155] rounded-2xl rounded-tl-none p-4 shadow-[0_2px_12px_rgba(15,23,42,0.015)] border border-[#E2E8F0]">
<p className="text-body-base leading-relaxed mb-3">Hi! They are ready. I've refined the color palette as we discussed and ensured the touch targets are optimized for mobile. Let me know your thoughts!</p>
{/*  File Attachment  */}
<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 flex items-center gap-4 hover:bg-[#F8FAFC] transition-colors group cursor-pointer">
<div className="w-10 h-10 bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center rounded-lg shrink-0">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>folder_zip</span>
</div>
<div className="flex-1 min-w-0">
<p className="text-body-sm font-semibold text-[#334155] truncate group-hover:text-[#0F766E] transition-colors">Final_Mockups_V1.zip</p>
<p className="text-label-caps text-[#475569]">24.5 MB • ZIP Archive</p>
</div>
<button className="p-2 text-[#475569] group-hover:text-[#0F766E] transition-colors rounded-full hover:bg-[#E2E8F0]">
<span className="material-symbols-outlined">download</span>
</button>
</div>
<span className="text-label-caps text-[#475569] block mt-2">10:42 AM</span>
</div>
</div>
</div>
</div>
{/*  Message Input Area  */}
<div className="p-4 bg-[#FFFFFF] border-t border-[#E2E8F0] z-10 shadow-[0_-4px_20px_rgba(15,23,42,0.02)]">
{/*  Quick Replies  */}
<div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1">
<button className="whitespace-nowrap px-4 py-1.5 bg-[#F8FAFC] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0F766E] border border-[#E2E8F0] rounded-full text-body-sm transition-colors active:scale-95">
                            Looks great!
                        </button>
<button className="whitespace-nowrap px-4 py-1.5 bg-[#F8FAFC] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0F766E] border border-[#E2E8F0] rounded-full text-body-sm transition-colors active:scale-95">
                            Can we adjust the colors?
                        </button>
<button className="whitespace-nowrap px-4 py-1.5 bg-[#F8FAFC] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0F766E] border border-[#E2E8F0] rounded-full text-body-sm transition-colors active:scale-95">
                            When can we hop on a call?
                        </button>
</div>
{/*  Input Box  */}
<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-end gap-2 p-2 focus-within:ring-2 focus-within:ring-[#0F766E] focus-within:border-transparent transition-all shadow-sm">
<button className="p-2 text-[#475569] hover:text-[#0F766E] hover:bg-[#E2E8F0] rounded-lg transition-colors shrink-0 mb-0.5">
<span className="material-symbols-outlined">attach_file</span>
</button>
<textarea className="flex-1 bg-transparent border-none text-body-base text-[#334155] focus:ring-0 resize-none py-2 max-h-32 custom-scrollbar" placeholder="Type a message..." rows="1"></textarea>
<button className="p-2 text-[#475569] hover:text-[#0F766E] hover:bg-[#E2E8F0] rounded-lg transition-colors shrink-0 mb-0.5">
<span className="material-symbols-outlined">mood</span>
</button>
<button className="p-2 bg-[#0F766E] text-white hover:bg-[#0F766E]/90 rounded-lg transition-colors shrink-0 mb-0.5 shadow-sm active:scale-95">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
</button>
</div>
</div>
{/*  Floating Assistant Widget (Absolute positioned within Right Pane)  */}
<div className="absolute right-6 top-24 w-72 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden flex flex-col z-20 backdrop-blur-md bg-opacity-95">
<div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex items-center gap-2">
<span className="material-symbols-outlined text-[#0F766E]">smart_toy</span>
<span className="font-headline-xl text-[14px] text-[#334155]">FJMS Assistant</span>
</div>
<div className="p-4 bg-[#FFFFFF]">
<p className="text-body-sm text-[#475569] mb-4 leading-relaxed">
                            Elena just shared the mockups. Would you like to fund the next milestone of <strong className="text-[#0F766E]">$1,200.00</strong> in VNPay Escrow?
                        </p>
<div className="flex gap-2">
<button className="flex-1 bg-[#0F766E] text-white py-2 rounded-lg text-body-sm font-semibold hover:bg-[#0F766E]/90 transition-colors shadow-sm active:scale-95 text-center">
                                Fund Escrow
                            </button>
<button className="px-3 py-2 bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] rounded-lg text-body-sm hover:bg-[#E2E8F0] hover:text-[#0F766E] transition-colors active:scale-95">
                                Dismiss
                            </button>
</div>
</div>
</div>
</section>
</main>
  );
}
