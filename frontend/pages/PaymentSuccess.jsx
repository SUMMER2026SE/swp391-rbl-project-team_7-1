import React from 'react';

export default function PaymentSuccess() {
  return (
    <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile md:px-margin-desktop">
{/*  Success Card  */}
<div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] max-w-[560px] w-full p-8 md:p-12 text-center transform transition-all duration-300 translate-y-0 opacity-100 hover:-translate-y-0.5 hover:shadow-md" id="success-card">
{/*  Icon/Animation Wrapper  */}
<div className="mx-auto w-24 h-24 mb-6 relative">
{/*  Outer Pulse Rings  */}
<div className="absolute inset-0 rounded-full bg-[#0F766E] opacity-20 animate-ping" style={{ "animationDuration": "3s" }}></div>
<div className="absolute inset-2 rounded-full bg-[#0F766E] opacity-40 animate-ping" style={{ "animationDuration": "2.5s", "animationDelay": "0.5s" }}></div>
{/*  Core Checkmark  */}
<div className="relative w-full h-full rounded-full bg-[#0F766E] flex items-center justify-center shadow-lg z-10">
<span className="material-symbols-outlined text-white text-5xl" style={{ "fontVariationSettings": "'FILL' 1" }}>check_circle</span>
</div>
</div>
<h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-[#334155] mb-2">Payment Successful</h1>
<p className="font-body-base text-body-base text-[#475569] mb-8 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-lg text-[#0F766E]">lock</span>
                Funds held securely in VNPay Escrow
            </p>
{/*  Receipt Details  */}
<div className="bg-[#F8FAFC] rounded-lg p-6 mb-8 text-left border border-[#E2E8F0]">
<div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E2E8F0]">
<span className="font-body-sm text-body-sm text-[#475569]">Amount Deposited</span>
<span className="font-headline-xl text-headline-xl text-[#0F766E]">$4,950.00</span>
</div>
<div className="space-y-3">
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Transaction ID</span>
<span className="font-body-sm text-body-sm text-[#334155] font-medium font-mono">VNP-84729-FJMS</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Date</span>
<span className="font-body-sm text-body-sm text-[#334155] font-medium">Oct 24, 2024 at 14:32</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Payment Method</span>
<span className="font-body-sm text-body-sm text-[#334155] font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">account_balance</span> Bank Transfer
                        </span>
</div>
</div>
</div>
{/*  Actions  */}
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button className="bg-gradient-to-r from-[#475569] to-[#526171] text-white font-body-base text-body-base font-medium py-3 px-6 rounded-lg hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex-1 flex items-center justify-center gap-2">
                    View Project
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
<button className="bg-white border border-[#E2E8F0] text-[#475569] font-body-base text-body-base font-medium py-3 px-6 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex-1">
                    Go to Dashboard
                </button>
</div>
<div className="mt-8 text-center">
<a className="font-body-sm text-body-sm text-[#0F766E] hover:text-[#0F766E]/80 transition-colors flex items-center justify-center gap-1" href="#">
<span className="material-symbols-outlined text-[16px]">download</span> Download Receipt
                </a>
</div>
</div>
</main>
  );
}
