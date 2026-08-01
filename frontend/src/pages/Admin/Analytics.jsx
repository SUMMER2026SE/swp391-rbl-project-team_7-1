import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const API = 'http://localhost:5000/api';

function StatCard({ title, value, subtitle, icon, gradient }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0F766E] border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-[#EFCE4B]/10 group-hover:text-[#D97706]">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-[#0f172a] tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-[#64748b] font-medium">{subtitle}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1.5 mb-8">
      <h1 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h1>
      <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, period, children }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">{title}</p>
          <h3 className="text-lg font-extrabold text-[#0f172a] mt-1">{subtitle}</h3>
        </div>
        {period && <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-[#0f766e] rounded-full border border-teal-100/50">{period}</span>}
      </div>
      <div className="h-[280px]">
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ label, count, color }) {
  const getStatusLabelVi = (status) => {
    const labels = {
      OPEN: 'Đang mở tuyển',
      ACTIVE: 'Đang hoạt động',
      CLOSED: 'Đã đóng',
      COMPLETED: 'Đã hoàn thành',
      PENDING_APPROVAL: 'Chờ duyệt',
      APPROVED: 'Đã phê duyệt',
      PENDING: 'Đang chờ xử lý',
      RESOLVED: 'Đã giải quyết',
      DISMISSED: 'Đã bác bỏ',
      CANCELLED: 'Đã hủy',
      CANCELED: 'Đã hủy',
      REJECTED: 'Đã từ chối',
      SUBMITTED: 'Đã nộp bài',
      WITHDRAWN: 'Đã rút lại',
      IN_PROGRESS: 'Đang thực hiện'
    };
    return labels[status] || status;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="text-sm font-semibold text-slate-700">{getStatusLabelVi(label)}</span>
      </div>
      <span className="text-sm font-black text-slate-800 bg-white px-2.5 py-0.5 rounded-lg border border-slate-100">{count}</span>
    </div>
  );
}

const PERIOD_OPTIONS = [
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm nay' },
  { value: 'custom', label: 'Tùy chọn' },
];

