import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FREELANCER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5kfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g";
const EMPLOYER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXu5Fhk-ytABwDE8c_Mn6mvYTC_3C7zksVlCcGgU8B6GSnt-6Rf9KpS5hs2iaprobtQ6UsK3MBqV8G1lHLZFeg1A3jmXRyhfwzQCqnVHUL6z0FW6pg-r4okgr9n93xAPkFgFtmjxAsawka2dQyzgThp0UUwiYARotIOrpccljPZKGv3QQAeDDpTATUEqRXqQ4bHeaMBPyMctfwD--N2zqSHdVNmNJHm5ZgG3SJ4c8Wxf7SnMEOjiwbDx3E_XSvwzRUU7fpKhAzHFoY0";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  // Determine user role and setup sidebar menu items based on the active path
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

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
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
      { label: 'Settings', icon: 'settings', link: '#' }
    ];
    user_name = user ? user.fullName : 'Alexander';
    user_role = 'Verified Pro';
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
      { label: 'Settings', icon: 'settings', link: '#' }
    ];
    user_name = user ? user.fullName : 'TechCorp Inc.';
    user_role = 'Verified Employer';
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

  // Active status matcher helper
  const isItemActive = (item) => {
    if (item.link === '#') return false;
    
    // Exact match
    if (path === item.link) return true;
    
    // Sub-path grouping matches
    if (item.label === 'Reports' && path.startsWith('/admin-report')) return true;
    if (item.label === 'Dashboard' && path.endsWith('-dashboard')) return true;
    if (item.label === 'Wallet' && path.endsWith('-wallet')) return true;
    if (item.label === 'Wallet' && item.label === 'My Projects' && path === '/post-project') return true;
    if (item.label === 'My Projects' && (path === '/review-submission' || path === '/revision-requested' || path === '/project-details')) return true;
    
    return false;
  };

  return (
    <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 py-6 px-4 w-64 bg-gradient-to-r from-[#1E293B] to-[#334155] border-r border-slate-700 z-40">
      <div className="mb-8 px-2 flex items-center gap-3">
        <span className="font-headline-xl text-headline-xl text-white font-bold tracking-tight">FJMS</span>
      </div>
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-1">
          <img alt="User Profile Avatar" className="w-10 h-10 rounded-full border border-slate-600 object-cover" src={avatar} />
          <div>
            <p className="font-body-base text-body-base font-semibold text-white">{user_name}</p>
            <p className="font-body-sm text-body-sm text-slate-300 font-medium">{user_role}</p>
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-1 flex-1">
        {items.map((item, idx) => {
          const isActive = isItemActive(item);
          return (
            <li key={idx}>
              <Link
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-body-sm text-body-sm transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold translate-x-1'
                    : 'text-slate-300 font-medium hover:bg-slate-700/50'
                }`}
                to={item.link}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-6 flex flex-col gap-3">
        {bottom_btn && (
          <Link to={bottom_btn_link} className="w-full text-center py-2 bg-gradient-to-r from-[#1E293B] to-[#334155] border border-slate-600 text-white rounded-lg font-body-sm text-body-sm font-semibold hover:border-[#0F766E] hover:shadow-[0_0_8px_rgba(15,118,110,0.5)] transition-all duration-300">
            {bottom_btn}
          </Link>
        )}
        <ul className="flex flex-col gap-1 border-t border-slate-600 pt-4">
          <li>
            <Link className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 font-body-sm text-body-sm hover:bg-slate-700/50 transition-all" to="/help-center">
              <span className="material-symbols-outlined text-[20px]">help</span>
              Help Center
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 font-body-sm text-body-sm hover:bg-slate-700/50 transition-all cursor-pointer text-left">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
