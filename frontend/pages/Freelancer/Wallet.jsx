import React from 'react';

export default function FreelancerWallet() {
  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex flex-col">
      {/*  Header  */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-2xl text-headline-2xl text-on-surface mb-2">Ví & Thu nhập</h2>
          <p className="font-body-base text-body-base text-on-surface-variant">Quản lý quỹ của bạn, theo dõi ký quỹ và xem xét lịch sử giao dịch.</p>
        </div>
        <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg font-body-base text-body-base hover:bg-[#0D5E58] transition-colors shadow-level-1 flex items-center">
          <span className="material-symbols-outlined mr-2">account_balance</span> Rút tiền
        </button>
      </header>
      {/*  Bento Grid: Balances  */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
        {/*  Available Balance  */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-level-1 card-hover transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F766E] opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Số dư khả dụng</h3>
            <span className="material-symbols-outlined text-[#0F766E] bg-[#0F766E]/10 p-2 rounded-full">account_balance_wallet</span>
          </div>
          <p className="font-display-hero text-display-hero text-[#334155]">4.250.000 đ</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Sẵn sàng rút tiền</p>
        </div>
        {/*  Escrow Hold  */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-level-1 card-hover transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-1">
              Ký quỹ đang chờ
              <span className="material-symbols-outlined text-[16px] cursor-help" title="Tiền được giữ an toàn bởi VNPay cho đến khi hoàn thành các giai đoạn của dự án.">info</span>
            </h3>
            <span className="material-symbols-outlined text-tertiary-container bg-tertiary-container/10 p-2 rounded-full">lock_clock</span>
          </div>
          <p className="font-display-hero text-display-hero text-[#334155]">1.800.000 đ</p>
          <div className="flex items-center mt-2 space-x-2">
            <img alt="VNPay Logo" className="h-4 opacity-70" onError={(e) => e.target.style.display='none'} src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2RdkHn-23w5jGN68Nff2085LeALhm5gS9VrQg31ig-io8wbpOkwQr_x8wB4yNwumiZpBHKqqqppzOyq52Li-a7a-oAJPHXcM_eQEXdo4eDRQ2s8ZniuCMXtNwo0Re-eunEkoe_IpJBd4v1ltlXWkGSPEPtp68ax8vIZdpzCo0TEsXbaVPIwpq89BCrRW9LfGLzNQJGhaom5ghCVKZuBMuI-tNUePkema1oAqNjwqjFH0nVifm6-PC3SVz0Gpy2grJSpqXQ4F223c"/>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Được bảo mật bởi VNPay Escrow</p>
          </div>
        </div>
        {/*  Total Earnings  */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-level-1 card-hover transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#475569] opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Tổng thu nhập</h3>
            <span className="material-symbols-outlined text-[#475569] bg-[#475569]/10 p-2 rounded-full">trending_up</span>
          </div>
          <p className="font-display-hero text-display-hero text-[#334155]">24.500.000 đ</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Thu nhập trọn đời</p>
        </div>
      </section>
      {/*  Transaction History  */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-level-1 flex-1 mb-8 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
          <h3 className="font-headline-xl text-headline-xl text-[#334155]">Lịch sử Giao dịch</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-lg font-body-sm text-body-sm flex items-center hover:bg-[#F8FAFC] transition-colors">
              <span className="material-symbols-outlined mr-2 text-[18px]">filter_list</span> Lọc
            </button>
            <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-lg font-body-sm text-body-sm flex items-center hover:bg-[#F8FAFC] transition-colors">
              <span className="material-symbols-outlined mr-2 text-[18px]">download</span> Xuất
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Mã</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Ngày</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Dự án / Chi tiết</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Loại</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Số tiền</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase">Trạng thái</th>
                <th className="py-4 px-6 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-[#E2E8F0]">
              {/*  Row 1: Payment Credit  */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="py-4 px-6 text-on-surface-variant">#TX-9021</td>
                <td className="py-4 px-6 text-on-surface-variant">24 Thg 10, 2026</td>
                <td className="py-4 px-6 font-medium text-on-surface">Thiết kế lại ứng dụng thương mại điện tử</td>
                <td className="py-4 px-6">
                  <span className="bg-surface-container px-2 py-1 rounded-full text-on-surface-variant flex items-center w-fit">
                    <span className="material-symbols-outlined text-[14px] mr-1">arrow_downward</span> Thanh toán
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-medium text-[#0F766E]">+1.250.000 đ</td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-[#0F766E]">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E] mr-2"></span> Hoàn thành
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a className="text-[#0F766E] hover:text-[#0D5E58] transition-colors opacity-0 group-hover:opacity-100 font-medium" href="#">Xem Hóa đơn</a>
                </td>
              </tr>
              {/*  Row 2: Escrow Hold  */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="py-4 px-6 text-on-surface-variant">#TX-9018</td>
                <td className="py-4 px-6 text-on-surface-variant">22 Thg 10, 2026</td>
                <td className="py-4 px-6 font-medium text-on-surface">Xây dựng thương hiệu Doanh nghiệp Giai đoạn 2</td>
                <td className="py-4 px-6">
                  <span className="bg-tertiary-container/10 px-2 py-1 rounded-full text-tertiary-container flex items-center w-fit">
                    <span className="material-symbols-outlined text-[14px] mr-1">lock</span> Đang ký quỹ
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-medium text-on-surface">800.000 đ</td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-tertiary-container">
                    <span className="w-2 h-2 rounded-full bg-tertiary-container mr-2 animate-pulse"></span> Đang chờ
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a className="text-[#0F766E] hover:text-[#0D5E58] transition-colors opacity-0 group-hover:opacity-100 font-medium" href="#">Chi tiết</a>
                </td>
              </tr>
              {/*  Row 3: Withdrawal  */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="py-4 px-6 text-on-surface-variant">#TX-8995</td>
                <td className="py-4 px-6 text-on-surface-variant">15 Thg 10, 2026</td>
                <td className="py-4 px-6 font-medium text-on-surface">Chuyển khoản đến ngân hàng ****4592</td>
                <td className="py-4 px-6">
                  <span className="bg-surface-variant px-2 py-1 rounded-full text-on-surface-variant flex items-center w-fit">
                    <span className="material-symbols-outlined text-[14px] mr-1">arrow_upward</span> Rút tiền
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-medium text-on-surface">-2.000.000 đ</td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-[#0F766E]">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E] mr-2"></span> Hoàn thành
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a className="text-[#0F766E] hover:text-[#0D5E58] transition-colors opacity-0 group-hover:opacity-100 font-medium" href="#">Biên lai</a>
                </td>
              </tr>
              {/*  Row 4: Payment Credit  */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="py-4 px-6 text-on-surface-variant">#TX-8912</td>
                <td className="py-4 px-6 text-on-surface-variant">10 Thg 10, 2026</td>
                <td className="py-4 px-6 font-medium text-on-surface">Thiết lập Đánh giá SEO</td>
                <td className="py-4 px-6">
                  <span className="bg-surface-container px-2 py-1 rounded-full text-on-surface-variant flex items-center w-fit">
                    <span className="material-symbols-outlined text-[14px] mr-1">arrow_downward</span> Thanh toán
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-medium text-[#0F766E]">+500.000 đ</td>
                <td className="py-4 px-6">
                  <span className="flex items-center text-[#0F766E]">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E] mr-2"></span> Hoàn thành
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <a className="text-[#0F766E] hover:text-[#0D5E58] transition-colors opacity-0 group-hover:opacity-100 font-medium" href="#">Xem Hóa đơn</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#E2E8F0] flex justify-center bg-white">
          <button className="text-[#475569] font-body-sm text-body-sm font-medium hover:underline flex items-center">
            Tải thêm <span className="material-symbols-outlined ml-1 text-[18px]">expand_more</span>
          </button>
        </div>
      </section>
    </main>
  );
}
