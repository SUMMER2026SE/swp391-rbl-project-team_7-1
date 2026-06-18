import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api/user';

const statusBadge = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'SUSPENDED':
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'BANNED':
      return 'bg-red-50 text-red-700 border border-red-100';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-100';
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
  const [limit, setLimit] = useState(25);
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
    const actionTextMap = { ban: 'cấm', suspend: 'tạm giữ', activate: 'kích hoạt' };
    const statusToSet = actionMap[action];
    const actionText = actionTextMap[action] || 'thay đổi trạng thái';

    const confirmation = window.confirm(`Bạn có chắc muốn ${actionText} người dùng này không?`);
    if (!confirmation) return;

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
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-8">
        {/* Page Header & Filters */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-headline-2xl text-headline-2xl text-[#334155] mb-2">User Management</h1>
            <p className="font-body-base text-body-base text-[#475569]">Manage, verify, and monitor network participants.</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)]">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchUsers({ page: 1, limit }); } }}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-body-sm text-body-sm text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors"
                placeholder="Search by name, email, or phone..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); }} className="px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white">
                <option value="">All roles</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="EMPLOYER">Employer</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); }} className="px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white">
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="BANNED">Banned</option>
              </select>
              <button onClick={() => { setPage(1); fetchUsers({ page: 1, limit }); }} className="px-4 py-2 bg-[#0F766E] text-white rounded-lg">Search</button>
              <button onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setPage(1); fetchUsers({ page: 1, limit }); }} className="px-4 py-2 border border-[#E2E8F0] rounded-lg">Reset</button>
            </div>
          </div>
        </div>

        {alert.msg && (
          <div className={`px-4 py-3 rounded-xl ${alert.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'} border`}>
            {alert.msg}
          </div>
        )}

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">User</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Phone</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Role</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Status</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Verification</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold">Created</th>
                  <th className="py-4 px-6 font-label-caps text-label-caps text-[#475569] font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[#475569]">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[#475569]">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#475569] font-bold font-body-sm">
                            {user.full_name ? user.full_name.split(' ').map((part) => part[0]).slice(0, 2).join('') : 'U'}
                          </div>
                          <div>
                            <div className="font-body-base text-body-base font-semibold text-[#334155]">{user.full_name}</div>
                            <div className="font-body-sm text-body-sm text-[#475569]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#475569]">{user.phone || '-'}</td>
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#334155]">{user.role_default}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-caps text-label-caps ${statusBadge(user.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : user.status === 'BANNED' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-caps text-label-caps ${user.is_email_verified ? 'bg-slate-50 text-slate-700 border border-slate-100' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_email_verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {user.is_email_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-body-sm text-body-sm text-[#475569]">{new Date(user.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                          {user.status === 'ACTIVE' && (
                            <>
                              <button
                                onClick={() => handleAction(user.user_id, 'suspend')}
                                className="px-3 py-1.5 rounded-md border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white font-label-caps text-label-caps transition-colors"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => handleAction(user.user_id, 'ban')}
                                className="px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-label-caps text-label-caps transition-colors"
                              >
                                Ban
                              </button>
                            </>
                          )}

                          {user.status === 'SUSPENDED' && (
                            <>
                              <button
                                onClick={() => handleAction(user.user_id, 'activate')}
                                className="px-3 py-1.5 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-label-caps text-label-caps transition-colors"
                              >
                                Activate
                              </button>
                              <button
                                onClick={() => handleAction(user.user_id, 'ban')}
                                className="px-3 py-1.5 rounded-md border border-red-100 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-label-caps text-label-caps transition-colors"
                              >
                                Ban
                              </button>
                            </>
                          )}

                          {user.status === 'BANNED' && (
                            <button
                              onClick={() => handleAction(user.user_id, 'activate')}
                              className="px-3 py-1.5 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-label-caps text-label-caps transition-colors"
                            >
                              Activate
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
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4 px-4 py-3 bg-[#FFFFFF] border-t border-[#E2E8F0]">
          <div className="text-sm text-[#475569]">
            Hiển thị {users.length} trên {total} người dùng
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
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-[#475569]">
              Page {page} of {totalPages}
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
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