function TimeFilter({ onFilterChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handlePeriodClick = (value) => {
    setSelectedPeriod(value);
    if (value === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onFilterChange({ period: value });
    }
  };

  const handleApplyCustom = () => {
    if (customStart && customEnd) {
      onFilterChange({ startDate: customStart, endDate: customEnd });
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-wrap items-center gap-3">
      <span className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider mr-1">Lọc theo thời gian:</span>
      <div className="flex gap-1.5 flex-wrap">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePeriodClick(opt.value)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-xl border transition-all ${
              selectedPeriod === opt.value
                ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {showCustom && (
        <div className="flex items-center gap-2 ml-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Từ:</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Đến:</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>
          <button
            onClick={handleApplyCustom}
            disabled={!customStart || !customEnd}
            className="px-4 py-1.5 text-sm font-semibold rounded-xl bg-[#0F766E] text-white border border-[#0F766E] shadow-sm hover:bg-[#0D6B64] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Áp dụng
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = (() => {
    const raw = localStorage.getItem('token');
    return raw && raw !== 'null' && raw !== 'undefined' ? raw : null;
  })();

  const abortControllerRef = useRef(null);

  const fetchAnalytics = useCallback(async (filterParams = {}) => {
    if (!token) {
      setError('Vui lòng đăng nhập để truy cập trang này.');
      setLoading(false);
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filterParams.period) {
        queryParams.set('period', filterParams.period);
      } else if (filterParams.startDate && filterParams.endDate) {
        queryParams.set('startDate', filterParams.startDate);
        queryParams.set('endDate', filterParams.endDate);
      }
      const queryStr = queryParams.toString();
      const url = `${API}/admin/analytics${queryStr ? `?${queryStr}` : ''}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.message || 'Không thể tải dữ liệu thống kê.');
        return;
      }

      if (responseData.success && responseData.data) {
        setAnalyticsData(responseData.data);
      } else {
        setError('Định dạng dữ liệu không hợp lệ.');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics({ period: 'year' });
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchAnalytics]);

  const handleFilterChange = (filterParams) => {
    fetchAnalytics(filterParams);
  };

  const formatRevenue = (value) => {
    return (value || 0).toLocaleString('vi-VN') + ' đ';
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: '#0f766e',
      ACTIVE: '#0284c7',
      CLOSED: '#64748b',
      COMPLETED: '#16a34a',
      PENDING_APPROVAL: '#f59e0b',
      APPROVED: '#0f766e',
      PENDING: '#f59e0b',
      RESOLVED: '#16a34a',
      DISMISSED: '#94a3b8',
      CANCELLED: '#ef4444',
      REJECTED: '#ef4444',
      SUBMITTED: '#6366f1',
      WITHDRAWN: '#94a3b8'
    };
    return colors[status] || '#94a3b8';
  };

  if (loading && !analyticsData) {
    return (
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <SectionHeader
            title="Thống kê hệ thống"
            subtitle="Số liệu phân tích nền tảng, KPI hiệu suất và biểu đồ trực quan hóa thời gian thực."
          />
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium text-sm">Đang phân tích dữ liệu...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !analyticsData) {
    return (
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <SectionHeader
            title="Thống kê hệ thống"
            subtitle="Số liệu phân tích nền tảng, KPI hiệu suất và biểu đồ trực quan hóa thời gian thực."
          />
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-rose-700 flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      </main>
    );
  }

  if (!analyticsData) {
    return (
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <SectionHeader
            title="Thống kê hệ thống"
            subtitle="Số liệu phân tích nền tảng, KPI hiệu suất và biểu đồ trực quan hóa thời gian thực."
          />
          <div className="text-center text-[#64748b] py-20 font-medium">Không có dữ liệu thống kê.</div>
        </div>
      </main>
    );
  }

  const { overview, monthlyRevenue, monthlyProjects, monthlyUsers, projectStatusDistribution, contractStatusDistribution } = analyticsData;

  const KPI_CARDS = [
    { 
      title: 'Tổng người dùng', 
      value: (overview.totalUsers || 0).toLocaleString('vi-VN'), 
      subtitle: 'Tài khoản hoạt động trên nền tảng', 
      icon: 'group',
      gradient: 'from-teal-500 to-emerald-400'
    },
    { 
      title: 'Tổng số dự án', 
      value: (overview.totalProjects || 0).toLocaleString('vi-VN'), 
      subtitle: 'Tổng số tin tuyển dụng đã đăng', 
      icon: 'work',
      gradient: 'from-blue-500 to-indigo-400'
    },
    { 
      title: 'Hợp đồng đang chạy', 
      value: (overview.activeContracts || 0).toLocaleString('vi-VN'), 
      subtitle: 'Hợp đồng freelancer đang thực thi', 
      icon: 'assignment_turned_in',
      gradient: 'from-purple-500 to-pink-400'
    },
    { 
      title: 'Lợi nhuận từ phí (5%)', 
      value: formatRevenue(overview.totalSystemFees), 
      subtitle: 'Phí dịch vụ thu từ dự án hoàn thành', 
      icon: 'monetization_on',
      gradient: 'from-amber-500 to-orange-400'
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <SectionHeader
          title="Thống kê hệ thống"
          subtitle="Số liệu phân tích nền tảng, KPI hiệu suất và biểu đồ trực quan hóa thời gian thực."
        />

        {/* Time Filter */}
        <TimeFilter onFilterChange={handleFilterChange} />

        {/* Section 1: Overview KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {KPI_CARDS.map(item => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {/* Section 2: Revenue Trend */}
        <ChartCard title="Doanh thu" subtitle="Biểu đồ tăng trưởng dòng tiền" period={monthlyRevenue.length > 0 ? `${monthlyRevenue[0]?.month} - ${monthlyRevenue[monthlyRevenue.length - 1]?.month}` : ''}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={value => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                formatter={value => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh thu']}
              />
              <Line type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Doanh thu" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Section 3: Projects & Users side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Dự án mới" subtitle="Số lượng dự án đăng ký mới hàng tháng">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Dự án" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Thành viên mới" subtitle="Tài khoản đăng ký mới">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Thành viên" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Section 5 & 6: Status Distributions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <div className="mb-6">
              <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Trạng thái công việc</p>
              <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">Phân bổ trạng thái dự án</h3>
            </div>
            <div className="space-y-3">
              {(projectStatusDistribution || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">Chưa có dữ liệu</p>
              ) : (
                (projectStatusDistribution || []).map((item, idx) => (
                  <StatusBadge
                    key={idx}
                    label={item.status}
                    count={item.count}
                    color={getStatusColor(item.status)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <div className="mb-6">
              <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Trạng thái hợp đồng</p>
              <h3 className="text-lg font-extrabold text-[#0f172a] mt-0.5">Phân bổ trạng thái hợp đồng</h3>
            </div>
            <div className="space-y-3">
              {(contractStatusDistribution || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">Chưa có dữ liệu</p>
              ) : (
                (contractStatusDistribution || []).map((item, idx) => (
                  <StatusBadge
                    key={idx}
                    label={item.status}
                    count={item.count}
                    color={getStatusColor(item.status)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}