import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function EscrowDepositPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract amount from query parameter ?amount=xxx
  const [amount, setAmount] = useState(() => {
    const query = new URLSearchParams(window.location.search);
    return query.get('amount') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-[#E2E8F0]">
          <span className="material-symbols-outlined text-5xl text-green-500 mb-4">check_circle</span>
          <h2 className="text-2xl font-bold text-[#334155] mb-2">Ký quỹ thành công!</h2>
          <p className="text-[#475569] mb-6">Số tiền đã được giữ an toàn trong hệ thống cho dự án #{projectId}.</p>
          <button 
            onClick={() => navigate('/employer-wallet')}
            className="w-full bg-[#0F766E] text-white py-2 rounded-lg font-medium hover:bg-[#0d615b] transition-colors"
          >
            Quay lại Ví
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#E2E8F0]">
        <h2 className="text-2xl font-bold text-[#334155] mb-2">Ký quỹ dự án</h2>
        <p className="text-[#475569] mb-6">Chuyển tiền từ Ví vào Escrow cho dự án #{projectId}</p>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex flex-col gap-3">
            <span>{error}</span>
            {error.toLowerCase().includes('không đủ') && (
              <button
                type="button"
                onClick={handleVNPayRedirect}
                className="w-full bg-[#0F766E] hover:bg-[#0d615b] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border-none shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                Nạp tiền bằng VNPay (Quét mã QR)
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleDeposit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Số tiền cần ký quỹ ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền..."
              min="1"
              step="0.01"
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors"
              required
            />
            <p className="text-xs text-on-surface-variant mt-2">Lưu ý: Số dư trong ví của bạn phải lớn hơn hoặc bằng số tiền này.</p>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#F8FAFC] transition-colors w-1/2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d615b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
