import { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';

const statusBadge = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-100';
    case 'UNDER_REVIEW': return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    case 'DISMISSED': return 'bg-slate-50 text-slate-700 border border-slate-100';
    default: return 'bg-slate-50 text-slate-700 border border-slate-100';
  }
};

const statusLabel = (status) => {
  switch (status) {
    case 'PENDING': return 'Pending Review';
    case 'UNDER_REVIEW': return 'Under Review';
    case 'RESOLVED': return 'Resolved';
    case 'DISMISSED': return 'Dismissed';
    default: return status;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  } catch {
    return '—';
  }
};

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedReport, setExpandedReport] = useState(null);
  const limit = 10;

  const fetchReports = async (opts = {}) => {
    setLoading(true);
    setError('');

    try {
      const p = opts.page || page;
      const params = {
        offset: (p - 1) * limit,
        limit,
        status: statusFilter || undefined
      };

      const response = await reportService.getMyReports(params);

      if (response.success) {
        setReports(response.reports || []);
        setTotal(response.total || 0);
        setPage(p);
        setTotalPages(Math.ceil((response.total || 0) / limit) || 1);
      } else {
        setError(response.message || 'Failed to load your reports.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track the status of reports you've submitted.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Filter:</span>
          {['', 'PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s ? statusLabel(s) : 'All'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Reports List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400 mt-3">Loading your reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">No reports found</h3>
            <p className="text-sm text-slate-500">
              {statusFilter ? `No ${statusLabel(statusFilter).toLowerCase()} reports.` : 'You haven\'t submitted any reports yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Summary row */}
                <div 
                  className="p-4 flex flex-col md:flex-row md:items-center gap-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpandedReport(expandedReport === r.id ? null : r.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-400">#{r.id}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                        r.target.type === 'PROJECT' 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'bg-teal-50 text-teal-600'
                      }`}>
                        {r.target.type}
                      </span>
                      <span className="text-xs bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">
                        {r.violationType}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm truncate">
                      {r.target.title || `#${r.target.id}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedReport === r.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded detail */}
                {expandedReport === r.id && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Description:</p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{r.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-slate-500">
                      <div>
                        <span className="font-semibold">Submitted:</span>{' '}
                        <span className="font-medium text-slate-700">{formatDate(r.createdAt)}</span>
                      </div>
                      {r.updatedAt && r.updatedAt !== r.createdAt && (
                        <div>
                          <span className="font-semibold">Last updated:</span>{' '}
                          <span className="font-medium text-slate-700">{formatDate(r.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-semibold text-slate-500">
              Showing {reports.length} of {total} reports
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReports({ page: page - 1 })}
                disabled={page <= 1}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-700 px-3 py-1.5 bg-white border border-slate-200 rounded-xl">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchReports({ page: page + 1 })}
                disabled={page >= totalPages}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 transition-all cursor-pointer hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}