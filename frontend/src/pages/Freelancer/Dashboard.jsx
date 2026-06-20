import React from 'react';

export default function FreelancerDashboard() {
  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-0 flex flex-col">

{/*  Dashboard Content Canvas  */}
<div className="pt-8 md:pt-10 px-gutter pb-12 max-w-container-max mx-auto w-full flex-1">
{/*  Welcome Section  */}
<section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end">
<div>
<h1 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Chào mừng trở lại, Freelancer!</h1>
<p className="text-on-surface-variant text-lg">Dưới đây là tóm tắt hoạt động công việc tự do của bạn hôm nay.</p>
</div>
<div className="mt-4 md:mt-0 flex items-center bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg shadow-level-1">
<span className="text-sm font-medium mr-3">Mức độ hoàn thiện hồ sơ</span>
<div className="w-32 bg-surface-container-low rounded-full h-2.5">
<div className="bg-primary-container h-2.5 rounded-full" style={{ "width": "85%" }}></div>
</div>
<span className="text-sm font-bold ml-3 text-primary">85%</span>
</div>
</section>
{/*  Metrics Bento Grid  */}
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
{/*  Metric 1  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">work_history</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">4</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Dự án đang thực hiện</p>
</div>
{/*  Metric 2  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">description</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">12</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Đề xuất đã gửi</p>
</div>
{/*  Metric 3  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-primary-container">
<span className="material-symbols-outlined">account_balance_wallet</span>
</div>
<span className="text-xs font-bold text-primary-container bg-[#F0FDF4] px-2 py-1 rounded-full">+14% trong tháng</span>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">106.250.000 đ</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Tổng thu nhập (Ví)</p>
</div>
{/*  Metric 4  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="flex justify-between items-start mb-4">
<div className="p-2 bg-[#F1F5F9] rounded-lg text-[#475569]">
<span className="material-symbols-outlined">mail</span>
</div>
</div>
<h3 className="text-3xl font-bold mb-1 text-[#1E293B]">3</h3>
<p className="text-on-surface-variant text-sm font-medium text-[#1E293B]">Tin nhắn chưa đọc</p>
</div>
</section>
{/*  Main Split Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/*  Active Projects (Col Span 2)  */}
<section className="lg:col-span-2 space-y-6">
<div className="flex justify-between items-center mb-2">
<h2 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Dự án đang thực hiện</h2>
<a className="text-sm font-medium text-primary hover:underline" href="#">Xem tất cả</a>
</div>
{/*  Project Card 1  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 flex items-center space-x-2">
<span className="bg-[#F1F5F9] text-[#475569] text-xs font-bold px-2 py-1 rounded-full flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1">sync</span> Đang thực hiện
                            </span>
</div>
<h3 className="text-lg font-bold text-[#1E293B] mb-2 pr-24">Thiết kế UX/UI cho Bảng điều khiển FinTech</h3>
<p className="text-sm text-on-surface-variant mb-4">Khách hàng: Acme Financial Corp.</p>
<div className="flex flex-wrap gap-4 mb-6">
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">payments</span>
<span className="font-medium">87.500.000 đ</span>
</div>
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
<span>Hạn chót: 15 Thg 10, 2024</span>
</div>
</div>
<div className="w-full bg-surface-container-low rounded-full h-1.5 mb-2">
<div className="bg-[#1D4ED8] h-1.5 rounded-full" style={{ "width": "60%" }}></div>
</div>
<div className="flex justify-between text-xs text-on-surface-variant">
<span>Giai đoạn 2/3</span>
<span>Hoàn thành 60%</span>
</div>
</div>
{/*  Project Card 2  */}
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
<div className="absolute top-4 right-4 flex items-center space-x-2">
<span className="bg-[#F1F5F9] text-[#475569] text-xs font-bold px-2 py-1 rounded-full flex items-center">
<span className="material-symbols-outlined text-[14px] mr-1">pending_actions</span> Đang xét duyệt
                           </span>
</div>
<h3 className="text-lg font-bold text-[#1E293B] mb-2 pr-24">Phát triển Ứng dụng Di động E-commerce</h3>
<p className="text-sm text-on-surface-variant mb-4">Khách hàng: RetailNow LLC</p>
<div className="flex flex-wrap gap-4 mb-6">
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">payments</span>
<span className="font-medium">130.000.000 đ</span>
</div>
<div className="flex items-center text-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px] mr-1">calendar_today</span>
<span>Hạn chót: 01 Thg 11, 2024</span>
</div>
</div>
<div className="w-full bg-surface-container-low rounded-full h-1.5 mb-2">
<div className="bg-[#B45309] h-1.5 rounded-full" style={{ "width": "95%" }}></div>
</div>
<div className="flex justify-between text-xs text-on-surface-variant">
<span>Đánh giá cuối cùng</span>
<span>Hoàn thành 95%</span>
</div>
</div>
</section>
{/*  Sidebar / Recent Messages (Col Span 1)  */}
<section className="space-y-6">
<div className="flex justify-between items-center mb-2">
<h2 className="font-display-hero text-display-hero mb-2 text-[#1E293B]">Tin nhắn gần đây</h2>
<a className="text-sm font-medium text-primary hover:underline" href="#">Xem hộp thư</a>
</div>
<div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative">
{/*  Message 1  */}
<div className="p-4 border-b border-[#E2E8F0] hover:bg-surface-container-low cursor-pointer transition-colors relative">
<div className="absolute top-4 right-4 w-2 h-2 bg-primary-container rounded-full"></div>
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
                                    A
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">Acme Financial</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5 font-medium text-on-background">Chúng ta có thể xem lại wireframe mới nhất không?</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">10 phút trước</span>
</div>
</div>
</div>
{/*  Message 2  */}
<div className="p-4 border-b border-[#E2E8F0] hover:bg-surface-container-low cursor-pointer transition-colors">
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold flex-shrink-0">
                                    R
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">RetailNow LLC</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5">Thanh toán cho giai đoạn 1 đã được giải ngân.</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">2 giờ trước</span>
</div>
</div>
</div>
{/*  Message 3  */}
<div className="p-4 hover:bg-surface-container-low cursor-pointer transition-colors relative">
<div className="absolute top-4 right-4 w-2 h-2 bg-primary-container rounded-full"></div>
<div className="flex items-start space-x-3">
<div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold flex-shrink-0">
                                    S
                                </div>
<div className="flex-1 min-w-0">
<h4 className="text-sm font-bold text-on-background truncate">Sarah Jenkins</h4>
<p className="text-xs text-on-surface-variant truncate mt-0.5 font-medium text-on-background">Cơ hội mới phù hợp với kỹ năng của bạn.</p>
<span className="text-[11px] text-on-surface-variant mt-1 block">Hôm qua</span>
</div>
</div>
</div>
</div>
</section>
</div>
</div>
</main>
  );
}
