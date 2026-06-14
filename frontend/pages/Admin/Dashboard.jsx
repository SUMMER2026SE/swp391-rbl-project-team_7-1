import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const KPI_SUMMARY = [
  { title: 'Total Users', value: '12,480', subtitle: 'Overall platform users', icon: 'person' },
  { title: 'Total Freelancers', value: '7,320', subtitle: 'Active freelancers', icon: 'workspace_premium' },
  { title: 'Total Employers', value: '4,160', subtitle: 'Project owners', icon: 'business_center' },
  { title: 'Total Projects', value: '3,980', subtitle: 'Projects created', icon: 'work_outline' },
  { title: 'Total Contracts', value: '2,720', subtitle: 'Contracts executed', icon: 'task_alt' },
  { title: 'Total Revenue', value: '108,400,000 đ', subtitle: 'Gross platform revenue', icon: 'payments' },
];

const USER_REGISTRATIONS = [
  { month: 'Jan', users: 410 },
  { month: 'Feb', users: 520 },
  { month: 'Mar', users: 610 },
  { month: 'Apr', users: 560 },
  { month: 'May', users: 680 },
  { month: 'Jun', users: 720 },
];

const PROJECTS_BY_MONTH = [
  { month: 'Jan', projects: 290 },
  { month: 'Feb', projects: 330 },
  { month: 'Mar', projects: 410 },
  { month: 'Apr', projects: 385 },
  { month: 'May', projects: 455 },
  { month: 'Jun', projects: 492 },
];

const REVENUE_BY_MONTH = [
  { month: 'Jan', revenue: 12800 },
  { month: 'Feb', revenue: 14850 },
  { month: 'Mar', revenue: 16200 },
  { month: 'Apr', revenue: 15300 },
  { month: 'May', revenue: 17950 },
  { month: 'Jun', revenue: 19100 },
];

const LATEST_PROJECTS = [
  { id: 'P-8792', title: 'Mobile App redesign', owner: 'TechCorp', status: 'In progress', value: '85,000,000 đ' },
  { id: 'P-8745', title: 'E-commerce backend', owner: 'ShopEase', status: 'Pending', value: '130,000,000 đ' },
  { id: 'P-8690', title: 'Brand identity package', owner: 'Luma Studio', status: 'Completed', value: '24,500,000 đ' },
  { id: 'P-8614', title: 'Marketing automation', owner: 'BeeDigital', status: 'In review', value: '52,200,000 đ' },
  { id: 'P-8591', title: 'Landing page build', owner: 'Fresh Foods', status: 'In progress', value: '17,800,000 đ' },
];

const LATEST_PAYMENTS = [
  { id: 'PMT-9821', project: 'Mobile App redesign', user: 'TechCorp', amount: '12,500,000 đ', method: 'VNPay', date: '2026-06-11' },
  { id: 'PMT-9790', project: 'E-commerce backend', user: 'ShopEase', amount: '35,000,000 đ', method: 'Card', date: '2026-06-10' },
  { id: 'PMT-9742', project: 'Brand identity package', user: 'Luma Studio', amount: '24,500,000 đ', method: 'VNPay', date: '2026-06-09' },
  { id: 'PMT-9688', project: 'Marketing automation', user: 'BeeDigital', amount: '18,750,000 đ', method: 'Card', date: '2026-06-08' },
  { id: 'PMT-9650', project: 'Landing page build', user: 'Fresh Foods', amount: '17,800,000 đ', method: 'VNPay', date: '2026-06-07' },
];

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

export default function AdminDashboard() {
  return (
    <main className="flex-1 overflow-y-auto p-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-10 pb-12">
        <SectionHeader
          title="Admin Dashboard"
          subtitle="Overview of users, projects, contracts and monthly platform performance."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {KPI_SUMMARY.slice(0, 3).map(item => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {KPI_SUMMARY.slice(3).map(item => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">User registrations</p>
                <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">By month</h3>
              </div>
              <span className="text-sm text-[#64748b]">Last 6 months</span>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={USER_REGISTRATIONS} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#0f766e" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Projects</p>
                <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">By month</h3>
              </div>
              <span className="text-sm text-[#64748b]">Last 6 months</span>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROJECTS_BY_MONTH} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="projects" fill="#0f766e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Revenue</p>
                <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">By month</h3>
              </div>
              <span className="text-sm text-[#64748b]">Last 6 months</span>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_BY_MONTH} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={value => `${value / 1000}k`} />
                  <Tooltip formatter={value => `${value.toLocaleString('vi-VN')} đ`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Latest projects</p>
                  <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">5 newest</h3>
                </div>
                <span className="text-sm text-[#64748b]">Updated now</span>
              </div>
              <div className="space-y-4">
                {LATEST_PROJECTS.map(project => (
                  <div key={project.id} className="rounded-3xl border border-[#E2E8F0] p-4 hover:border-[#0f766e] transition-colors">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-[#0f172a]">{project.title}</p>
                        <p className="text-sm text-[#64748b]">{project.owner}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#0f766e]">{project.value}</span>
                    </div>
                    <p className="text-sm text-[#475569]">{project.id} • {project.status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_2px_18px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm font-semibold text-[#475569] uppercase tracking-[0.16em]">Latest payments</p>
                  <h3 className="mt-2 text-headline-xl font-semibold text-[#0f172a]">5 newest</h3>
                </div>
                <span className="text-sm text-[#64748b]">Completed</span>
              </div>
              <div className="space-y-4">
                {LATEST_PAYMENTS.map(payment => (
                  <div key={payment.id} className="rounded-3xl border border-[#E2E8F0] p-4 hover:border-[#0f766e] transition-colors">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-[#0f172a]">{payment.project}</p>
                        <p className="text-sm text-[#64748b]">{payment.user}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#0f766e]">{payment.amount}</span>
                    </div>
                    <p className="text-sm text-[#475569]">{payment.id} • {payment.method} • {payment.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
