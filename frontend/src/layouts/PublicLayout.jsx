import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="bg-[#F8FAFC] text-[#1E293B] font-body-base antialiased min-h-screen flex flex-col">
      {/* Public fixed header */}
      <Header layout="public" />

      {/* Render child routes */}
      <Outlet />

      {/* Public dark footer */}
      <Footer />
    </div>
  );
}
