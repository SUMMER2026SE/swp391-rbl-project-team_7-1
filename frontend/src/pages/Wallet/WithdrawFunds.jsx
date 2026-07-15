import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawFunds() {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const balanceRes = await fetch('http://localhost:5000/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setWalletBalance(balanceData.balance);
      }

      const banksRes = await fetch('http://localhost:5000/api/bank-account', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (banksRes.ok) {
        const banksData = await banksRes.json();
        if (banksData) {
          setBankAccounts([banksData]);
          setSelectedBank(banksData.bank_account_id);
        } else {
          setBankAccounts([]);
        }
      }

      const historyRes = await fetch('http://localhost:5000/api/withdrawal', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setWithdrawals(historyData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const presetAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const handlePresetSelect = (val) => {
    if (val > walletBalance) {
      setError('Số dư ví không đủ cho hạn mức này');
      return;
    }
    setError('');
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
    setError('');
  };

  const handleWithdrawAll = () => {
    setAmount(walletBalance.toString());
    setIsCustom(true);
    setCustomAmount(walletBalance.toString());
    setError('');
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const withdrawAmt = parseFloat(amount);
    if (!withdrawAmt || withdrawAmt < 10000) {
      setError('Số tiền rút tối thiểu là 10.000 VNĐ');
      return;
    }
    if (withdrawAmt > walletBalance) {
      setError('Số dư ví không đủ để rút số tiền này');
      return;
    }
    if (!selectedBank) {
      setError('Vui lòng chọn tài khoản ngân hàng để nhận tiền');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: withdrawAmt,
          bank_account_id: parseInt(selectedBank)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Tạo yêu cầu rút tiền thành công! Hệ thống đang xử lý.');
        setAmount('');
        setCustomAmount('');
        fetchData(); 
      } else {
        setError(data.message || 'Có lỗi xảy ra khi rút tiền');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  const displayAmount = amount ? parseFloat(amount) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-[#0F766E] transition-colors mb-6 font-medium text-sm"
        >
          <span className="material-symbols-outlined mr-1 text-[20px]">arrow_back</span>
          Quay lại ví
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Form & Selection */}
          <div className="w-full lg:w-[60%] p-6 md:p-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Rút tiền về tài khoản ngân hàng</h2>
            <p className="text-sm text-slate-500 mb-8">Vui lòng chọn tài khoản và nhập số tiền muốn rút từ ví của bạn.</p>

            {/* Available Balance Banner */}
            <div className="mb-8 p-6 bg-gradient-to-r from-teal-500 to-[#0F766E] rounded-2xl text-white shadow-lg shadow-teal-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-teal-100 text-sm font-medium mb-1">Số dư khả dụng để rút</p>
              <h3 className="text-4xl font-bold">{formatMoney(walletBalance)}</h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-start gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-start gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                <p>{success}</p>
              </div>
            )}

            {/* 1. Bank Account Selection */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-slate-800 mb-4">1. Chọn tài khoản nhận tiền</h3>
              {bankAccounts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {bankAccounts.map((bank) => (
                    <label 
                      key={bank.bank_account_id} 
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedBank === bank.bank_account_id ? 'border-[#0F766E] bg-teal-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <input 
                        type="radio" 
                        name="bank" 
                        value={bank.bank_account_id}
                        checked={selectedBank == bank.bank_account_id}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-5 h-5 text-[#0F766E] focus:ring-[#0F766E] border-slate-300 mr-4"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{bank.bank_name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{bank.account_holder_name} • {bank.account_number}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#0F766E]">account_balance</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-5 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-600">warning</span>
                  <div>
                    <p className="font-medium">Chưa có thẻ/tài khoản liên kết</p>
                    <button 
                      onClick={() => {
                        const activeRole = localStorage.getItem('active_role');
                        if (activeRole === 'FREELANCER') {
                          navigate('/freelancer-wallet');
                        } else {
                          navigate('/employer-wallet');
                        }
                      }} 
                      className="text-sm text-yellow-700 underline mt-1"
                    >
                      Đi tới trang quản lý Ví để liên kết ngay
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Amount Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-slate-800">2. Chọn số tiền rút</h3>
                <button 
                  onClick={handleWithdrawAll}
                  className="text-sm text-[#0F766E] font-medium hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                  Rút toàn bộ
                </button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetSelect(val)}
                    disabled={val > walletBalance}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                      !isCustom && parseFloat(amount) === val
                        ? 'border-[#0F766E] bg-teal-50 text-[#0F766E] shadow-sm ring-1 ring-[#0F766E]'
                        : val > walletBalance 
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed' 
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
                  <label className="block text-sm font-medium text-slate-600 mb-2">Nhập số tiền muốn rút (VNĐ)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomChange}
                      placeholder="Ví dụ: 150000"
                      min="10000"
                      max={walletBalance}
                      step="1"
                      className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] outline-none transition-all text-slate-800 font-semibold text-lg bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">VNĐ</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary & History */}
          <div className="w-full lg:w-[40%] bg-slate-50 border-l border-slate-200 flex flex-col justify-between">
            <div className="p-6 md:p-10">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Thông tin rút tiền</h3>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Tài khoản nhận</span>
                  <span className="text-slate-800 font-medium">
                    {bankAccounts.length > 0 && selectedBank 
                      ? bankAccounts.find(b => b.bank_account_id == selectedBank)?.bank_name || 'Chưa chọn'
                      : 'Chưa chọn'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <span className="text-slate-500 text-sm">Số tiền rút</span>
                  <span className="text-slate-800 font-medium">{formatMoney(displayAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                  <span className="text-slate-500 text-sm">Phí giao dịch</span>
                  <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-0.5 rounded">Miễn phí</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-bold">Thực nhận</span>
                  <span className="text-2xl font-bold text-[#0F766E]">{formatMoney(displayAmount)}</span>
                </div>
              </div>

              <form onSubmit={handleWithdraw}>
                <button
                  type="submit"
                  disabled={loading || displayAmount < 10000 || displayAmount > walletBalance || bankAccounts.length === 0}
                  className="w-full py-4 bg-[#0F766E] text-white rounded-xl font-bold text-lg hover:bg-[#0d615b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0F766E]/20"
                >
                  {loading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                  Tạo yêu cầu rút tiền
                </button>
              </form>

              {/* History Section */}
              <div className="mt-10">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">history</span>
                  Giao dịch rút tiền gần đây
                </h3>
                
                <div className="space-y-3">
                  {withdrawals.slice(0, 3).map((w) => (
                    <div key={w.withdrawal_id} className="bg-white p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800">{formatMoney(w.amount)}</span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          w.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          w.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {w.status === 'APPROVED' ? 'Thành công' : w.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-[14px]">account_balance</span>
                        {w.bank_name} (*{w.account_number.slice(-4)})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(w.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))}
                  {withdrawals.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm border border-dashed border-slate-300 rounded-xl">
                      Chưa có giao dịch rút tiền nào.
                    </div>
                  )}
                  {withdrawals.length > 3 && (
                    <button 
                      onClick={() => navigate('/wallet/transactions')}
                      className="w-full text-center text-sm text-[#0F766E] font-medium hover:underline mt-2"
                    >
                      Xem tất cả lịch sử
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
