import React, { useState } from 'react';

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const presetAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const handlePresetSelect = (val) => {
    setAmount(val.toString());
    setIsCustom(false);
  };

  const handleCustomSelect = () => {
    setAmount(customAmount);
    setIsCustom(true);
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount < 10000) {
      setError('Vui lòng nhập số tiền hợp lệ (Tối thiểu 10,000 VNĐ).');
      return;
    }
    if (depositAmount > 9999999999) {
      setError('Số tiền nạp một lần không được vượt quá 9,999,999,999.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payment/vnpay/create_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: depositAmount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi tạo liên kết nạp tiền.');
      }

      // Redirect to VNPay
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const displayAmount = amount ? parseFloat(amount) : 0;
  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-5xl relative flex flex-col md:flex-row overflow-hidden my-auto max-h-full md:max-h-[90vh]">
        
        {/* Left Column: Form & Selection */}
        <div className="w-full md:w-[60%] p-6 md:p-10 bg-white overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 md:hidden text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Nạp tiền vào ví</h2>
          <p className="text-sm text-slate-500 mb-8">Chọn phương thức và nhập thông tin để nạp tiền vào ví của bạn</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p>{error}</p>
            </div>
          )}

          {/* 1. Payment Method */}
          <div className="mb-10">
            <h3 className="text-base font-semibold text-slate-800 mb-4">1. Chọn phương thức nạp tiền</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border-2 border-[#0F766E] bg-teal-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer relative shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-2 right-2 text-[#0F766E]">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                </div>
                {/* Fallback to text if icon fails, but styled nicely */}
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mb-2">
                  VN
                </div>
                <span className="font-semibold text-slate-700">Cổng VNPay</span>
                <span className="text-[11px] text-slate-500 mt-1">Miễn phí</span>
              </div>
              
              <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 font-bold flex items-center justify-center mb-2">
                  M
                </div>
                <span className="font-medium text-slate-600">Ví MoMo</span>
                <span className="text-[11px] text-slate-400 mt-1">Sắp ra mắt</span>
              </div>

              <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center opacity-50 cursor-not-allowed hidden lg:flex">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-2">
                  Z
                </div>
                <span className="font-medium text-slate-600">Ví ZaloPay</span>
                <span className="text-[11px] text-slate-400 mt-1">Sắp ra mắt</span>
              </div>
            </div>
          </div>

          {/* 2. Amount Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">2. Chọn số tiền nạp</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetSelect(val)}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    !isCustom && parseFloat(amount) === val
                      ? 'border-[#0F766E] bg-teal-50 text-[#0F766E] shadow-sm ring-1 ring-[#0F766E]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {formatMoney(val).replace(' ₫', ' đ')}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCustomSelect}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  isCustom
                    ? 'border-[#0F766E] bg-teal-50 text-[#0F766E] shadow-sm ring-1 ring-[#0F766E]'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                Số khác
              </button>
            </div>

            {isCustom && (
              <div className="mt-4 animate-fade-in bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-600 mb-2">Nhập số tiền (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Ví dụ: 150000"
                    min="10000"
                    max="9999999999"
                    step="1"
                    className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] outline-none transition-all text-slate-800 font-semibold text-lg bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">VNĐ</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Summary & Actions */}
        <div className="w-full md:w-[40%] bg-slate-50 p-6 md:p-10 border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 hidden md:block text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 mt-4 md:mt-0">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Thông tin đơn nạp</h3>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Phương thức</span>
                <span className="text-slate-800 font-medium">Cổng VNPay</span>
              </div>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Số tiền nạp</span>
                <span className="text-slate-800 font-medium">{formatMoney(displayAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                <span className="text-slate-500 text-sm">Phí giao dịch</span>
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
                disabled={loading || displayAmount < 10000}
                className="w-full py-4 bg-[#0F766E] text-white rounded-xl font-bold text-lg hover:bg-[#0d615b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0F766E]/20"
              >
                {loading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                Thanh toán qua VNPay
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-5 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-[16px] text-green-600">verified_user</span>
              <span>Giao dịch được bảo mật tuyệt đối (SSL 256-bit)</span>
            </div>
          </div>

          {/* Guide Section */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hidden lg:block">
            <h4 className="text-sm font-bold text-slate-800 mb-5">Hướng dẫn nạp tiền</h4>
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
              <div className="relative">
                <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">1</span>
                <p className="text-sm font-medium text-slate-800">Chọn số tiền nạp</p>
                <p className="text-[13px] text-slate-500 mt-1">Sử dụng nút có sẵn hoặc nhập tay</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold ring-4 ring-white">2</span>
                <p className="text-sm font-medium text-slate-800">Thanh toán</p>
                <p className="text-[13px] text-slate-500 mt-1">Quét mã QR hoặc nhập thẻ trên VNPay</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[33px] top-0.5 w-6 h-6 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center text-xs font-bold ring-4 ring-white">3</span>
                <p className="text-sm font-medium text-slate-800">Hoàn tất</p>
                <p className="text-[13px] text-slate-500 mt-1">Hệ thống tự động cộng tiền vào ví</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
