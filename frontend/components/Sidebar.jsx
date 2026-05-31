import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const FREELANCER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5kfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g";
const EMPLOYER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXu5Fhk-ytABwDE8c_Mn6mvYTC_3C7zksVlCcGgU8B6GSnt-6Rf9KpS5hs2iaprobtQ6UsK3MBqV8G1lHLZFeg1A3jmXRyhfwzQCqnVHUL6z0FW6pg-r4okgr9n93xAPkFgFtmjxAsawka2dQyzgThp0UUwiYARotIOrpccljPZKGv3QQAeDDpTATUEqRXqQ4bHeaMBPyMctfwD--N2zqSHdVNmNJHm5ZgG3SJ4c8Wxf7SnMEOjiwbDx3E_XSvwzRUU7fpKhAzHFoY0";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  let role = 'freelancer';
  if (path.startsWith('/admin')) {
    role = 'admin';
  } else if (
    path.includes('employer') ||
    path === '/manage-proposals' ||
    path === '/review-submission' ||
    path === '/revision-requested' ||
    path === '/project-details' ||
    path === '/post-project' ||
    path === '/escrow-checkout'
  ) {
    role = 'employer';
  }

  // When on /profile, determine role from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  if (path === '/profile' && user?.roleDefault) {
    const rd = user.roleDefault.toLowerCase();
    if (rd === 'employer') role = 'employer';
    else if (rd === 'admin') role = 'admin';
    else role = 'freelancer';
  }



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSwitchRole = () => {
    if (role === 'freelancer') {
      navigate('/employer-dashboard');
    } else {
      navigate('/freelancer-dashboard');
    }
  };

  let items = [];
  let user_name = '';
  let user_role = '';
  let avatar = '';
  let bottom_btn = null;
  let bottom_btn_link = '#';

  if (role === 'freelancer') {
    items = [
      { label: 'Dashboard', icon: 'dashboard', link: '/freelancer-dashboard' },
      { label: 'Browse Projects', icon: 'work', link: '/browse-projects' },
      { label: 'Wallet', icon: 'payments', link: '/freelancer-wallet' },
      { label: 'Messages', icon: 'chat', link: '/messages-freelancer' },
      { label: 'Profile', icon: 'account_circle', link: '/profile' },
    ];
    user_name = user ? user.fullName : 'Alexander';
    user_role = 'Freelancer';
    avatar = FREELANCER_AVATAR;
    bottom_btn = 'Find a Project';
    bottom_btn_link = '/browse-projects';
  } else if (role === 'employer') {
    items = [
      { label: 'Dashboard', icon: 'dashboard', link: '/employer-dashboard' },
      { label: 'My Projects', icon: 'work', link: '/manage-proposals' },
      { label: 'Find Freelancers', icon: 'group', link: '/browse-projects' },
      { label: 'Wallet', icon: 'payments', link: '/employer-wallet' },
      { label: 'Messages', icon: 'chat', link: '/messages-employer' },
      { label: 'Profile', icon: 'account_circle', link: '/profile' },
    ];
    user_name = user ? user.fullName : 'TechCorp Inc.';
    user_role = 'Employer';
    avatar = EMPLOYER_AVATAR;
    bottom_btn = 'Post New Project';
    bottom_btn_link = '/post-project';
  } else if (role === 'admin') {
    items = [
      { label: 'Dashboard', icon: 'dashboard', link: '/admin-dashboard' },
      { label: 'User Management', icon: 'group', link: '/admin-users' },
      { label: 'Disputes', icon: 'gavel', link: '/admin-disputes' },
      { label: 'Reports', icon: 'summarize', link: '/admin-generate-report' },
      { label: 'Analytics', icon: 'analytics', link: '/admin-analytics' },
      { label: 'Settings', icon: 'settings', link: '/admin-settings' }
    ];
    user_name = user ? user.fullName : 'Admin Panel';
    user_role = 'System Admin';
    avatar = EMPLOYER_AVATAR;
  }

  const isItemActive = (item) => {
    if (item.link === '#') return false;
    if (path === item.link) return true;
    if (item.label === 'Reports' && path.startsWith('/admin-report')) return true;
    if (item.label === 'Dashboard' && path.endsWith('-dashboard')) return true;
    if (item.label === 'Wallet' && path.endsWith('-wallet')) return true;
    if (item.label === 'Profile' && path === '/profile') return true;
    if (item.label === 'My Projects' && (path === '/review-submission' || path === '/revision-requested' || path === '/project-details')) return true;
    return false;
  };

  return (
    <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-6 px-4 w-64 bg-white border-r border-slate-200 z-40 shadow-[4px_0_24px_rgba(15,23,42,0.02)] transition-all duration-300">
      <div className="mb-8 px-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F766E] shadow-sm border border-teal-100">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {role === 'employer' ? 'business_center' : role === 'admin' ? 'admin_panel_settings' : 'work'}
          </span>
        </div>
        <span className="text-3xl text-slate-800 font-extrabold tracking-tighter">FJMS</span>
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
          return (
            <li key={idx}>
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-50 text-[#0F766E] shadow-sm border border-teal-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                to={item.link}
              >
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-[#0F766E]' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
                {item.label}
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
              Help Center
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-left border-none">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
