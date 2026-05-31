import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  const navigate = useNavigate();
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

  return (
    <div className="bg-[#F8FAFC] text-[#1E293B] font-body-base antialiased min-h-screen flex">
      {/* Role-based Sidebar */}
      <Sidebar />

      {/* Main Canvas Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-[#F8FAFC] relative">
        {/* Dashboard Header */}
        <Header layout="dashboard" />
        
        {/* Render child routes */}
        <Outlet />
      </div>
    </div>
  );
}
