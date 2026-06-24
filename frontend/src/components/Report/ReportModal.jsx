import React, { useState, useEffect, useCallback } from 'react';
import { reportService } from '../../services/reportService';

const REPORT_TYPES = [
  { value: 'FRAUD', label: 'Fraud / Scam' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'FAKE_PROFILE', label: 'Fake Profile' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'COPYRIGHT', label: 'Copyright Violation' },
  { value: 'OTHER', label: 'Other' }
];

export default function ReportModal({ isOpen, onClose, targetUserId, targetUserName }) {
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReportType('');
      setReason('');
      setDescription('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!reportType) {
      setError('Please select a report type.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }

    setLoading(true);
    try {
      const result = await reportService.submitReport({
        targetUserId,
        reportType,
        reason: reason.trim() || undefined,
        description: description.trim()
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit report.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [reportType, reason, description, targetUserId, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Report User</h2>
            {targetUserName && (
              <p className="text-sm text-slate-500 mt-1">Reporting: <span className="font-medium text-slate-700">{targetUserName}</span></p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Report submitted successfully. Our team will review it shortly.</p>
            </div>
          )}

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={loading || success}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a reason for reporting</option>
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Reason (optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief reason for the report"
              disabled={loading || success}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the violation"
              rows={4}
              disabled={loading || success}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Submitting...' : success ? 'Submitted ✓' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}