import React from 'react';

export default function EscrowCheckout() {
  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop pt-32 pb-24">
{/*  Page Header  */}
<div className="mb-12">
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-[#334155] font-bold tracking-tight">Secure Checkout</h1>
<p className="font-body-base text-body-base text-[#475569] mt-2 max-w-2xl">Review the project details and fund the escrow account to officially begin work. Funds are held securely until you approve the milestones.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Left Column: Project Details & Security  */}
<div className="lg:col-span-7 flex flex-col gap-8">
{/*  Project Bento Card  */}
<section className="bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 card-shadow hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
<div className="flex items-start justify-between mb-6">
<div>
<span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] font-label-caps text-label-caps mb-4">
                                Fixed Price Project
                            </span>
<h2 className="font-headline-2xl text-headline-2xl text-[#334155] font-semibold">Enterprise Dashboard Redesign</h2>
</div>
</div>
{/*  Freelancer Profile Micro-Card  */}
<div className="flex items-center p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg gap-4">
<div className="w-14 h-14 rounded-full bg-surface-variant overflow-hidden border border-[#E2E8F0] flex-shrink-0">
<img alt="Elena Rostova Avatar" className="w-full h-full object-cover" data-alt="A high-quality, professional portrait of a female UI/UX designer named Elena Rostova. She is smiling confidently, wearing a stylish, modern olive-green blazer over a simple white top. The background is a clean, minimal, softly blurred creative studio space with natural lighting, evoking a sense of premium talent and approachability in a light-mode corporate setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT4Oyf_xG3afP7N9d64zPDuviUEx353HmgMm717M9ALyFn8FsyeDilfjXUFWrp-GXOtZl2Sg3M47j_Si40aopqe3D_-P7ArfnfNrsr599yexBRpqfthxjAKw_NmVUOr4KMumnc1mR-Yo2dkC4ZhRCU1L1b7Fd6W1GVZ98BkG6qPhsZ3YJofto-ez9HZsaQdjO1MHVYBecrr2evRGhpeVLWQnNgQumngZ1uWk9jrgGFK_GmPKgx29jDPJknDMkQTo3p_vTOLs6-1rM"/>
</div>
<div>
<p className="font-body-sm text-body-sm text-[#475569] mb-1">Hiring Freelancer</p>
<p className="font-headline-xl text-headline-xl text-[#334155] font-semibold flex items-center gap-1">
                                Elena Rostova
                                <span className="material-symbols-outlined text-[#0F766E] text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
</p>
</div>
</div>
</section>
{/*  Escrow Security Section  */}
<section className="bg-white rounded-xl p-6 md:p-8 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
<div className="flex items-center gap-4 mb-4">
<div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center shadow-sm border border-[#E2E8F0]">
<span className="material-symbols-outlined text-[#0F766E] text-2xl" style={{ "fontVariationSettings": "'FILL' 1" }}>shield_locked</span>
</div>
<h3 className="font-headline-xl text-headline-xl text-[#334155] font-semibold">Secured by VNPay Escrow</h3>
</div>
<p className="font-body-base text-body-base text-[#475569] mb-6">
                        Your funds are held securely in a neutral VNPay trust account. We only release payment to the freelancer after you review and approve the completed work, ensuring 100% satisfaction and protection for both parties.
                    </p>
<ul className="space-y-4">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0F766E] mt-0.5">check_circle</span>
<span className="font-body-sm text-body-sm text-[#475569]">Funds are isolated from standard operational accounts.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0F766E] mt-0.5">check_circle</span>
<span className="font-body-sm text-body-sm text-[#475569]">Dispute resolution assistance available if milestones are not met.</span>
</li>
</ul>
</section>
</div>
{/*  Right Column: Checkout Summary  */}
<div className="lg:col-span-5">
<div className="sticky top-32">
<section className="bg-white border border-[#E2E8F0] rounded-xl p-6 md:p-8 card-shadow hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col gap-6">
<h3 className="font-headline-xl text-headline-xl text-[#334155] font-semibold border-b border-[#E2E8F0] pb-4">Order Summary</h3>
{/*  Line Items  */}
<div className="flex flex-col gap-4">
<div className="flex justify-between items-center">
<span className="font-body-base text-body-base text-[#475569]">Project Amount</span>
<span className="font-body-base text-body-base text-[#334155] font-medium">$4,500.00</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-base text-body-base text-[#475569] flex items-center gap-1">
                                    Service Fee (10%)
                                    <span className="material-symbols-outlined text-[16px] cursor-help" title="Platform maintenance and Escrow fee">info</span>
</span>
<span className="font-body-base text-body-base text-[#334155] font-medium">$450.00</span>
</div>
</div>
{/*  Divider  */}
<div className="w-full h-[1px] bg-[#E2E8F0]"></div>
{/*  Total  */}
<div className="flex justify-between items-center mb-2">
<span className="font-headline-xl text-headline-xl text-[#334155] font-bold">Total to Pay</span>
<span className="font-headline-2xl text-headline-2xl text-[#0F766E] font-bold tracking-tight">$4,950.00</span>
</div>
{/*  Action Button  */}
<button className="w-full bg-gradient-to-r from-[#475569] to-[#526171] hover:bg-none hover:bg-[#0F766E] text-white font-headline-xl text-headline-xl py-4 rounded-lg font-bold transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex justify-center items-center gap-2 hover-lift">
                            Pay with VNPay
                            <span className="material-symbols-outlined">arrow_forward</span>
</button>
<p className="font-body-sm text-body-sm text-center text-[#475569] opacity-80 mt-2">
                            By clicking "Pay with VNPay", you agree to the <a className="underline hover:text-[#0F766E]" href="#">Terms of Service</a> and <a className="underline hover:text-[#0F766E]" href="#">Escrow Agreement</a>.
                        </p>
</section>
</div>
</div>
</div>
</main>
  );
}
