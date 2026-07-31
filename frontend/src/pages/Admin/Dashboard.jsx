import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

function ActionCard({ title, value, subtitle, icon, link, topColor, iconBg, iconText, borderHover, bgHover, textHover }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${topColor}`} />
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{title}</p>
          <div className={`w-10 h-10 rounded-2xl ${iconBg} ${iconText} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        </div>
        <p className="text-4xl font-black text-slate-800 tracking-tight leading-none">{value}</p>
        <p className="mt-2 text-xs text-slate-500 font-semibold">{subtitle}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-50">
        <Link 
          to={link} 
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-slate-650 rounded-2xl text-xs font-extrabold transition-all border border-slate-100 ${bgHover} ${textHover} ${borderHover}`}
        >
          Xem chi tiết
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1.5 mb-8">
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 font-semibold">{subtitle}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = (() => {
    const raw = localStorage.getItem('token');
    return raw && raw !== 'null' && raw !== 'undefined' ? raw : null;
  })();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Vui lòng đăng nhập để truy cập trang này.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/user/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const responseData = await res.json();

        if (!res.ok) {
          setError(responseData.message || 'Không thể tải dữ liệu dashboard.');
          return;
        }

        if (responseData.success && responseData.data) {
          setDashboardData(responseData.data);
        } else {
          setError('Định dạng dữ liệu không hợp lệ.');
        }
      } catch (err) {
        setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <SectionHeader
            title="Tổng quan quản trị"
            subtitle="Trung tâm điều hành và xử lý tác vụ thời gian thực của quản trị viên."
          />
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm">Đang tải dữ liệu...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <SectionHeader
            title="Tổng quan quản trị"
            subtitle="Trung tâm điều hành và xử lý tác vụ thời gian thực của quản trị viên."
          />
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-rose-700 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      </main>
    );
  }

  const PENDING_ACTIONS = [
    {
      title: "Tin tuyển dụng chờ duyệt",
      value: dashboardData?.pendingProjects || 0,
      subtitle: "Dự án mới cần duyệt nội dung",
      icon: "fact_check",
      link: "/admin-projects?status=CLOSED",
      topColor: "bg-teal-500",
      iconBg: "bg-teal-50",
      iconText: "text-teal-600",
      borderHover: "hover:border-teal-100",
      bgHover: "hover:bg-teal-50",
      textHover: "hover:text-teal-700"
    },
    {
      title: "Yêu cầu rút tiền chờ xử lý",
      value: dashboardData?.pendingWithdrawals || 0,
      subtitle: "Các giao dịch rút tiền cần phê duyệt",
      icon: "payments",
      link: "/admin-withdrawals",
      topColor: "bg-indigo-500",
      iconBg: "bg-indigo-50",
      iconText: "text-indigo-600",
      borderHover: "hover:border-indigo-100",
      bgHover: "hover:bg-indigo-50",
      textHover: "hover:text-indigo-700"
    },
    {
      title: "Báo cáo vi phạm mới",
      value: dashboardData?.pendingReports || 0,
      subtitle: "Tài khoản bị báo cáo vi phạm",
      icon: "warning",
      link: "/admin-violations",
      topColor: "bg-rose-500",
      iconBg: "bg-rose-50",
      iconText: "text-rose-600",
      borderHover: "hover:border-rose-100",
      bgHover: "hover:bg-rose-50",
      textHover: "hover:text-rose-700"
    }
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <SectionHeader
            title="Tổng quan quản trị"
            subtitle="Trung tâm điều hành - Quản lý tác vụ chờ duyệt và thống kê hoạt động."
          />
        </div>

        {/* Actionable KPIs - Pending Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PENDING_ACTIONS.map((action, idx) => (
            <ActionCard key={idx} {...action} />
          ))}
        </div>

        {/* Quick Platform Metrics */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider font-semibold">Quy mô thời gian thực</p>
                <h3 className="text-base font-extrabold text-[#0f172a] mt-0.5">Thống kê quy mô nền tảng</h3>
              </div>
              <Link to="/admin-analytics" className="text-xs font-bold text-[#0F766E] hover:underline">Xem chi tiết biểu đồ &gt;</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số người dùng</span>
                <span className="text-2xl font-black text-slate-800 mt-2">{(dashboardData?.totalUsers || 0).toLocaleString('vi-VN')} tài khoản</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tổng dự án đã tạo</span>
                <span className="text-2xl font-black text-slate-800 mt-2">{(dashboardData?.totalProjects || 0).toLocaleString('vi-VN')} tin đăng</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hợp đồng đang thực hiện</span>
                <span className="text-2xl font-black text-slate-800 mt-2">{(dashboardData?.activeContracts || 0).toLocaleString('vi-VN')} hợp đồng</span>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Lợi nhuận hệ thống (5%)</span>
                <span className="text-2xl font-black text-emerald-700 mt-2">{(dashboardData?.totalSystemFees || 0).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time lists */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Earning Freelancers Leaderboard */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider font-semibold">Freelancer nổi bật</p>
                <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">Top thu nhập hệ thống</h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">Bảng xếp hạng</span>
            </div>
            <div className="space-y-4">
              {(!dashboardData?.topFreelancers || dashboardData.topFreelancers.length === 0) ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">Chưa ghi nhận thu nhập hoàn thành hợp đồng nào.</div>
              ) : (
                dashboardData.topFreelancers.map((freelancer, idx) => (
                  <div key={freelancer.user_id} className="rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#0f766e] transition-all bg-[#F8FAFC] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          alt={freelancer.full_name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                          src={freelancer.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5kfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g"} 
                        />
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#0F766E] text-white text-[10px] font-black flex items-center justify-center border border-white">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-extrabold text-[#0f172a] text-sm leading-tight">{freelancer.full_name}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{freelancer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-lg">
                        {(freelancer.total_earned || 0).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Payments */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider font-semibold">Theo dõi ví</p>
                <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">Giao dịch thanh toán gần đây</h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">Lịch sử giao dịch</span>
            </div>
            <div className="space-y-4">
              {(!dashboardData?.latestPayments || dashboardData.latestPayments.length === 0) ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">Chưa phát sinh giao dịch thanh toán nào.</div>
              ) : (
                dashboardData.latestPayments.map(payment => (
                  <div key={payment.payment_id} className="rounded-2xl border border-[#E2E8F0] p-4 hover:border-[#0f766e] transition-all bg-[#F8FAFC] flex flex-col justify-between gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-[#0f172a] text-sm line-clamp-1">{payment.project_title || 'Nạp tiền vào tài khoản'}</p>
                        <p className="text-xs text-[#64748b] mt-1 font-medium">Đối tác giao dịch: <span className="text-slate-800 font-bold">{payment.payer_name || 'Khách hàng'}</span></p>
                      </div>
                      <span className="text-sm font-black text-emerald-700 whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                        +{(payment.amount || 0).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 font-medium">Mã giao dịch: #{payment.payment_id} • Cổng: {payment.payment_method || 'VNPay'}</span>
                      <span className="text-slate-500 font-medium">{new Date(payment.paid_at || payment.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}