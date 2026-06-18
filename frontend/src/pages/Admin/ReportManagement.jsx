import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'RESOLVED', 'DISMISSED'];

const badgeClasses = {
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-100',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  DISMISSED: 'bg-slate-50 text-slate-700 border border-slate-100'
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString('vi-VN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function AdminReportManagement() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response = await reportService.getAdminReports(params);
      setReports(response.reports || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách báo cáo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleAction = async (reportId, action) => {
    setError('');
    setMessage('');
    setProcessingId(reportId);

    try {
      const confirmMessage = action === 'resolve'
        ? `Xác nhận giải quyết báo cáo ${reportId}?`
        : `Xác nhận bỏ qua báo cáo ${reportId}?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }

      if (action === 'resolve') {
        await reportService.resolveReport(reportId);
        setMessage(`Báo cáo ${reportId} đã được giải quyết.`);
      } else {
        await reportService.dismissReport(reportId);
        setMessage(`Báo cáo ${reportId} đã bị bỏ qua.`);
      }

      loadReports();
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể cập nhật trạng thái báo cáo.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Report Management</h1>
              <p className="mt-1 text-sm text-slate-600">Review violation reports and update their status.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {(message || error) && (
            <div className={`mt-6 rounded-xl px-4 py-3 text-sm ${message ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
              {message || error}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Reporter</th>
                <th className="px-4 py-4">Target</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Resolved</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-slate-500">Đang tải báo cáo...</td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-slate-500">Không tìm thấy báo cáo.</td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.report_id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{report.report_id}</td>
                  <td className="px-4 py-4 text-slate-700">{report.report_type || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{report.reporter_name || report.reporter_id || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{report.target_name || report.target_user_id || '-'}</td>
                  <td className="px-4 py-4 text-slate-700">{formatDateTime(report.created_at)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[report.status] || 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{formatDateTime(report.resolved_at)}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        disabled={processingId === report.report_id || report.status === 'RESOLVED'}
                        onClick={() => handleAction(report.report_id, 'resolve')}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >Resolve</button>
                      <button
                        disabled={processingId === report.report_id || report.status === 'DISMISSED'}
                        onClick={() => handleAction(report.report_id, 'dismiss')}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >Dismiss</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
