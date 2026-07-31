import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AIAssistantWidget from '../components/AIAssistant/AIAssistantWidget';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const isAdmin = user?.roleDefault === 'ADMIN';
  const isChatPage = location.pathname === '/messages-employer' || location.pathname === '/messages-freelancer';

  return (
    <div className={`bg-[#F8FAFC] text-[#1E293B] font-body-base antialiased flex ${isChatPage ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Role-based Sidebar */}
      <Sidebar />

      {/* Main Canvas Content Area */}
      <div className={`flex-1 md:ml-64 flex flex-col bg-[#F8FAFC] relative min-w-0 ${isChatPage ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'}`}>
        {/* Dashboard Header */}
        <Header layout="dashboard" />

        {/* Render child routes */}
        <Outlet />
      </div>

      {/* Global AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
}
