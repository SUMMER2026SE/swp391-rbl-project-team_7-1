import React, { useEffect, useState } from 'react';
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
  Legend,
} from 'recharts';

const API = 'http://localhost:5000/api';

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-[0.15em]">{title}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#0f766e] grid place-items-center">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      </div>
      <p className="text-[32px] font-semibold text-[#0f172a] leading-none">{value}</p>
      <p className="mt-3 text-sm text-[#64748b]">{subtitle}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <h2 className="font-headline-2xl text-headline-2xl text-[#334155]">{title}</h2>
      <p className="text-body-base text-body-base text-[#475569]">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, period, children }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">{title}</p>
          <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">{subtitle}</h3>
        </div>
        {period && <span className="text-sm text-[#64748b]">{period}</span>}
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ label, count, color }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
        <span className="text-sm font-medium text-[#334155]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#0f172a]">{count}</span>
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Vui lòng đăng nhập để truy cập trang này.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
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
        setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

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

  const abbreviateMonth = (monthStr) => {
    if (!monthStr) return '';
    const parts = monthStr.split('-');
    if (parts.length !== 2) return monthStr;
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = parseInt(parts[1], 10);
    return months[m] || monthStr;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-10 pb-12">
          <SectionHeader
            title="Admin Analytics"
            subtitle="Real-time platform analytics, KPIs, and trend visualizations."
          />
          <div className="text-center text-[#64748b]">Đang tải dữ liệu...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-10 pb-12">
          <SectionHeader
            title="Admin Analytics"
            subtitle="Real-time platform analytics, KPIs, and trend visualizations."
          />
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-red-700">{error}</div>
        </div>
      </main>
    );
  }

  if (!analyticsData) {
    return (
      <main className="flex-1 overflow-y-auto p-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-10 pb-12">
          <SectionHeader
            title="Admin Analytics"
            subtitle="Real-time platform analytics, KPIs, and trend visualizations."
          />
          <div className="text-center text-[#64748b]">Không có dữ liệu thống kê.</div>
        </div>
      </main>
    );
  }

  const { overview, monthlyRevenue, monthlyProjects, monthlyUsers, projectStatusDistribution, contractStatusDistribution, topCategories, topSkills } = analyticsData;

  const KPI_CARDS = [
    { title: 'Total Users', value: (overview.totalUsers || 0).toLocaleString('vi-VN'), subtitle: 'All platform users', icon: 'person' },
    { title: 'Freelancers', value: (overview.totalFreelancers || 0).toLocaleString('vi-VN'), subtitle: 'Freelance members', icon: 'workspace_premium' },
    { title: 'Employers', value: (overview.totalEmployers || 0).toLocaleString('vi-VN'), subtitle: 'Project owners', icon: 'business_center' },
    { title: 'Total Projects', value: (overview.totalProjects || 0).toLocaleString('vi-VN'), subtitle: 'Projects created', icon: 'work_outline' },
    { title: 'Active Contracts', value: (overview.activeContracts || 0).toLocaleString('vi-VN'), subtitle: 'Active agreements', icon: 'description' },
    { title: 'Total Revenue', value: formatRevenue(overview.totalRevenue), subtitle: 'Gross platform revenue', icon: 'payments' },
  ];

  const chartRevenueData = (monthlyRevenue || []).map(item => ({
    ...item,
    monthLabel: abbreviateMonth(item.month)
  }));

  const chartProjectsData = (monthlyProjects || []).map(item => ({
    ...item,
    monthLabel: abbreviateMonth(item.month)
  }));

  const chartUsersData = (monthlyUsers || []).map(item => ({
    ...item,
    monthLabel: abbreviateMonth(item.month)
  }));

  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-10 pb-12">
        <SectionHeader
          title="Admin Analytics"
          subtitle="Real-time platform analytics, KPIs, and trend visualizations."
        />

        {/* Section 1: Overview KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {KPI_CARDS.map(item => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {/* Section 2: Revenue Trend */}
        <ChartCard title="Revenue Trend" subtitle="Monthly platform revenue" period="Last 12 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRevenueData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={value => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={value => `${Number(value).toLocaleString('vi-VN')} đ`}
                labelFormatter={label => {
                  const item = chartRevenueData.find(d => d.monthLabel === label);
                  return item ? item.month : label;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={3} dot={{ r: 5 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Section 3: Projects & Users side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Projects Trend" subtitle="Monthly projects created" period="Last 12 months">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartProjectsData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  labelFormatter={label => {
                    const item = chartProjectsData.find(d => d.monthLabel === label);
                    return item ? item.month : label;
                  }}
                />
                <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Growth" subtitle="Monthly user registrations" period="Last 12 months">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartUsersData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  labelFormatter={label => {
                    const item = chartUsersData.find(d => d.monthLabel === label);
                    return item ? item.month : label;
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={3} dot={{ r: 5 }} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Section 5 & 6: Status Distributions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Project Status</p>
              <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">Distribution</h3>
            </div>
            <div className="space-y-3">
              {(projectStatusDistribution || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">No project data</p>
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

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Contract Status</p>
              <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">Distribution</h3>
            </div>
            <div className="space-y-3">
              {(contractStatusDistribution || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">No contract data</p>
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

        {/* Section 7 & 8: Top Categories & Skills */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Top Categories</p>
              <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">Most popular project categories</h3>
            </div>
            <div className="space-y-3">
              {(topCategories || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">No category data</p>
              ) : (
                (topCategories || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#ecfdf5] text-[#0f766e] text-xs font-bold grid place-items-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-[#334155]">{item.category || 'Uncategorized'}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0f172a]">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Top Skills</p>
              <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">Most requested skills</h3>
            </div>
            <div className="space-y-3">
              {(topSkills || []).length === 0 ? (
                <p className="text-sm text-[#64748b] text-center py-8">No skill data</p>
              ) : (
                (topSkills || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#ecfdf5] text-[#0f766e] text-xs font-bold grid place-items-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-[#334155]">{item.skill}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#0f172a]">{item.count}</span>
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