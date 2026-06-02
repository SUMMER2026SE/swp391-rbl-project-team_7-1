import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile md:px-margin-desktop bg-slate-50 min-h-screen">
      {/*  Success Card  */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] max-w-[560px] w-full p-8 md:p-12 text-center transform transition-all duration-300 translate-y-0 opacity-100 hover:-translate-y-0.5 hover:shadow-md" id="success-card">
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
        <h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-slate-800 mb-2">Thanh toán Thành công</h1>
        <p className="text-base text-slate-600 mb-8 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg text-[#0F766E]">lock</span>
          Tiền được giữ an toàn trong VNPay Escrow
        </p>
        {/*  Receipt Details  */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-200">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
            <span className="text-sm font-medium text-slate-600">Số tiền đã nạp</span>
            <span className="text-lg font-bold text-[#0F766E]">4.950.000 đ</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Mã giao dịch</span>
              <span className="text-sm font-medium text-slate-800 font-medium font-mono">VNP-84729-FJMS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Ngày giờ</span>
              <span className="text-sm font-medium text-slate-800 font-medium">24 Thg 10, 2026 lúc 14:32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Phương thức thanh toán</span>
              <span className="text-sm font-medium text-slate-800 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">account_balance</span> Chuyển khoản
              </span>
            </div>
          </div>
        </div>
        {/*  Actions  */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/project-details" className="bg-[#0F766E] text-white text-base font-medium py-3 px-6 rounded-2xl hover:bg-none hover:bg-[#0F766E] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex-1 flex items-center justify-center gap-2">
            Xem Dự án
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
          <Link to="/employer-dashboard" className="bg-white border border-slate-200 text-slate-600 text-base font-medium py-3 px-6 rounded-2xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex-1 inline-flex items-center justify-center">
            Bảng điều khiển
          </Link>
        </div>
        <div className="mt-8 text-center">
          <a className="text-sm font-medium text-[#0F766E] hover:text-[#0F766E]/80 transition-colors flex items-center justify-center gap-1" href="#">
            <span className="material-symbols-outlined text-[16px]">download</span> Tải Biên lai
          </a>
        </div>
      </div>
    </main>
  );
}
