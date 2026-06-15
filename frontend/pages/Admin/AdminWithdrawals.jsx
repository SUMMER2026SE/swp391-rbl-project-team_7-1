import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/withdrawal/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    }
  };

  const handleAction = async (id, action) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${action === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu rút tiền này?`)) {
      return;
    }

    setLoading(true);
    setActionError('');
    setActionSuccess('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5000/api/withdrawal/admin/${action}/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setActionSuccess(data.message);
        fetchWithdrawals();
      } else {
        setActionError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setActionError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Yêu cầu Rút tiền</h1>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start border border-red-200">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start border border-green-200">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                <th className="p-4">ID</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Số tiền</th>
                <th className="p-4">Thông tin ngân hàng</th>
                <th className="p-4">Thời gian tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {withdrawals.length > 0 ? (
                withdrawals.map((w) => (
                  <tr key={w.withdrawal_id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">#{w.withdrawal_id}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">{w.user_id}</td>
                    <td className="p-4 text-sm font-bold text-indigo-600">{formatCurrency(w.amount)}</td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{w.bank_name}</div>
                      <div className="text-xs text-gray-500">STK: {w.account_number}</div>
                      <div className="text-xs text-gray-500">Tên: {w.account_holder_name}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(w.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        w.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                        w.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {w.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                        {w.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {w.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {w.status === 'PENDING' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(w.withdrawal_id, 'approve')}
                            disabled={loading}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleAction(w.withdrawal_id, 'reject')}
                            disabled={loading}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Không có yêu cầu rút tiền nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
