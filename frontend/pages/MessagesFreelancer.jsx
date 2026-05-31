import React from 'react';

export default function MessagesFreelancer() {
  return (
    <main className="ml-64 flex-1 h-full flex flex-col bg-[#F8FAFC]">
{/*  TopNavBar  */}
<header className="h-16 flex items-center justify-between px-margin-desktop bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] shrink-0">
<div className="flex items-center gap-4">
<h1 className="font-headline-2xl text-headline-2xl text-[#334155]">Inbox</h1>
</div>
<div className="flex items-center gap-6">
<nav className="hidden lg:flex items-center gap-6">
<a className="text-[#475569] hover:text-[#0F766E] transition-colors duration-200 font-body-base text-body-base" href="#">Find Work</a>
<a className="text-[#475569] hover:text-[#0F766E] transition-colors duration-200 font-body-base text-body-base" href="#">My Jobs</a>
<a className="text-[#475569] hover:text-[#0F766E] transition-colors duration-200 font-body-base text-body-base" href="#">Reports</a>
</nav>
<div className="h-6 w-px bg-[#E2E8F0] mx-2"></div>
<button className="text-[#475569] hover:text-[#0F766E] transition-colors p-2 rounded-full hover:bg-[#F8FAFC] cursor-pointer active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-[#475569] hover:text-[#0F766E] transition-colors p-2 rounded-full hover:bg-[#F8FAFC] cursor-pointer active:scale-95 transition-transform">
<span className="material-symbols-outlined" data-icon="help">help</span>
</button>
<img alt="Freelancer profile photo" className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] cursor-pointer active:scale-95 transition-transform" data-alt="A professional headshot of a confident young woman with dark hair, looking directly at the camera with a subtle smile. She is wearing a tailored modern blazer. The lighting is soft and flattering, typical of high-end corporate portraiture. The background is a clean, slightly warm neutral tone, aligning with a premium, quiet luxury corporate aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgYw0r198ChMP3OoaWKQsloLJNMl2f1hikhn1afq8lvjTHafJjFAonBWpUhQw7vl04EXOuZ9mtv1iKH7arunx2ZaOHS73bfTlfGdaAJrkRsfT7NaYlxEkyBCPhdGy3ldXoo4wIQQNGjQRydmN4gpADhwgdWFlvOxESMcowUUwOFTYO7tqw21wss200W9G-WSrNvurHb-0CPpay3FW7AdHeGnx44l6iHNYX_PWjt7vF4kBdl0FlKU-HS9recPrDew6Kg_yX9NnUGC0"/>
</div>
</header>
{/*  Messages Dual Pane Layout  */}
<div className="flex-1 flex overflow-hidden p-6 gap-6">
{/*  Left Pane: Conversation List  */}
<aside className="w-80 flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden shrink-0">
{/*  Search  */}
<div className="p-4 border-b border-[#E2E8F0]">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] text-lg">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-body-sm text-body-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors" placeholder="Search messages..." type="text"/>
</div>
</div>
{/*  List  */}
<div className="flex-1 overflow-y-auto">
{/*  Active Card  */}
<div className="p-4 border-l-4 border-[#0F766E] bg-[#F8FAFC] hover:bg-[#E2E8F0]/30 transition-colors cursor-pointer border-b border-[#E2E8F0]">
<div className="flex gap-3">
<div className="relative">
<img alt="Marcus Johnson" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently. The lighting is bright and modern, suggesting a high-end corporate environment. The overall aesthetic is clean, professional, and reliable, fitting a premium freelance platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQC38KxfAqaGEdfcmvr6s2tOW5WvMn2n8_dPFIZKH8KCCovQWZkBKme_54X85yrvk0gvQjdRa_BGgWPaP5DGdaDzjPl3dInHkEeGm7nNfpjlAy8quNLi3UztakmtPme5J7e4EnV4mljVId4ejunVyhI_uT2bR_46Hwf-U3n39cjGAMuSFZteeaAmG5HE-XWoXgkfLqGf8kWZ3l_9C0ChuPYbVV6-E7o-EWNnvRMvjCZevmCCeWNkBY37MI1GMR-qXcnoqMj0Y0auE"/>
<div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0F766E] border-2 border-[#F8FAFC] rounded-full"></div>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-0.5">
<h3 className="font-headline-xl text-body-base font-semibold text-[#334155] truncate">Marcus Johnson</h3>
<span className="font-label-caps text-[10px] text-[#0F766E]">10:42 AM</span>
</div>
<div className="font-body-sm text-[12px] text-[#475569] font-medium mb-1 truncate">Enterprise Dashboard Redesign</div>
<p className="font-body-sm text-sm text-[#475569] truncate">That looks great! Can you send over the Figma link?</p>
</div>
</div>
</div>
{/*  Inactive Card 1  */}
<div className="p-4 border-l-4 border-transparent hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#E2E8F0]">
<div className="flex gap-3">
<div className="relative">
<img alt="Sarah Chen" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of an Asian woman in a business casual outfit, looking thoughtfully at the camera. The background is a blurred, modern office setting with bright, natural light. The aesthetic is clean, corporate, and approachable." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3zlubYBZ3hncYtUL1GHSNMo7qa2TvPO1YNZltWJXZbTbEq8k79XmaoyHs53FTbaPB_QRf6yxtAHjvQXjpI6J8b2shVJkImkAmpHZ9_IcTLQjXq89Ivm2pVNtsCoi7uXeMsg9Nd7LiASWrQhb_fX9Y7nDMkbiQSMgNRiBd_ydkAygyZe8QHil6nGfQ2zuoFH_K4oeSSmhS7p85EQkWOJgVBeWd1cjnBWa4r80qk1xGvGqzlvbxsXfleQoA40kz3qGGWT7UBJuC2o"/>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-0.5">
<h3 className="font-headline-xl text-body-base font-semibold text-[#334155] truncate">Sarah Chen</h3>
<span className="font-label-caps text-[10px] text-[#475569]">Yesterday</span>
</div>
<div className="font-body-sm text-[12px] text-[#475569] mb-1 truncate">Fintech Mobile App</div>
<p className="font-body-sm text-sm text-[#475569] truncate">We've approved the latest milestones.</p>
</div>
</div>
</div>
{/*  Inactive Card 2  */}
<div className="p-4 border-l-4 border-transparent hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#E2E8F0]">
<div className="flex gap-3">
<div className="relative">
<div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#334155] font-headline-xl text-body-base font-bold">DR</div>
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-baseline mb-0.5">
<h3 className="font-headline-xl text-body-base font-semibold text-[#334155] truncate">David Rodriguez</h3>
<span className="font-label-caps text-[10px] text-[#475569]">Mon</span>
</div>
<div className="font-body-sm text-[12px] text-[#475569] mb-1 truncate">E-commerce Branding</div>
<p className="font-body-sm text-sm text-[#475569] truncate">Thanks for the update. Let's touch base next week.</p>
</div>
</div>
</div>
</div>
</aside>
{/*  Right Pane: Active Chat Window  */}
<section className="flex-1 flex flex-col bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden relative">
{/*  Chat Header  */}
<div className="h-16 px-6 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-white z-10">
<div className="flex items-center gap-3">
<img alt="Marcus Johnson" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently. The lighting is bright and modern, suggesting a high-end corporate environment. The overall aesthetic is clean, professional, and reliable, fitting a premium freelance platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuRmdH0pmUk4CUFA7GVfdB_QgRHfxgkRBL8gC84oFHuxGkaTBYbQGgaJlnXAnzyu9smaPGQC1O8q5S461ZP2FYyu5HAWCB1184uIluz0IzllNRz-ObM1Ddz2Z5eA-Y1ePqdbCCfM6MMiDyEFFlkXJqIAcZsMWqilWGXBcrDITab2hdPkK9r7lZdVTmXfouQRuciYnlnpUbxzVDZK7lKBlXRB0QVKKm5OM9H3kk-8dq0UM-DpCRtsoIWXi5JIq-EyJXMPhSCFCCBEg"/>
<div>
<h2 className="font-headline-xl text-body-base font-semibold text-[#334155]">Marcus Johnson</h2>
<div className="flex items-center gap-1.5">
<div className="w-2 h-2 bg-[#0F766E] rounded-full"></div>
<span className="font-body-sm text-[12px] text-[#475569]">Online • UI/UX Agency Lead</span>
</div>
</div>
</div>
<button className="bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white border border-transparent font-body-sm text-body-sm font-semibold py-2 px-4 rounded-lg transition-all hover:-translate-y-[1px] hover:shadow-sm">
                        View Project
                    </button>
</div>
{/*  Chat History  */}
<div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F8FAFC]">
{/*  Date Divider  */}
<div className="flex items-center justify-center">
<span className="bg-[#E2E8F0] text-[#475569] font-label-caps text-[10px] px-3 py-1 rounded-full">TODAY</span>
</div>
{/*  Employer Message (Gray)  */}
<div className="flex gap-4 max-w-[80%]">
<img alt="Marcus Johnson" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently. The lighting is bright and modern, suggesting a high-end corporate environment. The overall aesthetic is clean, professional, and reliable, fitting a premium freelance platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8HmHJcnrB-_zZ4oWacG9OTeL65c8Vo_kJc6J_X7O0u97vFVJGDINe9MyCoIizF9E2PioDbKjGwStuC925yCyCe60Ci9hcxAacK5pby7VkBsYZ7DTfDlZOpcWYPAZLcMMm-hR3F4pp6dDi2KTaD05gO_C9u0YrU6F5EEfDB7fLgeLtm0FXBsb5Lw0QBQNelOyFJxxegHiZhR_t7DKZXSMVvzWkSoku9uaWCJyS33fXgfqW4Y7j44UJReky1WDiCrEHWf3D7LTUoY8"/>
<div>
<div className="bg-white border border-[#E2E8F0] text-[#334155] font-body-sm text-body-sm p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                Hi there! I've been reviewing the initial wireframes for the Enterprise Dashboard Redesign.
                            </div>
