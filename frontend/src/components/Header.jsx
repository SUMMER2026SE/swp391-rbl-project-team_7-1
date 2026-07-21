import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const TOPNAV_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDfcb0ULIPAGFpFTGtxwLfbOB2oUqhUHF7jRLM04_2mQn41242YVyt0ooenMnEya06i1YgpOXU9R4PmQIlSr4JQXZWNC2kJ1Sf1pctYioZKS-Y_QjNfHzRKDH8Zw6N2I6vLk7b7YX4cmdNdgRygC0Ry3iVzCd_g-u6MQ99D7gUDuoua5m6LDVko-U3PIUVhPLVsJNauxWn2rBwRgfo1VnCItIQtaNLFp6o0Tv18-Da0ZBA5ZDbjbrcVV_ATaFKfPTqYrB0f0uFaA";

export default function Header({ layout = 'dashboard' }) {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [token, setToken] = React.useState(() => {
    const rawToken = localStorage.getItem('token');
    return rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
  });
  const [user, setUser] = React.useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr && userStr !== 'null' && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  });
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const checkAuth = () => {
      const rawToken = localStorage.getItem('token');
      const currentToken = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
      if (currentToken !== token) {
        setToken(currentToken);
      }
      const userStr = localStorage.getItem('user');
      const currentUser = userStr && userStr !== 'null' && userStr !== 'undefined' ? JSON.parse(userStr) : null;
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    };

    const interval = setInterval(checkAuth, 500);
    return () => clearInterval(interval);
  }, [token, user]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout({ redirect: '/' });
  };

  // Helper to determine the opposite dashboard role when clicking "Switch Role"
  const handleSwitchRole = () => {
    const activeRole = localStorage.getItem('active_role');
    const currentRole = activeRole || user?.roleDefault?.toLowerCase() || 'freelancer';

    if (currentRole === 'freelancer') {
      localStorage.setItem('active_role', 'employer');
      navigate('/employer-dashboard');
    } else {
      localStorage.setItem('active_role', 'freelancer');
      navigate('/freelancer-dashboard');
    }
  };

  const [searchVal, setSearchVal] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchVal(params.get('q') || '');
  }, [location.search]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (path === '/browse-projects') {
      navigate(`/browse-projects?q=${encodeURIComponent(val)}`, { replace: true });
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/browse-projects?q=${encodeURIComponent(searchVal)}`);
    }
  };

  if (layout === 'public') {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1440px] mx-auto h-[80px] gap-6">
          <div className="flex items-center gap-10 shrink-0">
            <Link className="flex items-center gap-2.5 group cursor-pointer border-none text-decoration-none" to="/">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-[0_4px_12px_rgba(20,184,166,0.2)] group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[22px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#0F766E] tracking-tighter leading-none">FJMS</span>
                <span className="text-[9px] text-[#0F766E] font-bold uppercase tracking-widest mt-0.5">Platform</span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-2 ml-6">
              <Link className={`text-[15px] font-bold px-4 py-2 rounded-xl transition-all duration-300 ${path === '/' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'}`} to="/">
                Trang chủ
              </Link>
              <Link className={`text-[15px] font-bold px-4 py-2 rounded-xl transition-all duration-300 ${path === '/browse-projects' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'}`} to="/browse-projects">
                Khám phá dự án
              </Link>
              <Link className={`text-[15px] font-bold px-4 py-2 rounded-xl transition-all duration-300 ${path === '/freelancers' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-700'}`} to="/freelancers">
                Freelancer
              </Link>
            </nav>
          </div>

          {/* Unified search bar in the middle of public header */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] border border-slate-200 rounded-full font-body-sm text-body-sm focus:outline-none focus:border-[#1E293B] focus:ring-1 focus:ring-[#1E293B] transition-all text-[#1E293B]"
              placeholder="Tìm kiếm dự án..."
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {token ? (
              <>
                <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F766E]/5 hover:bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/10 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer" 
                  onClick={handleSwitchRole}
                >
                  <span className="material-symbols-outlined text-[15px]">sync</span>
                  Đổi vai trò
                </button>
                <button
                  type="button"
                  title="Báo cáo vi phạm"
                  onClick={() => navigate('/report')}
                  className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
                >
                  <span className="material-symbols-outlined text-[19px]">flag</span>
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                </button>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:border-slate-400 transition-all duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img alt="User Avatar" className="w-full h-full object-cover" src={user?.avatarUrl || TOPNAV_AVATAR} />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-56 bg-white text-slate-800 rounded-xl border border-slate-200 shadow-[0_10px_40px_rgba(15,118,110,0.15)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                        <p className="font-body-sm text-body-sm font-bold text-slate-900 truncate">{user?.fullName || 'Alexander'}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Trang cá nhân
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          const userRole = user?.roleDefault || 'FREELANCER';
                          if (userRole === 'ADMIN') navigate('/admin-dashboard');
                          else if (userRole === 'EMPLOYER') navigate('/employer-dashboard');
                          else navigate('/freelancer-dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-left cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        Bảng điều khiển
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleSwitchRole();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-left cursor-pointer border-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">cached</span>
                        Đổi vai trò
                      </button>

                      <div className="h-px bg-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-semibold border-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link className="text-[#475569] font-body-sm text-body-sm font-semibold hover:text-[#1E293B] transition-colors" to="/login">
                  Đăng nhập
                </Link>
                <Link className="px-4 py-2 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white rounded-lg font-body-sm text-body-sm font-semibold hover:shadow-[0_0_8px_rgba(30,41,59,0.3)] border border-transparent transition-all duration-300" to="/register">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Otherwise, default dashboard header style
  return (
    <header className="hidden md:flex w-full h-[72px] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.015)] border-b border-slate-200 sticky top-0 z-30 items-center justify-between">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-full">
        <div className="flex items-center gap-8 flex-1">
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] border border-slate-200 rounded-full font-body-sm text-body-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-[#1E293B]"
              placeholder="Tìm kiếm nhân tài hoặc dự án..."
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F766E]/5 hover:bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/10 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer" 
            onClick={handleSwitchRole}
          >
            <span className="material-symbols-outlined text-[15px]">sync</span>
            Đổi vai trò
          </button>
          <button
            type="button"
            title="Báo cáo vi phạm"
            onClick={() => navigate('/report')}
            className="w-10 h-10 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative mr-2"
          >
            <span className="material-symbols-outlined text-[19px]">flag</span>
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:border-slate-400 transition-all duration-200"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img alt="User Avatar" className="w-full h-full object-cover" src={user?.avatarUrl || TOPNAV_AVATAR} />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-56 bg-white text-slate-800 rounded-xl border border-slate-200 shadow-[0_10px_40px_rgba(15,118,110,0.15)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-slate-100 mb-1 text-left">
                  <p className="font-body-sm text-body-sm font-bold text-slate-900 truncate">{user?.fullName || 'Alexander'}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{user?.email || 'user@example.com'}</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-left"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Trang cá nhân
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    const userRole = user?.roleDefault || 'FREELANCER';
                    if (userRole === 'ADMIN') navigate('/admin-dashboard');
                    else if (userRole === 'EMPLOYER') navigate('/employer-dashboard');
                    else navigate('/freelancer-dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-left cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  Bảng điều khiển
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleSwitchRole();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-left cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">cached</span>
                  Đổi vai trò
                </button>

                <div className="h-px bg-slate-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 font-body-sm text-body-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-semibold border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
