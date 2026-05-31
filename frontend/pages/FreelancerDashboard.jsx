import React from 'react';
import { Link } from 'react-router-dom';

export default function FreelancerDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="bg-[#F8FAFC] text-on-background min-h-screen flex w-full font-body-md antialiased">
      
      {/* SideNavBar (Shared Component) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full flex-col p-md border-r border-outline-variant bg-surface-container-low w-64 z-50">
        <div className="mb-xl flex items-center gap-sm px-sm">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            work
          </span>
          <div>
            <div className="font-headline-sm text-headline-sm font-black text-primary">Freelancer Portal</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Verified Pro Account</div>
          </div>
        </div>

        <ul className="flex flex-col gap-sm flex-1">
          <li>
            <Link className="flex items-center gap-md bg-secondary-container text-on-secondary-container rounded-lg px-md py-sm font-label-md text-label-md" to="/freelancer/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md" to="/projects">
              <span className="material-symbols-outlined">work</span>
              Active Projects
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md" to="/projects">
              <span className="material-symbols-outlined">description</span>
              Proposals
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md" to="/projects">
              <span className="material-symbols-outlined">payments</span>
              Earnings
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md" to="/projects">
              <span className="material-symbols-outlined">mail</span>
              Messages
            </Link>
          </li>
        </ul>

        <div className="mt-auto">
          <ul className="flex flex-col gap-sm border-t border-outline-variant pt-md">
            <li>
              <Link className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md" to="/">
                <span className="material-symbols-outlined">help</span>
                Help Center
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-variant hover:text-on-surface transition-all duration-200 rounded-lg font-label-md text-label-md cursor-pointer outline-none"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-xl max-w-container-max mx-auto w-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface">
              Welcome back, Alex
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Here's what's happening with your freelance business today.
            </p>
          </div>
          
          <div className="flex items-center gap-sm">
            <Link
              to="/employer/dashboard"
              className="bg-surface-container-lowest border border-outline-variant text-primary rounded-lg py-sm px-md font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              Switch to Employer
            </Link>

            
            <div className="relative group cursor-pointer ml-md">
              <div className="flex items-center gap-sm hover:opacity-85 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border-2 border-surface-container-lowest shadow-sm">
                  F
                </div>
                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <Link to="/profile" className="flex items-center gap-sm px-4 py-3 text-on-surface hover:bg-surface-variant hover:text-primary transition-colors font-label-md">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  My Profile
                </Link>
                <div className="h-px bg-outline-variant"></div>
                <div onClick={handleLogout} className="flex items-center gap-sm px-4 py-3 text-error hover:bg-error-container transition-colors font-label-md">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
          
          {/* Stat Card 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-md">
              <div className="bg-surface-container-low p-sm rounded-lg text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">send</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline px-sm py-xs bg-surface-container rounded-full">+2 this week</span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-on-surface">12</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Active Proposals</div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-md">
              <div className="bg-surface-container-low p-sm rounded-lg text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">handshake</span>
              </div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-on-surface">4</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Accepted Projects</div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between hover-lift">
            <div className="flex justify-between items-start mb-md">
              <div className="bg-surface-container-low p-sm rounded-lg text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="font-label-sm text-label-sm text-[#16a34a] px-sm py-xs bg-[#dcfce7] rounded-full">+14% vs last month</span>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-on-surface">100.000.000 đ</div>
              <div className="font-label-md text-label-md text-on-surface-variant">Wallet Balance</div>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-primary text-on-primary rounded-2xl p-lg flex flex-col justify-between hover-lift shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="flex justify-between items-start mb-md relative z-10">
              <div className="bg-white/20 p-sm rounded-lg text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed px-sm py-xs bg-white/10 rounded-full border border-white/20">Top Rated</span>
            </div>
            <div className="relative z-10">
              <div className="font-headline-lg text-headline-lg">4.9/5</div>
              <div className="font-label-md text-label-md text-on-primary/80">Average Rating (42 reviews)</div>
            </div>
          </div>

        </section>

      </main>

      {/* Floating AI Chatbox Support Button */}
      <button
        onClick={() => alert('AI Support Chat is under construction!')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">support_agent</span>
      </button>

    </div>
  );
}
