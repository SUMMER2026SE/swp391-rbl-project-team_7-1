import React from 'react';

export default function PaymentFailed() {
  return (
    <main className="pt-28 flex-1 flex flex-col min-h-screen md:ml-64 pt-[72px] bg-[#F8FAFC]">
{/*  Error Focus Canvas  */}
<div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
<div className="max-w-lg w-full bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] border border-[#E2E8F0] p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
{/*  Subtle decorative background blob  */}
<div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-error-container rounded-full opacity-20 blur-3xl"></div>
{/*  Soft Red Warning Icon  */}
<div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center mb-8 shadow-sm">
<span className="material-symbols-outlined text-[48px] text-error" style={{ "fontVariationSettings": "'FILL' 1" }}>
                        error
                    </span>
</div>
{/*  Headlines & Message  */}
<h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-4">Payment Unsuccessful</h1>
<p className="font-body-base text-body-base text-[#475569] mb-10 max-w-sm">
                    Your transaction could not be processed via VNPay. Please try again or use a different payment method to secure the escrow.
                </p>
{/*  Transaction Summary Details (Bento style card inside)  */}
<div className="w-full bg-[#F1F5F9] rounded-xl p-6 mb-10 text-left border border-[#E2E8F0]">
<div className="flex justify-between items-center mb-3 pb-3 border-b border-[#E2E8F0]">
<span className="font-body-sm text-body-sm text-[#475569]">Intended Action</span>
<span className="font-body-sm text-body-sm text-[#334155] font-medium">Escrow Funding</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Amount</span>
<span className="font-body-base text-body-base text-[#0F766E] font-bold">$2,450.00 USD</span>
</div>
</div>
{/*  Action Buttons  */}
<div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
<button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#475569] to-[#526171] text-white hover:bg-none hover:bg-[#0F766E] font-body-base text-body-base font-semibold transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2 focus:ring-offset-white">
                        Retry Payment
                    </button>
<button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#475569] border border-[#E2E8F0] hover:bg-[#F8FAFC] font-body-base text-body-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none">
                        Contact Support
                    </button>
</div>
</div>
</div>
{/*  Footer  */}
</main>
  );
}
