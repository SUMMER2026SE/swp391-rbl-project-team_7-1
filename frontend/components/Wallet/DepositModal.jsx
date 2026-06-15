import React, { useState } from 'react';

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ lớn hơn 0.');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#475569] hover:text-[#0F766E] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-xl font-bold text-[#334155] mb-4">Nạp tiền vào ví</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleDeposit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Số tiền ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ví dụ: 100"
              min="1"
              max="9999999999"
              step="0.01"
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d615b] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Xác nhận nạp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
