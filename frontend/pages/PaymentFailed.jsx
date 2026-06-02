import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentFailed() {
  return (
    <main className="pt-28 flex-1 flex flex-col min-h-screen md:ml-64 pt-[72px] bg-slate-50">
      {/*  Error Focus Canvas  */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] border border-slate-200 p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          {/*  Subtle decorative background blob  */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-error-container rounded-full opacity-20 blur-3xl"></div>
          {/*  Soft Red Warning Icon  */}
          <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center mb-8 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-error" style={{ "fontVariationSettings": "'FILL' 1" }}>
              error
            </span>
          </div>
          {/*  Headlines & Message  */}
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Thanh toán Thất bại</h1>
          <p className="text-base text-slate-600 mb-10 max-w-sm">
            Giao dịch của bạn không thể xử lý qua VNPay. Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác để ký quỹ.
          </p>
          {/*  Transaction Summary Details (Bento style card inside)  */}
          <div className="w-full bg-slate-100 rounded-2xl p-6 mb-10 text-left border border-slate-200">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
              <span className="text-sm font-medium text-slate-600">Hành động</span>
              <span className="text-sm font-medium text-slate-800 font-medium">Nạp tiền Ký quỹ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Số tiền</span>
              <span className="text-base text-[#0F766E] font-bold">2.450.000 đ</span>
            </div>
          </div>
          {/*  Action Buttons  */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/escrow-checkout" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0F766E] text-white hover:bg-[#0D5E58] text-base font-semibold transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2 focus:ring-offset-white inline-flex items-center justify-center">
              Thử lại
            </Link>
            <Link to="/help-center" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none inline-flex items-center justify-center">
              Liên hệ Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
