import React from 'react';

export default function VNPayGateway() {
  return (
    <main className="pt-28 w-full max-w-container-max mx-auto">
{/*  Premium Gateway Header  */}
<header className="flex justify-center items-center mb-8">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#475569]" data-icon="lock" style={{ "fontVariationSettings": "'FILL' 1" }}>lock</span>
<span className="font-body-base text-body-base text-[#475569]">Secured by</span>
{/*  VNPay Branding mapped to system tokens where possible (blue/red aesthetic requested)  */}
<div className="font-headline-xl text-headline-xl tracking-tight flex items-baseline">
<span className="text-[#0F766E] font-bold">VN</span><span className="text-error font-bold">Pay</span>
</div>
</div>
</header>
{/*  Bento Grid Layout for Gateway  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/*  Left Column: Order Summary & QR  */}
<section className="lg:col-span-5 flex flex-col gap-6">
{/*  Merchant & Amount Card  */}
<div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<div className="flex items-center gap-4 mb-6">
<div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0]">
<span className="material-symbols-outlined text-[#475569]" data-icon="storefront" style={{ "fontVariationSettings": "'FILL' 1" }}>storefront</span>
</div>
<div>
<h2 className="font-label-caps text-label-caps text-[#475569] uppercase">Merchant</h2>
<p className="font-headline-xl text-headline-xl text-[#334155]">FJMS Marketplace</p>
</div>
</div>
<div className="pt-6 border-t border-[#E2E8F0]">
<h2 className="font-label-caps text-label-caps text-[#475569] uppercase mb-2">Total Amount</h2>
<p className="font-display-hero-mobile text-display-hero-mobile text-[#0F766E] lg:text-[40px] leading-tight">$4,950.00 <span className="text-headline-xl text-[#475569]">USD</span></p>
</div>
</div>
{/*  VNPay QR Card  */}
<div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex flex-col items-center text-center">
<div className="bg-[#F1F5F9] text-[#0F766E] rounded-full px-4 py-1 mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="qr_code_scanner">qr_code_scanner</span>
<span className="font-label-caps text-label-caps">VNPay-QR Fast Scan</span>
</div>
{/*  QR Code Mock Image  */}
<div className="w-48 h-48 bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-lg p-2 mb-6">
<img alt="QR Code" className="w-full h-full object-cover rounded mix-blend-multiply" data-alt="A highly detailed, sharp rendering of a modern payment QR code displayed on a pristine white digital interface. The QR code features a complex matrix of deep blue and black squares, subtly integrating a stylized corporate logo in the very center. The surrounding space is entirely minimalist, lit with a soft, bright, high-key studio light that emphasizes the crisp edges of the code block. The overall aesthetic is professional, secure, and technologically advanced, fitting seamlessly into a high-end financial application's light-mode design system." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr7bqvmWXbzsczzA4dCcgmJYDxDk95kgbTkcsmXkQHjJHWYDDaCP0x-FZYM8M44iMaKRppCV2cNC43yYxQmAXsD6O9dZDHFEhXMtGwYrfYvN8u4xjJIS3m602E21-MO37zDBvvwOVcmu7fpoFu2l2uuZzD131XfogZwTFZA97BT97wqjoj1zHOSOcZsqdxAt7h1_6G9XaJBQKmZsu-biQs1UDV6cR8Te__BTWAaSjKYlUtlE8LvjiX6yipB9CLJ4Op6sQ0uDXl4bU"/>
</div>
<p className="font-body-sm text-body-sm text-[#475569]">
                        Open your banking app or VNPay Wallet to scan this code for instant, secure payment.
                    </p>
</div>
</section>
{/*  Right Column: Payment Methods  */}
<section className="lg:col-span-7">
<div className="bg-white border border-[#E2E8F0] rounded-xl p-6 lg:p-10 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
<h2 className="font-headline-2xl text-headline-2xl text-[#334155] mb-8">Select Payment Method</h2>
<div className="flex flex-col gap-4">
{/*  Option 1: VNPay Wallet (Active State)  */}
<div className="border-2 border-[#0F766E] bg-[#F8FAFC] rounded-lg p-6 relative overflow-hidden transition-all duration-300">
{/*  Active Indicator  */}
<div className="absolute top-0 right-0 w-12 h-12 bg-[#0F766E] flex items-start justify-end p-2" style={{ "borderBottomLeftRadius": "100%" }}>
<span className="material-symbols-outlined text-white text-[20px]" data-icon="check_circle" style={{ "fontVariationSettings": "'FILL' 1" }}>check_circle</span>
</div>
<div className="flex items-center gap-4 mb-4">
<div className="w-10 h-10 rounded bg-[#F1F5F9] flex items-center justify-center">
<span className="material-symbols-outlined text-[#0F766E]" data-icon="account_balance_wallet" style={{ "fontVariationSettings": "'FILL' 1" }}>account_balance_wallet</span>
</div>
<div>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">VNPay Wallet</h3>
<p className="font-body-sm text-body-sm text-[#475569]">Pay quickly using your linked wallet balance</p>
</div>
</div>
{/*  Mock login/action area for active state  */}
<div className="mt-6 pt-6 border-t border-[#E2E8F0]">
<div className="flex items-center justify-between mb-4">
<span className="font-body-sm text-body-sm text-[#475569]">Linked Phone Number</span>
<span className="font-body-sm text-body-sm text-[#334155] font-medium">+84 *** *** 889</span>
</div>
<button className="w-full bg-gradient-to-r from-[#475569] to-[#526171] text-white font-label-caps text-label-caps py-4 rounded-lg uppercase tracking-wider transition-all duration-500 ease-out hover:bg-none hover:bg-[#0F766E] hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="lock">lock</span>
                                    Pay $4,950.00 via Wallet
                                </button>
</div>
</div>
{/*  Option 2: Local Bank Transfer  */}
<div className="border border-[#E2E8F0] bg-white rounded-lg p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded bg-[#F1F5F9] flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-[#475569] transition-colors" data-icon="account_balance">account_balance</span>
</div>
<div>
<h3 className="font-headline-xl text-headline-xl text-[#334155]">Local Bank Transfer</h3>
<p className="font-body-sm text-body-sm text-[#475569]">Supports 40+ domestic banks via Napas</p>
</div>
</div>
</div>
{/*  Option 3: International Cards  */}
<div className="border border-[#E2E8F0] bg-white rounded-lg p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded bg-[#F1F5F9] flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-[#475569] transition-colors" data-icon="credit_card">credit_card</span>
</div>
<div className="flex-1">
<h3 className="font-headline-xl text-headline-xl text-[#334155]">International Cards</h3>
<p className="font-body-sm text-body-sm text-[#475569]">Visa, Mastercard, JCB, Amex</p>
</div>
{/*  Decorative card logos implied  */}
<div className="flex gap-1 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
<div className="w-8 h-5 bg-[#F1F5F9] text-[#475569] rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
<div className="w-8 h-5 bg-[#F1F5F9] text-[#475569] rounded flex items-center justify-center text-[8px] font-bold">MC</div>
</div>
</div>
</div>
</div>
{/*  Footer Links within gateway  */}
<div className="mt-8 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
<p className="font-body-sm text-body-sm text-[#475569]">
                            By paying, you agree to VNPay's <a className="text-[#0F766E] hover:underline" href="#">Terms of Service</a>
</p>
<a className="font-label-caps text-label-caps text-[#475569] hover:text-[#334155] flex items-center gap-1 uppercase transition-colors" href="#">
<span className="material-symbols-outlined text-[16px]" data-icon="arrow_back">arrow_back</span>
                            Cancel &amp; Return
                        </a>
</div>
</div>
</section>
</div>
</main>
  );
}
