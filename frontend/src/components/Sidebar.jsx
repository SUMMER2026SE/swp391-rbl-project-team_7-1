import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { AuthContext } from '../contexts/AuthContext';

const FREELANCER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5kfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g";
const EMPLOYER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXu5Fhk-ytABwDE8c_Mn6mvYTC_3C7zksVlCcGgU8B6GSnt-6Rf9KpS5hs2iaprobtQ6UsK3MBqV8G1lHLZFeg1A3jmXRyhfwzQCqnVHUL6z0FW6pg-r4okgr9n93xAPkFgFtmjxAsawka2dQyzgThp0UUwiYARotIOrpccljPZKGv3QQAeDDpTATUEqRXqQ4bHeaMBPyMctfwD--N2zqSHdVNmNJHm5ZgG3SJ4c8Wxf7SnMEOjiwbDx3E_XSvwzRUU7fpKhAzHFoY0";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [localUser, setLocalUser] = React.useState(() => {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) : null;
  });

  const activeRole = localStorage.getItem('active_role');
  let role = activeRole || localUser?.roleDefault?.toLowerCase() || 'freelancer';

  if (path.startsWith('/admin') || localUser?.roleDefault === 'ADMIN') {
    role = 'admin';
  }

  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const handleUpdate = () => {
      const s = localStorage.getItem('user');
      setLocalUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('profileUpdated', handleUpdate);
    return () => window.removeEventListener('profileUpdated', handleUpdate);
  }, []);

  React.useEffect(() => {
    if (role === 'admin') return;

    const fetchUnreadCount = async () => {
      try {
        const activeRole = role === 'employer' ? 'EMPLOYER' : 'FREELANCER';
        const data = await chatService.getConversations(activeRole);
        const conversations = data.conversations || [];
        const count = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        setUnreadCount(count);
      } catch (err) {
        console.error('Lỗi khi lấy số tin nhắn chưa đọc trong Sidebar:', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 8000);

    const handleFocus = () => fetchUnreadCount();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('chatReadUpdate', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('chatReadUpdate', handleFocus);
    };
  }, [role]);

  const user = localUser;

  // When on /profile, determine role from localStorage
  if (path === '/profile' && user?.roleDefault) {
    const rd = user.roleDefault.toLowerCase();
    if (rd === 'employer') role = 'employer';
    else if (rd === 'admin') role = 'admin';
    else role = 'freelancer';
  }

  const handleLogout = () => {
    logout({ redirect: '/' });
  };

  let items = [];
  let user_name = '';
  let user_role = '';
  let avatar = '';
  let bottom_btn = null;
  let bottom_btn_link = '#';

  if (role === 'freelancer') {
    items = [
      { label: 'Bảng điều khiển', icon: 'dashboard', link: '/freelancer-dashboard' },
      { label: 'Khám phá dự án', icon: 'work', link: '/browse-projects' },
      { label: 'Ví tiền', icon: 'payments', link: '/freelancer-wallet' },
      { label: 'Tin nhắn', icon: 'chat', link: '/messages-freelancer' },
      { label: 'Hồ sơ', icon: 'account_circle', link: '/profile' },
    ];
    user_name = user ? user.fullName : 'Alexander';
    user_role = 'Freelancer';
    avatar = user?.avatarUrl || FREELANCER_AVATAR;
    bottom_btn = 'Tìm dự án';
    bottom_btn_link = '/browse-projects';
  } else if (role === 'employer') {
    items = [
      { label: 'Bảng điều khiển', icon: 'dashboard', link: '/employer-dashboard' },
      { label: 'Dự án của tôi', icon: 'work', link: '/my-projects' },
      { label: 'Ví tiền', icon: 'payments', link: '/employer-wallet' },
      { label: 'Tin nhắn', icon: 'chat', link: '/messages-employer' },
      { label: 'Hồ sơ', icon: 'account_circle', link: '/profile' },
    ];
    user_name = user ? user.fullName : 'TechCorp Inc.';
    user_role = 'Nhà tuyển dụng';
    avatar = user?.avatarUrl || EMPLOYER_AVATAR;
    bottom_btn = 'Đăng dự án mới';
    bottom_btn_link = '/post-project';
  } else if (role === 'admin') {
    items = [
      { label: 'Bảng điều khiển', icon: 'dashboard', link: '/admin-dashboard' },
      { label: 'Người dùng', icon: 'group', link: '/admin-users' },
      { label: 'Tổng dự án', icon: 'work', link: '/admin-projects' },
      { label: 'Duyệt rút tiền', icon: 'payments', link: '/admin-withdrawals' },
      { label: 'Tranh chấp', icon: 'gavel', link: '/admin-disputes' },
      { label: 'Vi phạm', icon: 'warning', link: '/admin-violations' },
      { label: 'Thống kê', icon: 'analytics', link: '/admin-analytics' }
    ];
    user_name = user ? user.fullName : 'Admin Panel';
    user_role = 'Quản trị viên';
    avatar = user?.avatarUrl || EMPLOYER_AVATAR;
  }

  const isItemActive = (item) => {
    if (item.link === '#') return false;
    if (path === item.link) return true;
    if (item.label === 'Tìm Freelancer' && (path === '/freelancers' || path.startsWith('/profile/') || path.startsWith('/freelancers/'))) return true;
    if (item.label === 'Báo cáo' && path.startsWith('/admin-report')) return true;
    if (item.label === 'Bảng điều khiển' && (path.endsWith('-dashboard') || path.startsWith('/review-submission') || path === '/revision-requested')) return true;
    if (item.label === 'Dự án của tôi' && (path === '/my-projects' || path.startsWith('/manage-proposals') || path.startsWith('/project-details') || path === '/post-project' || path.startsWith('/edit-project'))) return true;
    if (item.label === 'Ví tiền' && path.endsWith('-wallet')) return true;
    if (item.label === 'Hồ sơ' && path === '/profile') return true;
    return false;
  };

  return (
    <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-6 px-4 w-64 bg-white border-r border-slate-200 z-40 shadow-[4px_0_24px_rgba(15,23,42,0.02)] transition-all duration-300">
      <div className="mb-8 px-2">
        <Link className="flex items-center gap-2.5 group cursor-pointer border-none text-decoration-none" to="/">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_4px_12px_rgba(20,184,166,0.2)] group-hover:rotate-6 transition-all duration-300">
            <span className="material-symbols-outlined text-[22px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">FJMS</span>
            <span className="text-[9px] text-[#0F766E] font-bold uppercase tracking-widest mt-0.5">Platform</span>
          </div>
        </Link>
      </div>

      {/* User Profile */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          <img alt="User Profile Avatar" className="w-11 h-11 rounded-full object-cover shadow-sm border border-white" src={avatar} />
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user_name}</p>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#0F766E] mt-0.5">{user_role}</p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar px-1">
        {items.map((item, idx) => {
          const isActive = isItemActive(item);
          const isChat = item.label === 'Tin nhắn';
          return (
            <li key={idx}>
              <Link
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-teal-50 text-[#0F766E] shadow-sm border border-teal-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                to={item.link}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-[#0F766E]' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
                  {item.label}
                </div>
                {isChat && unreadCount > 0 && (
                  <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-black text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-[0_2px_8px_rgba(244,63,94,0.4)] border border-rose-400/20 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-6 flex flex-col gap-3 px-1">
        {bottom_btn && (
          <Link to={bottom_btn_link} className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F766E] text-white rounded-xl text-sm font-bold hover:bg-[#0D5E58] hover:shadow-[0_4px_12px_rgba(15,118,110,0.2)] transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            {bottom_btn}
          </Link>
        )}
        <ul className="flex flex-col gap-1 border-t border-slate-100 pt-4 mt-2">
          <li>
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all" to="/help-center">
              <span className="material-symbols-outlined text-[20px] text-slate-400">help</span>
              Trung tâm hỗ trợ
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-left border-none">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
