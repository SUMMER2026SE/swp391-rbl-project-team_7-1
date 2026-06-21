import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function EscrowDepositPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Extract amount from query parameter ?amount=xxx
  const [amount, setAmount] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    return query.get('amount') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  const handleVNPayRedirect = async () => {
    setError('');
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ để nạp.');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payment/vnpay/create_url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: depositAmount })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo link thanh toán VNPay.');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Không nhận được link thanh toán từ VNPay.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ lớn hơn 0.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/escrow/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ projectId: parseInt(projectId), amount: depositAmount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi ký quỹ dự án.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Ký quỹ thành công!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Tuyệt vời! Số tiền <strong className="text-slate-700">{formatMoney(amount)}</strong> đã được giữ an toàn trong hệ thống Escrow cho dự án #{projectId}. Dự án sẽ tự động chuyển sang trạng thái Đang thực hiện.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(`/project-details/${projectId}`)}
              className="w-full bg-[#0F766E] text-white py-3.5 rounded-xl font-bold hover:bg-[#0d615b] transition-all shadow-lg shadow-teal-900/20"
            >
              Xem dự án ngay
            </button>
            <button 
              onClick={() => navigate('/employer-wallet')}
              className="w-full bg-slate-50 text-slate-600 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              Quay lại Ví
            </button>
          </div>
        </div>
      </main>
    );
  }

  const displayAmount = amount ? parseFloat(amount) : 0;

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-[#0F766E] transition-colors mb-6 font-medium text-sm"
        >
          <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Form & Info */}
          <div className="w-full lg:w-[60%] p-6 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#0F766E] bg-teal-50 p-2 rounded-lg">shield</span>
              <h2 className="text-2xl font-bold text-slate-800">Ký quỹ dự án an toàn</h2>
            </div>
            <p className="text-sm text-slate-500 mb-8 pl-14">Hệ thống Escrow sẽ giữ tiền an toàn cho đến khi dự án hoàn tất.</p>

            {/* Error Message & VNPay Redirect Trigger */}
            {error && (
              <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm flex flex-col gap-4 animate-fade-in shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <p className="font-medium mt-0.5">{error}</p>
                </div>
                {error.toLowerCase().includes('không đủ') && (
                  <div className="pl-9">
                    <p className="text-xs text-red-600 mb-3">Số dư trong ví không đủ. Vui lòng nạp thêm tiền vào ví để tiếp tục ký quỹ.</p>
                    <button
                      type="button"
                      onClick={handleVNPayRedirect}
                      className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#0d615b] text-white py-2.5 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-900/20"
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      Nạp tiền qua VNPay
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-slate-200/50">
                <span className="material-symbols-outlined text-9xl">handshake</span>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1 relative z-10">Thông tin dự án</h3>
              <p className="text-slate-500 text-sm mb-4 relative z-10">Dự án ID: #{projectId}</p>
              
              <div className="relative z-10">
                <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền thỏa thuận (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền..."
                    min="1"
                    step="1"
                    className="w-full pl-4 pr-16 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-slate-800 font-bold text-xl bg-white"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VNĐ</span>
                </div>
                <p className="text-[13px] text-slate-500 mt-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0F766E]">info</span>
                  Số tiền này sẽ được trừ từ Ví và chuyển vào két sắt Escrow.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Summary & Actions */}
          <div className="w-full lg:w-[40%] bg-slate-50 border-l border-slate-200 flex flex-col justify-between">
            <div className="p-6 md:p-10">
              
              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Chi tiết giao dịch</h3>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Loại giao dịch</span>
                  <span className="text-slate-800 font-medium">Ký quỹ Escrow</span>
                </div>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Số tiền ký quỹ</span>
                  <span className="text-slate-800 font-medium">{formatMoney(displayAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                  <span className="text-slate-500 text-sm">Phí bảo vệ</span>
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-0.5 rounded">Miễn phí</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-bold">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-[#0F766E]">{formatMoney(displayAmount)}</span>
                </div>
              </div>

              <form onSubmit={handleDeposit}>
                <button
                  type="submit"
                  disabled={loading || displayAmount <= 0}
                  className="w-full py-4 bg-[#0F766E] text-white rounded-xl font-bold text-lg hover:bg-[#0d615b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0F766E]/20"
                >
                  {loading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                  Xác nhận Ký quỹ
                </button>
              </form>

              {/* Guide Section */}
              <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hidden lg:block">
                <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F766E]">verified_user</span>
                  Escrow hoạt động như thế nào?
                </h4>
                <div className="relative pl-6 border-l-2 border-slate-100 space-y-5">
                  <div className="relative">
                    <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">1</span>
                    <p className="text-[13px] font-medium text-slate-700">Khách hàng đóng băng tiền</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">Tiền được giữ an toàn trên hệ thống.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">2</span>
                    <p className="text-[13px] font-medium text-slate-700">Freelancer an tâm làm việc</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">Biết chắc chắn dự án đã có ngân sách.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold ring-4 ring-white">3</span>
                    <p className="text-[13px] font-medium text-slate-700">Thanh toán khi hoàn tất</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">Hệ thống mở khóa tiền khi bạn phê duyệt.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
