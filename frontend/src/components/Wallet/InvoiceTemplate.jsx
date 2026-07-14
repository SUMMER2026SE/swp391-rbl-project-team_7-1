import React from 'react';

const InvoiceTemplate = React.forwardRef(({ transaction, user }, ref) => {
  if (!transaction) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getTransactionTitle = (type) => {
    switch (type) {
      case 'DEPOSIT': return 'NẠP TIỀN VÀO VÍ';
      case 'WITHDRAWAL': return 'RÚT TIỀN TỪ VÍ';
      case 'ESCROW_DEPOSIT': return 'THANH TOÁN KÝ QUỸ';
      case 'ESCROW_REFUND': return 'HOÀN TIỀN KÝ QUỸ';
      case 'PAYMENT': return 'NHẬN TIỀN THANH TOÁN';
      default: return 'GIAO DỊCH VÍ';
    }
  };

  return (
    <div ref={ref} className="bg-white text-slate-800 font-sans p-12 mx-auto relative overflow-hidden" style={{ width: '800px', minHeight: '1100px' }}>
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[600px] h-[600px]">
          <path fill="currentColor" d="M100 0L200 50L200 150L100 200L0 150L0 50Z" />
          <text x="50%" y="55%" fontSize="40" fontFamily="sans-serif" fontWeight="900" fill="white" textAnchor="middle">FJMS</text>
        </svg>
      </div>

      {/* Header with geometric styling */}
      <div className="flex justify-between items-start pb-8 mb-10 border-b-4 border-[#0F766E] relative">
        <div className="absolute -left-12 -top-12 w-24 h-24 bg-[#0F766E]/10 rounded-full blur-2xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          {/* New Modern Logo */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F766E] to-teal-400 p-0.5 shadow-lg shadow-teal-500/30">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#0F766E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-teal-600 m-0 tracking-tight">FJMS</h1>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Freelance Jobs System</p>
          </div>
        </div>
        
        <div className="text-right relative z-10">
          <h2 className="text-4xl font-black text-slate-800 tracking-widest mb-3">HÓA ĐƠN</h2>
          <div className="inline-block bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-left">
            <p className="text-xs text-slate-500 mb-1">Mã hóa đơn: <strong className="text-slate-800 font-mono text-sm ml-2">INV-{transaction.transaction_id.toString().padStart(6, '0')}</strong></p>
            <p className="text-xs text-slate-500">Ngày lập: <strong className="text-slate-800 ml-2">{formatDate(new Date())}</strong></p>
          </div>
        </div>
      </div>

      {/* Customer & Transaction Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Thông tin Khách hàng
          </h3>
          <p className="font-black text-xl text-slate-800 mb-2">{user?.full_name || 'Khách hàng'}</p>
          <div className="space-y-1.5">
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {user?.email || 'N/A'}
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {user?.phone || 'Chưa cập nhật'}
            </p>
          </div>
        </div>

        <div className="bg-[#0F766E]/5 p-6 rounded-2xl border border-[#0F766E]/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#0F766E]/10 rounded-bl-full"></div>
          <h3 className="text-[10px] font-black text-[#0F766E] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
            Chi tiết Giao dịch
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#0F766E]/10">
              <span className="text-sm font-medium text-slate-600">Loại giao dịch</span>
              <span className="text-sm font-black text-slate-800">{getTransactionTitle(transaction.transaction_type)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#0F766E]/10">
              <span className="text-sm font-medium text-slate-600">Thời gian</span>
              <span className="text-sm font-bold text-slate-800">{formatDate(transaction.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Trạng thái</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                transaction.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                transaction.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {transaction.status === 'COMPLETED' ? 'THÀNH CÔNG' : 
                 transaction.status === 'FAILED' ? 'THẤT BẠI' : 'ĐANG XỬ LÝ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden mb-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest w-16 text-center">STT</th>
              <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">Nội dung</th>
              <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Phương thức</th>
              <th className="py-4 px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 bg-white">
              <td className="py-6 px-6 text-sm font-bold text-slate-400 text-center">01</td>
              <td className="py-6 px-6">
                <p className="text-sm font-bold text-slate-800 mb-1">{getTransactionTitle(transaction.transaction_type)}</p>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{transaction.description || 'Giao dịch qua hệ thống FJMS.'}</p>
              </td>
              <td className="py-6 px-6 text-center">
                <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">VNPay / Chuyển khoản</span>
              </td>
              <td className="py-6 px-6 text-right font-black text-lg text-slate-800">
                {formatCurrency(Math.abs(transaction.amount))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-between items-start mb-16">
        <div className="w-1/2 pr-12">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Thông tin thanh toán:</h4>
          <p className="text-xs text-slate-500 leading-relaxed text-justify mb-4">
            Hóa đơn này xác nhận giao dịch thành công trên nền tảng FJMS. Dịch vụ không áp dụng Thuế GTGT (VAT 0%) cho các giao dịch chuyển tiền ký quỹ hoặc nạp rút ví điện tử theo quy định.
          </p>
          <div className="flex items-center gap-3 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="text-xs font-bold text-slate-500">Thanh toán an toàn qua VNPAY Escrow</span>
          </div>
        </div>

        <div className="w-[45%]">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-500">Tạm tính:</span>
              <span className="text-sm font-black text-slate-800">{formatCurrency(Math.abs(transaction.amount))}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-500">Phí giao dịch (0%):</span>
              <span className="text-sm font-black text-slate-800">0 ₫</span>
            </div>
            <div className="flex justify-between items-end pt-4 mt-2">
              <span className="text-base font-black text-slate-800">TỔNG CỘNG:</span>
              <span className="text-3xl font-black text-[#0F766E]">{formatCurrency(Math.abs(transaction.amount))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signatures & Seal */}
      <div className="flex justify-between items-end px-12 relative mt-8">
        <div className="text-center">
          <p className="text-sm font-black text-slate-800 mb-1">NGƯỜI GIAO DỊCH</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-16">Customer</p>
          <p className="text-xs font-semibold text-slate-300 italic">(Ký, ghi rõ họ tên)</p>
        </div>
        
        {/* Beautiful Premium Seal */}
        <div className="absolute left-1/2 top-10 transform -translate-x-1/2 -translate-y-1/2 opacity-80 pointer-events-none mix-blend-multiply">
          <div className="w-36 h-36 rounded-full border-[5px] border-double border-rose-600 flex items-center justify-center relative -rotate-12 bg-white/50">
            <div className="absolute inset-0 rounded-full border border-rose-300 m-1"></div>
            <div className="flex flex-col items-center justify-center text-rose-600 text-center p-2 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-[12px] font-black tracking-widest uppercase">FJMS.VN</span>
              <div className="w-16 h-px bg-rose-600 my-1"></div>
              <span className="text-[9px] font-black uppercase">Đã Thanh Toán</span>
            </div>
            {/* Inner circular text effect simulated with dashes */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite]" xmlns="http://www.w3.org/2000/svg">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="7.5" fill="#e11d48" fontWeight="bold" letterSpacing="2">
                <textPath href="#circlePath" startOffset="0%">• FREELANCE JOBS MANAGEMENT SYSTEM • VERIFIED TRANSACTION</textPath>
              </text>
            </svg>
          </div>
        </div>

        <div className="text-center relative">
          <p className="text-sm font-black text-slate-800 mb-1">ĐẠI DIỆN FJMS</p>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Authorized Signature</p>
          
          {/* E-Signature SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-16 mx-auto mb-1 text-blue-800" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 20 80 Q 50 20, 80 50 T 130 40 Q 150 20, 180 70 M 60 70 L 100 60 M 110 50 C 130 80, 140 10, 160 50" />
          </svg>

          <p className="text-sm text-slate-800 font-black">Hệ thống FJMS</p>
          <div className="inline-flex items-center gap-1 mt-1 bg-blue-50 px-2 py-0.5 rounded text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-[9px] font-bold uppercase tracking-wider">Ký điện tử an toàn</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 py-5 px-12 border-t-4 border-[#0F766E] bg-slate-800 text-center flex justify-between items-center">
        <div className="text-left">
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">Website: <span className="text-teal-400">www.fjms.vn</span></p>
          <p className="text-[10px] text-slate-400 font-medium">Email: <span className="text-teal-400">support@fjms.vn</span></p>
        </div>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Thank you for your business</p>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-medium mb-0.5">Hotline: <span className="text-white font-bold">1900 6868</span></p>
          <p className="text-[10px] text-slate-400 font-medium">VAT: <span className="text-white">0123456789</span></p>
        </div>
      </div>
      
    </div>
  );
});

export default InvoiceTemplate;
