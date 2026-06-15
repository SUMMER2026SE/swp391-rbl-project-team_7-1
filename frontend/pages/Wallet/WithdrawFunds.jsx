import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawFunds() {
  const [amount, setAmount] = useState('');
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
      // Fetch wallet balance
      const balanceRes = await fetch('http://localhost:5000/api/wallet/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json();
        setWalletBalance(balanceData.balance);
      }

      // Fetch bank accounts
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

      // Fetch withdrawal history
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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || amount <= 0) {
      setError('Số tiền rút phải lớn hơn 0');
      return;
    }
    if (amount > walletBalance) {
      setError('Số dư ví không đủ');
      return;
    }
    if (!selectedBank) {
      setError('Vui lòng chọn tài khoản ngân hàng');
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
          amount: parseFloat(amount),
          bank_account_id: parseInt(selectedBank)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Đã gửi yêu cầu rút tiền thành công. Vui lòng chờ phê duyệt.');
        setAmount('');
        fetchData(); // Refresh history and balance
      } else {
        setError(data.message || 'Có lỗi xảy ra khi rút tiền');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rút tiền về tài khoản ngân hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Withdrawal Form */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Landmark className="mr-2 h-5 w-5 text-indigo-600" />
            Tạo yêu cầu rút tiền
          </h2>
          
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-indigo-800 font-medium mb-1">Số dư khả dụng</p>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(walletBalance)}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tài khoản nhận tiền
              </label>
              {bankAccounts.length > 0 ? (
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {bankAccounts.map((bank) => (
                    <option key={bank.bank_account_id} value={bank.bank_account_id}>
                      {bank.bank_name} - {bank.account_number}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                  Bạn chưa liên kết tài khoản ngân hàng nào. Vui lòng thêm ngân hàng trong phần Cài đặt thanh toán.
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tiền cần rút (VND)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                  max={walletBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                />
                <span className="absolute left-3 top-2.5 text-gray-500">₫</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || bankAccounts.length === 0 || walletBalance <= 0}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận rút tiền'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-600" />
            Lịch sử rút tiền
          </h2>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <div key={w.withdrawal_id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(w.amount)}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {w.bank_name} (*{w.account_number.slice(-4)})
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      w.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      w.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {w.status === 'APPROVED' ? 'Thành công' : 
                       w.status === 'REJECTED' ? 'Bị từ chối' : 'Chờ duyệt'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(w.created_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có giao dịch rút tiền nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
