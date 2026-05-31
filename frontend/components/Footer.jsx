import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop mt-auto bg-gradient-to-r from-[#1E293B] to-[#334155]">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-headline-xl text-headline-xl font-bold text-white">FJMS</span>
          <span className="font-body-sm text-body-sm text-slate-300">&copy; 2024 FJMS Marketplace. Secured by VNPay Escrow.</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/browse-projects">Browse Categories</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/help-center">Trust &amp; Safety</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="#">Terms of Service</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="#">Privacy Policy</Link>
          <Link className="font-body-sm text-body-sm text-slate-300 hover:text-white transition-colors" to="/help-center">Contact Support</Link>
        </nav>
      </div>
    </footer>
  );
}
