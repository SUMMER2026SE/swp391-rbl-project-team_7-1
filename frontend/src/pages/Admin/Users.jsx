import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/user';

const statusBadge = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-teal-50 text-teal-700 border border-teal-100';
    case 'SUSPENDED':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'BANNED':
      return 'bg-rose-50 text-rose-700 border border-rose-100';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-100';
  }
};

const statusText = (status) => {
  switch (status) {
    case 'ACTIVE': return 'Hoạt động';
    case 'SUSPENDED': return 'Tạm khóa';
    case 'BANNED': return 'Bị cấm';
    default: return status;
  }
};

const roleText = (role) => {
  switch (role) {
    case 'FREELANCER': return 'Freelancer';
    case 'EMPLOYER': return 'Nhà tuyển dụng';
    case 'ADMIN': return 'Quản trị viên';
    default: return role;
  }
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = (() => {
    const raw = localStorage.getItem('token');
    return raw && raw !== 'null' && raw !== 'undefined' ? raw : null;
  })();

  const fetchUsers = async (opts = {}) => {
    setLoading(true);
    setAlert({ type: '', msg: '' });

    if (!token) {
      setAlert({ type: 'error', msg: 'Vui lòng đăng nhập để truy cập trang này.' });
      setLoading(false);
      return;
    }

    try {
      const q = new URLSearchParams();
      const p = opts.page || page;
      const l = opts.limit || limit;
      if (search) q.set('search', search);
      if (roleFilter) q.set('role', roleFilter);
      if (statusFilter) q.set('status', statusFilter);
      q.set('page', p);
      q.set('limit', l);

      const res = await fetch(`${API}/admin/users?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || 'Không thể tải danh sách người dùng.' });
      } else {
        setUsers(data.data?.users || []);
        setTotal(data.data?.total || 0);
        setPage(data.data?.page || p);
        setLimit(data.data?.limit || l);
        setTotalPages(data.data?.totalPages || Math.max(Math.ceil((data.data?.total || 0) / l), 1));
      }
    } catch (error) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1, limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (userId, action) => {
    const actionMap = {
      ban: 'BANNED',
      suspend: 'SUSPENDED',
      activate: 'ACTIVE'
    };
    const actionTextMap = { ban: 'cấm', suspend: 'tạm khóa', activate: 'kích hoạt' };
    const statusToSet = actionMap[action];
    const actionText = actionTextMap[action] || 'thay đổi trạng thái';

    const result = await Swal.fire({
      title: `${action === 'activate' ? 'Kích hoạt' : action === 'ban' ? 'Cấm' : 'Tạm khóa'} người dùng?`,
      text: `Bạn có chắc muốn ${actionText} người dùng này không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'activate' ? '#0F766E' : '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/admin/${userId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusToSet })
      });
      const data = await res.json();

      if (!res.ok) {
        setAlert({ type: 'error', msg: data.message || `Thực hiện ${actionText} thất bại.` });
        return;
      }

      setAlert({ type: 'success', msg: data.message || `Thực hiện ${actionText} thành công.` });
      fetchUsers();
      setTimeout(() => setAlert({ type: '', msg: '' }), 4000);
    } catch (error) {
      setAlert({ type: 'error', msg: 'Lỗi kết nối máy chủ. Vui lòng thử lại.' });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý người dùng</h1>
            <p className="text-xs text-slate-450 font-semibold">Giám sát, phân quyền và điều chỉnh trạng thái hoạt động của tài khoản người dùng.</p>
          </div>
          <div className="bg-[#0F766E]/5 border border-[#0F766E]/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 self-start md:self-auto">
            <span className="material-symbols-outlined text-[#0F766E] text-[18px]">group</span>
            <span className="text-xs font-extrabold text-[#0F766E]">Tổng cộng: {total} người dùng</span>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            
            {/* Search Box */}
            <div className="relative w-full lg:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchUsers({ page: 1, limit }); } }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 transition-all duration-200"
                placeholder="Tìm tên, email, số điện thoại..."
                type="text"
              />
            </div>

            {/* Filter Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-650 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all"
              >
                <option value="">Tất cả vai trò</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="EMPLOYER">Nhà tuyển dụng</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-655 focus:outline-none focus:border-[#0F766E] hover:border-slate-300 transition-all"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="SUSPENDED">Tạm khóa</option>
                <option value="BANNED">Bị cấm</option>
              </select>

              <button
                onClick={() => { setPage(1); fetchUsers({ page: 1, limit }); }}
                className="px-4 py-2 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border-none"
              >
                Tìm kiếm
              </button>

              <button
                onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setPage(1); fetchUsers({ page: 1, limit }); }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Custom Toast Alert */}
        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top-1 ${alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border-rose-100 text-rose-800'
            }`}>
            <span className="material-symbols-outlined text-[16px]">
              {alert.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {alert.msg}
          </div>
        )}

        {/* Custom Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-150">
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Họ tên &amp; Email</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vai trò</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Xác thực</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-7 h-7 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold text-slate-400">Đang tải danh sách người dùng...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-slate-400 font-bold text-xs">
                      Không tìm thấy tài khoản người dùng phù hợp.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-50/50 text-[#0F766E] border border-teal-100/50 flex items-center justify-center font-bold text-xs">
                            {user.full_name ? user.full_name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs">{user.full_name}</div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-5 font-bold text-slate-500 text-xs">{user.phone || 'Chưa cung cấp'}</td>

                      {/* Role */}
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${user.role_default === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : user.role_default === 'EMPLOYER'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                          {roleText(user.role_default)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(user.status)}`}>
                          <span className={`w-1 h-1 rounded-full ${user.status === 'ACTIVE' ? 'bg-teal-500' : user.status === 'BANNED' ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                          {statusText(user.status)}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${user.is_email_verified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                          <span className={`material-symbols-outlined text-[12px] ${user.is_email_verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {user.is_email_verified ? 'verified' : 'pending'}
                          </span>
                          {user.is_email_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                        </span>
                      </td>

                      {/* Join Date */}
                      <td className="py-3 px-5 text-slate-400 text-xs font-semibold">
                        {new Date(user.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {user.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleAction(user.user_id, 'ban')}
                              className="px-3.5 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                            >
                              Tạm khóa
                            </button>
                          )}

                          {user.status === 'SUSPENDED' && (
                            <>
                              <button
                                onClick={() => handleAction(user.user_id, 'activate')}
                                className="px-3.5 py-1.5 rounded-lg border border-teal-100 bg-teal-50/50 hover:bg-teal-600 text-teal-700 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                              >
                                Kích hoạt
                              </button>
                              <button
                                onClick={() => handleAction(user.user_id, 'ban')}
                                className="px-3.5 py-1.5 rounded-lg border border-rose-100 bg-rose-50/50 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                              >
                                Cấm
                              </button>
                            </>
                          )}

                          {user.status === 'BANNED' && (
                            <button
                              onClick={() => handleAction(user.user_id, 'activate')}
                              className="px-3.5 py-1.5 rounded-lg border border-teal-100 bg-teal-50/50 hover:bg-teal-600 text-teal-700 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                            >
                              Kích hoạt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Hiển thị {users.length} trên tổng số {total} tài khoản người dùng.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (page > 1) {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    fetchUsers({ page: nextPage, limit });
                  }
                }}
                disabled={page <= 1}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Trước
              </button>
              <span className="text-[10px] font-extrabold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => {
                  if (page < totalPages) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchUsers({ page: nextPage, limit });
                  }
                }}
                disabled={page >= totalPages}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}