<div className="font-label-caps text-[10px] text-[#475569] mt-1 ml-1">10:30 AM</div>
</div>
</div>
{/*  Employer Message (Gray)  */}
<div className="flex gap-4 max-w-[80%]">
<div className="w-8 shrink-0"></div> {/*  Spacer for avatar alignment  */}
<div>
<div className="bg-white border border-[#E2E8F0] text-[#334155] font-body-sm text-body-sm p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                The layout is looking really solid. The client specifically asked about the data visualization components on the main view.
                            </div>
<div className="font-label-caps text-[10px] text-[#475569] mt-1 ml-1">10:31 AM</div>
</div>
</div>
{/*  Freelancer Message  */}
<div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
<img alt="Freelancer profile photo" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" data-alt="A professional headshot of a confident young woman with dark hair, looking directly at the camera with a subtle smile. She is wearing a tailored modern blazer. The lighting is soft and flattering, typical of high-end corporate portraiture. The background is a clean, slightly warm neutral tone, aligning with a premium, quiet luxury corporate aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_5AMUepKN2pAFl5jn7PPkFfAYjQ7MXQRxVSmZiXMpKPQTsqycFxkBQd-SogzedBSKPapICapXE6nljrdZWmldR-PGaSsuHpBd_27hSSLGTvzL7LDUIiOL__wJO-3KbAIdg2E9Y8LEVR-VbcWD9EAMtSVi8rFNaK3R6wKov9m3kqF_Aj_CdHEifi51QSk2HEnfOvV-o2Zm-5j2GP3XG5QnPUr0NDBKiaTD7lK8joEasbpkzkgTwGRo36OVaF4mfd0jeiqQwOGsxyw"/>
<div className="flex flex-col items-end">
<div className="bg-[#0F766E] text-white font-body-sm text-body-sm p-4 rounded-2xl rounded-tr-sm shadow-sm">
                                Hello Marcus! Thanks for the feedback. I've focused on keeping those charts as clean as possible, following the new design system we agreed on.
                            </div>
