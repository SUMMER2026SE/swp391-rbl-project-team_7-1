import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VNPayReturnPage() {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Đang xử lý kết quả giao dịch...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // location.search contains the query params from VNPay (e.g. ?vnp_Amount=...)
        if (!location.search) {
          setStatus('error');
          setMessage('Không tìm thấy thông tin giao dịch.');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/payment/vnpay/vnpay_ipn${location.search}`);
        const data = await response.json();

        if (response.ok && data.code === '00') {
          setStatus('success');
          setMessage('Giao dịch thành công. Số dư của bạn đã được cập nhật.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Giao dịch thất bại hoặc đã bị hủy.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Lỗi kết nối khi xác thực giao dịch.');
      }
    };

    verifyPayment();
  }, [location.search]);

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-[#E2E8F0]">
        {status === 'processing' && (
          <>
            <span className="material-symbols-outlined animate-spin text-5xl text-[#0F766E] mb-4">progress_activity</span>
            <h2 className="text-2xl font-bold text-[#334155] mb-2">Đang xử lý...</h2>
            <p className="text-[#475569]">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <span className="material-symbols-outlined text-5xl text-green-500 mb-4">check_circle</span>
            <h2 className="text-2xl font-bold text-[#334155] mb-2">Thanh toán thành công!</h2>
            <p className="text-[#475569] mb-6">{message}</p>
            <button 
              onClick={() => navigate('/employer-wallet')}
              className="w-full bg-[#0F766E] text-white py-2 rounded-lg font-medium hover:bg-[#0d615b] transition-colors"
            >
              Quay lại Ví
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
            <h2 className="text-2xl font-bold text-[#334155] mb-2">Thanh toán thất bại</h2>
            <p className="text-[#475569] mb-6">{message}</p>
            <button 
              onClick={() => navigate('/employer-wallet')}
              className="w-full border border-[#0F766E] text-[#0F766E] py-2 rounded-lg font-medium hover:bg-[#F1F5F9] transition-colors"
            >
              Quay lại Ví
            </button>
          </>
        )}
      </div>
    </main>
  );
}
