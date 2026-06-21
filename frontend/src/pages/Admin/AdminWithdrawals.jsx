import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  // Client-side filtering
  const filteredWithdrawals = withdrawals.filter((w) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (w.bank_name || '').toLowerCase().includes(term) ||
      (w.account_number || '').toLowerCase().includes(term) ||
      (w.account_holder_name || '').toLowerCase().includes(term) ||
      String(w.user_id).includes(term) ||
      String(w.withdrawal_id).includes(term);

    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Duyệt rút tiền</h1>
          <p className="text-sm text-slate-500 font-medium">Xem xét, kiểm tra và phê duyệt/từ chối các yêu cầu rút tiền từ tài khoản của Freelancer và Nhà tuyển dụng.</p>
        </div>

        {/* Sync Search & Filter Panel */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all duration-200"
              placeholder="Tìm theo chủ tài khoản, số TK, ngân hàng, ID..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-slate-600 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 transition-all"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
            <button 
              onClick={() => {}} 
              className="px-5 py-2.5 bg-[#0F766E] text-white rounded-2xl text-sm font-bold shadow-[0_4px_12px_rgba(15,118,110,0.15)] hover:bg-[#0d5e58] hover:shadow-[0_4px_16px_rgba(15,118,110,0.25)] transition-all cursor-pointer animate-fade-in"
            >
              Tìm kiếm
            </button>
            <button 
              onClick={() => { setSearch(''); setStatusFilter('ALL'); }} 
              className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Alerts */}
        {actionError && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2 text-rose-800 text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{actionError}</span>
          </div>
        )}

        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Mã yêu cầu</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Mã người dùng</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Số tiền rút</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Thông tin tài khoản nhận</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Thời gian yêu cầu</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredWithdrawals.length > 0 ? (
                  filteredWithdrawals.map((w) => (
                    <tr key={w.withdrawal_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">#{w.withdrawal_id}</td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-800">#{w.user_id}</td>
                      <td className="py-4 px-6 text-sm font-black text-indigo-700">{formatCurrency(w.amount)}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-slate-800">{w.bank_name}</div>
                        <div className="text-xs text-slate-500 font-semibold mt-0.5">Số tài khoản: {w.account_number}</div>
                        <div className="text-xs text-slate-400 font-medium">Chủ tài khoản: {w.account_holder_name}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 font-semibold">
                        {new Date(w.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          w.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          w.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            w.status === 'APPROVED' ? 'bg-emerald-500' : 
                            w.status === 'REJECTED' ? 'bg-rose-500' : 
                            'bg-amber-500'
                          }`}></span>
                          {w.status === 'APPROVED' ? 'Đã duyệt' : w.status === 'REJECTED' ? 'Từ chối' : 'Chờ xử lý'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {w.status === 'PENDING' ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleAction(w.withdrawal_id, 'approve')}
                              disabled={loading}
                              className="px-3.5 py-1.5 bg-[#0F766E] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#0d5e58] disabled:opacity-50 transition-all cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleAction(w.withdrawal_id, 'reject')}
                              disabled={loading}
                              className="px-3.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-600 hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold italic">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-semibold text-sm">
                      Không tìm thấy yêu cầu rút tiền nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
