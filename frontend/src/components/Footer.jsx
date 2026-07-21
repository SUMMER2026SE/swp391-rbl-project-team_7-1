import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-16 px-6 md:px-12 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <span className="text-3xl font-black text-teal-400 tracking-tighter">FJMS</span>
            <p className="text-xs leading-relaxed text-slate-400">
              Hệ thống kết nối và quản lý Freelancer chuyên nghiệp. Tiên phong giải pháp thanh toán bảo đảm bằng cơ chế ký quỹ thông minh.
            </p>
          </div>

          {/* Column 2: Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-teal-400 transition-colors" to="/browse-projects">Tìm kiếm công việc</Link></li>
              <li><Link className="hover:text-teal-400 transition-colors" to="/freelancers">Danh sách Freelancer</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Safety */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">An toàn & Bảo mật</h4>
            <ul className="space-y-2 text-xs">
              <li><Link className="hover:text-teal-400 transition-colors" to="/help-center">Hướng dẫn Ký quỹ Escrow</Link></li>
              <li><Link className="hover:text-teal-400 transition-colors" to="#">Điều khoản dịch vụ</Link></li>
              <li><Link className="hover:text-teal-400 transition-colors" to="#">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Liên hệ hỗ trợ</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Email: support@fjms.vn<br />
              Hotline: 1900 1234<br />
              Địa chỉ: Khu Công nghệ cao Hòa Lạc, Hà Nội
            </p>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} FJMS Platform. Bảo mật giao dịch qua cổng thanh toán VNPay.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Phiên bản 2.5.0-Flash</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Hệ thống hoạt động bình thường" />
          </div>
        </div>
      </div>
    </footer>
  );
}
