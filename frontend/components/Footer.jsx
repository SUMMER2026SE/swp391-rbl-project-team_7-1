import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop mt-auto bg-gradient-to-r from-[#1E293B] to-[#334155]">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-xl text-headline-xl font-bold text-white">FJMS</span>
          <span className="font-body-sm text-body-sm text-slate-300">&copy; 2024 FJMS Marketplace. Bảo mật bởi VNPay Escrow.</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/browse-projects">Danh mục</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/help-center">An toàn & Bảo mật</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="#">Điều khoản dịch vụ</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="#">Chính sách riêng tư</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/help-center">Hỗ trợ</Link>
        </nav>
      </div>
    </footer>
  );
}