<div className="font-label-caps text-[10px] text-[#475569] mt-1 mr-1">10:38 AM</div>
</div>
</div>
{/*  Employer Message (Gray)  */}
<div className="flex gap-4 max-w-[80%]">
<img alt="Marcus Johnson" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently. The lighting is bright and modern, suggesting a high-end corporate environment. The overall aesthetic is clean, professional, and reliable, fitting a premium freelance platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEPa-D8MLPh62quX1M91kbvpKUsCeXW7Af6gyJWdgSo9r5BtQEt-bHfgQ9Ny8pEKeAbRv2Tx9w8BKuKumqnJSCEGdYYwOaXgWNwq87bXY29itJJr7NxizYdhF8d5hd83uqGPYNpL6F77_EbWMOkHtX045evP6v2MBgSgL0XeYIz4EsgflSj7rDEjK25In8sdynX7sB-404ixtZhuMCTeCkJn1tvS9bqo3NGPBMjUIBbZzrDuxST_ddJpWyPW22Mu5m4jeRMH7XPqE"/>
<div>
<div className="bg-white border border-[#E2E8F0] text-[#334155] font-body-sm text-body-sm p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                That looks great! Can you send over the Figma link? I'd like to poke around the interactive bits before our call later.
                            </div>
<div className="font-label-caps text-[10px] text-[#475569] mt-1 ml-1">10:42 AM</div>
</div>
</div>
</div>
{/*  Chat Input Area  */}
<div className="p-4 bg-white border-t border-[#E2E8F0] shrink-0 z-10">
<div className="flex items-end gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2 focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition-all">
<button className="p-2 text-[#475569] hover:text-[#0F766E] transition-colors rounded-lg hover:bg-white shrink-0 mb-0.5">
<span className="material-symbols-outlined">attach_file</span>
</button>
<textarea className="flex-1 bg-transparent border-none focus:ring-0 resize-none font-body-sm text-body-sm text-[#334155] py-2.5 max-h-32 min-h-[44px]" placeholder="Type your message..." rows="1" style={{ "fieldSizing": "content" }}></textarea>
<button className="p-2 bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white rounded-lg transition-colors shrink-0 mb-0.5 shadow-sm hover:shadow-md">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
</button>
</div>
</div>
{/*  Floating AI Chatbox (Assistant)  */}
<div className="absolute bottom-24 right-6 w-72 bg-white/90 backdrop-blur-[10px] border border-[#E2E8F0] rounded-[24px] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5 z-20 transition-transform duration-300 hover:-translate-y-1">
<div className="flex items-center gap-2 mb-3">
<div className="w-8 h-8 rounded-full bg-[#E2E8F0]/50 flex items-center justify-center">
<span className="material-symbols-outlined text-[#0F766E] text-sm">smart_toy</span>
</div>
<h4 className="font-headline-xl text-sm font-semibold text-[#334155]">FJMS Assistant</h4>
<button className="ml-auto text-[#475569] hover:text-[#334155] transition-colors">
<span className="material-symbols-outlined text-sm">close</span>
</button>
</div>
<p className="font-body-sm text-[13px] leading-relaxed text-[#475569] mb-4">
                        Hi! Based on your chat, Marcus is looking for a Figma prototype. Would you like to share your portfolio link?
                    </p>
<button className="w-full bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white font-body-sm text-sm font-semibold py-2 px-4 rounded-xl transition-colors border border-transparent">
                        Share Portfolio
                    </button>
</div>
</section>
</div>
</main>
  );
}
