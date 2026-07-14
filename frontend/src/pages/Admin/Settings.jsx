import React from 'react';

export default function AdminSettings() {
  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cấu hình hệ thống</h1>
          <p className="text-sm text-slate-500 font-medium">Quản lý các thông số vận hành nền tảng, tích hợp cổng thanh toán và giám sát hoạt động quản trị viên.</p>
        </div>
        
        {/* Settings Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Platform Fees Card */}
          <div className="col-span-1 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#0F766E]">
                <span className="material-symbols-outlined text-[24px]">percent</span>
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Phí nền tảng</h2>
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-6 leading-relaxed">Thiết lập tỷ lệ phí hoa hồng mặc định (%) áp dụng cho tất cả các giao dịch hợp đồng hoàn tất thành công trên sàn.</p>
              
              <div className="w-full mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Tỷ lệ phí hiện tại (%)</label>
                <input 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all" 
                  type="number" 
                  defaultValue="10"
                />
              </div>
            </div>
            
            <button className="w-full bg-[#0F766E] text-white text-xs uppercase tracking-wider font-bold py-3 rounded-2xl hover:bg-[#0d5e58] shadow-sm hover:shadow-md transition-all cursor-pointer">
              Cập nhật phí
            </button>
          </div>

          {/* VNPay Integration Card */}
          <div className="col-span-1 lg:col-span-2 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-[#0F766E]">
                  <span className="material-symbols-outlined text-[24px]">account_balance</span>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">Cổng VNPay</h2>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Đang hoạt động
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-6 leading-relaxed font-medium">Cấu hình mã kết nối thanh toán VNPay và đường dẫn IPN callback tự động phục vụ các giao dịch ký quỹ (Escrow).</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Mã Website (vnp_TmnCode)</label>
                    <input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none" readOnly type="password" value="FJMS_PROD_1433"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Mã bảo mật (Hash Secret)</label>
                    <input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none" readOnly type="password" value="************************"/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">IPN Webhook URL</label>
                  <input className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-2 text-xs font-mono text-slate-600 focus:outline-none" readOnly type="text" value="http://localhost:5000/api/payment/vnpay/vnpay_ipn"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-4 gap-6">
            <button className="text-[11px] uppercase tracking-wider font-extrabold text-[#0F766E] border-b-2 border-[#0F766E] pb-3 px-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">history</span> Nhật ký bảo mật
            </button>
            <button className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 hover:text-[#0F766E] transition-colors border-b-2 border-transparent pb-3 px-1 flex items-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">settings_suggest</span> Sự kiện hệ thống
            </button>
            <button className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 hover:text-[#0F766E] transition-colors border-b-2 border-transparent pb-3 px-1 flex items-center gap-1.5 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span> Quyền truy cập
            </button>
          </div>
          
          {/* Filters Bar */}
          <div className="p-4 bg-[#F8FAFC] border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                <select className="pl-9 pr-8 py-2 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer">
                  <option>Tất cả hành động</option>
                  <option>Thay đổi cấu hình</option>
                  <option>Cập nhật phí</option>
                  <option>Cấm người dùng</option>
                </select>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                <input className="pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-bold text-slate-600 focus:outline-none cursor-pointer" type="date"/>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#0F766E] transition-colors text-[10px] uppercase tracking-wider font-black cursor-pointer bg-white px-3.5 py-2 border border-[#E2E8F0] rounded-2xl">
              <span className="material-symbols-outlined text-[14px]">download</span> Xuất CSV
            </button>
          </div>
          
          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="py-3.5 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Thời gian (UTC)</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Quản trị viên</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Hành động</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Chi tiết sự kiện</th>
                  <th className="py-3.5 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Địa chỉ IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 px-6 text-slate-500 font-semibold">2026-06-22 14:32:01</td>
                  <td className="py-4 px-6 font-bold text-slate-800">Quản trị viên hệ thống</td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">Cập nhật phí</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">Thay đổi phí hoa hồng mặc định từ 8.5% sang 10.0%</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">127.0.0.1</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 px-6 text-slate-500 font-semibold">2026-06-22 09:15:22</td>
                  <td className="py-4 px-6 font-bold text-slate-800">Bảo mật hệ thống</td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">Đăng nhập</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">Đăng nhập thành công vào trang quản trị qua 2FA</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">127.0.0.1</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 px-6 text-slate-500 font-semibold">2026-06-21 16:45:10</td>
                  <td className="py-4 px-6 font-bold text-slate-800">Quản trị viên hệ thống</td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">Cấu hình</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">Cập nhật chuỗi bảo mật VNPay Hash Secret trên môi trường thử nghiệm</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">127.0.0.1</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="py-4 px-6 text-slate-500 font-semibold">2026-06-20 11:20:05</td>
                  <td className="py-4 px-6 font-bold text-slate-800">Điều phối viên</td>
                  <td className="py-4 px-6">
                    <span className="bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded-lg text-xs font-bold uppercase">Khóa tài khoản</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">Khóa tài khoản Freelancer ID #5 do vi phạm điều khoản dịch vụ</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">127.0.0.1</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-[#F8FAFC] text-xs">
            <span className="font-semibold text-slate-500">Hiển thị 1-4 trên tổng số 1,248 dòng lịch sử sự kiện.</span>
            <div className="flex gap-2.5">
              <button className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-xl text-slate-400 disabled:opacity-40" disabled>
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>
              <button className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
