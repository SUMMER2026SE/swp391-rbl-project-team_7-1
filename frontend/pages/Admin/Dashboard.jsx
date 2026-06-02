import React from 'react';

export default function AdminDashboard() {
  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
{/*  Page Header Section  */}
<div className="flex justify-between items-end mb-8">
<div>
<h2 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">Tổng quan Bảng điều khiển</h2>
<p className="font-body-base text-body-base text-[#475569]">Số liệu thời gian thực và các nhiệm vụ quan trọng của hệ thống.</p>
</div>
<div className="flex items-center gap-2 text-[#0F766E]">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>check_circle</span>
<span className="font-body-sm text-body-sm font-semibold">Tất cả hệ thống hoạt động bình thường</span>
</div>
</div>
{/*  KPIs Bento Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
{/*  KPI 1  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] ambient-shadow-hover transition-all duration-300">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-[#475569]">Tổng doanh thu</span>
<span className="p-1.5 bg-[#F8FAFC] text-[#0F766E] rounded-md flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">payments</span>
</span>
</div>
<div className="font-headline-2xl text-headline-2xl text-[#334155] mb-1">60 Tỷ đ</div>
<div className="flex items-center gap-1 text-[#0F766E]">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span className="font-body-sm text-body-sm">+12.5% trong tháng này</span>
</div>
</div>
{/*  KPI 2  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] ambient-shadow-hover transition-all duration-300">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-[#475569]">Khối lượng Ký quỹ</span>
<span className="p-1.5 bg-[#F8FAFC] text-secondary rounded-md flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</span>
</div>
<div className="font-headline-2xl text-headline-2xl text-[#334155] mb-1">21 Tỷ đ</div>
<div className="flex items-center gap-1 text-[#475569]">
<span className="font-body-sm text-body-sm">Trên 342 dự án đang hoạt động</span>
</div>
</div>
{/*  KPI 3  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] ambient-shadow-hover transition-all duration-300">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-[#475569]">Người dùng mới (7 ngày)</span>
<span className="p-1.5 bg-[#F8FAFC] text-tertiary-container rounded-md flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">group_add</span>
</span>
</div>
<div className="font-headline-2xl text-headline-2xl text-[#334155] mb-1">1.204</div>
<div className="flex items-center gap-1 text-[#0F766E]">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span className="font-body-sm text-body-sm">+4.2% so với tuần trước</span>
</div>
</div>
{/*  KPI 4  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] ambient-shadow-hover transition-all duration-300">
<div className="flex justify-between items-start mb-4">
<span className="font-label-caps text-label-caps text-[#475569]">Tỷ lệ tranh chấp</span>
<span className="p-1.5 bg-error-container text-on-error-container rounded-md flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">gavel</span>
</span>
</div>
<div className="font-headline-2xl text-headline-2xl text-[#334155] mb-1">1.2%</div>
<div className="flex items-center gap-1 text-[#475569]">
<span className="font-body-sm text-body-sm">Trong ngưỡng cho phép</span>
</div>
</div>
</div>
{/*  Main Content Area: Chart and Tasks  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
{/*  Chart Section (Spans 2 columns)  */}
<div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-xl text-headline-xl text-[#334155] m-0">Khối lượng giao dịch</h3>
<div className="flex gap-2">
<button className="px-3 py-1 text-body-sm font-body-sm rounded-md bg-[#F8FAFC] text-[#475569] hover:bg-[#0F766E] hover:text-white transition-colors">7 ngày</button>
<button className="px-3 py-1 text-body-sm font-body-sm rounded-md bg-gradient-to-b from-[#475569] to-[#526171] hover:to-[#0F766E] text-white font-medium">30 ngày</button>
<button className="px-3 py-1 text-body-sm font-body-sm rounded-md bg-[#F8FAFC] text-[#475569] hover:bg-[#0F766E] hover:text-white transition-colors">Từ đầu năm</button>
</div>
</div>
{/*  Chart Placeholder  */}
<div className="flex-1 w-full min-h-[300px] bg-gradient-to-t from-[#F8FAFC] to-transparent rounded-lg border border-dashed border-[#E2E8F0] flex items-end p-4 relative">
{/*  Abstract bars to simulate chart  */}
<div className="w-full h-full flex items-end justify-between gap-2 opacity-60">
<div className="w-1/12 bg-[#0F766E] h-1/3 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-1/2 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-2/5 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-3/5 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-1/2 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-4/5 rounded-t-sm"></div>
<div className="w-1/12 bg-[#0F766E] h-2/3 rounded-t-sm"></div>
</div>
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<span className="font-label-caps text-label-caps text-[#475569] opacity-50">Khu vực biểu đồ tương tác</span>
</div>
</div>
</div>
{/*  Urgent Tasks Section  */}
<div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-xl text-headline-xl text-[#334155] m-0">Nhiệm vụ khẩn cấp</h3>
<span className="bg-error text-on-error font-label-caps text-label-caps px-2 py-0.5 rounded-full">3</span>
</div>
<div className="flex flex-col gap-4">
{/*  Task Item 1  */}
<div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#0F766E] transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="font-label-caps text-label-caps text-error">Xem xét tranh chấp</span>
</div>
<span className="font-body-sm text-body-sm text-[#475569]">1 giờ trước</span>
</div>
<p className="font-body-sm text-body-sm text-[#334155] mb-2 font-medium">Dự án #8920: Khiếu nại không giao hàng</p>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Giá trị: 112.500.000 đ</span>
<span className="material-symbols-outlined text-[#475569] group-hover:text-[#0F766E] transition-colors text-[20px]">arrow_forward</span>
</div>
</div>
{/*  Task Item 2  */}
<div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#0F766E] transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
<span className="font-label-caps text-label-caps text-tertiary-container">Ký quỹ giá trị cao</span>
</div>
<span className="font-body-sm text-body-sm text-[#475569]">3 giờ trước</span>
</div>
<p className="font-body-sm text-body-sm text-[#334155] mb-2 font-medium">Đang chờ xác nhận giải ngân</p>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">Giá trị: 300.000.000 đ</span>
<span className="material-symbols-outlined text-[#475569] group-hover:text-[#0F766E] transition-colors text-[20px]">arrow_forward</span>
</div>
</div>
{/*  Task Item 3  */}
<div className="p-4 border border-[#E2E8F0] rounded-lg hover:border-[#0F766E] transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-2">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-[#0F766E]"></span>
<span className="font-label-caps text-label-caps text-[#0F766E]">Cảnh báo hệ thống</span>
</div>
<span className="font-body-sm text-body-sm text-[#475569]">5 giờ trước</span>
</div>
<p className="font-body-sm text-body-sm text-[#334155] mb-2 font-medium">Xem xét KYC của doanh nghiệp mới</p>
<div className="flex justify-between items-center">
<span className="font-body-sm text-body-sm text-[#475569]">TechCorp Inc.</span>
<span className="material-symbols-outlined text-[#475569] group-hover:text-[#0F766E] transition-colors text-[20px]">arrow_forward</span>
</div>
</div>
</div>
<button className="mt-auto pt-4 w-full text-center font-body-sm text-body-sm text-[#0F766E] hover:underline font-medium">
                        Xem tất cả nhiệm vụ
                    </button>
</div>
</div>
</main>
  );
}
