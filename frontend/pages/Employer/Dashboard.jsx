import React from 'react';

export default function EmployerDashboard() {
  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-0">

{/*  Canvas  */}
<div className="pt-8 md:pt-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
{/*  Header  */}
<div className="mb-8">
<h1 className="font-display-hero text-display-hero text-[#1E293B] mb-2">Quản lý Dự án &amp; Nhân sự.</h1>
<p className="font-body-base text-body-base text-[#475569]">Dưới đây là tóm tắt các hoạt động và công việc đang chờ xử lý của bạn.</p>
</div>
{/*  Key Metrics Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">post_add</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Tổng số dự án</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">12</p>
<p className="font-body-sm text-body-sm text-[#0F766E] mt-2">+2 trong tháng này</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">group</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Nhân sự đang thuê</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">5</p>
<p className="font-body-base text-body-base text-[#475569]">Đang làm việc trên 3 dự án</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">pending_actions</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Đề xuất đang chờ</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">18</p>
<p className="font-body-base text-body-base text-[#475569]">Cần xem xét</p>
</div>
<div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 hover:shadow-md">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
<span className="material-symbols-outlined">account_balance</span>
</div>
<h3 className="font-body-sm text-body-sm text-on-surface-variant">Số dư ký quỹ</h3>
</div>
<p className="font-headline-2xl text-headline-2xl text-[#1E293B]">112.500.000 đ</p>
<div className="flex items-center gap-2 mt-2">
<span className="material-symbols-outlined text-[14px] text-[#0F766E]">verified_user</span>
<p className="font-body-sm text-body-sm text-[#0F766E]">Bảo mật bởi VNPay</p>
</div>
</div>
</div>
</div>
</main>
  );
}
