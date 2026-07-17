import { useState, useEffect, useCallback, useRef } from 'react';
import { buildReportPayload, reportService } from '../../services/reportService';

const REPORT_TYPES = [
  { value: 'FRAUD', label: 'Fraud / Scam' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'FAKE_PROFILE', label: 'Fake Profile' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate Content' },
  { value: 'COPYRIGHT', label: 'Copyright Violation' },
  { value: 'OTHER', label: 'Other' }
];

/**
 * ReportModal
 * 
 * Standardized report modal with confirmation dialog.
 * 
 * Key features:
 * - Removed ownerId dependency (backend resolves ownership)
 * - Uses standardized entityType + entityId contract
 * - Confirmation dialog before submission
 * - Comprehensive error handling (409, 429, 400, network)
 * - Double-submit prevention
 */
export default function ReportModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  entityType: entityScope = 'USER',
  entityId,
  projectTitle
}) {
  const [violationType, setViolationType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const closeTimeoutRef = useRef(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearCloseTimeout();
    setShowConfirm(false);
    onClose();
  }, [clearCloseTimeout, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const resetTimer = window.setTimeout(() => {
      setViolationType('');
      setDescription('');
      setError('');
      setSuccess(false);
      setShowConfirm(false);
    }, 0);

    return () => window.clearTimeout(resetTimer);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  // Step 1: Validate and show confirmation
  const handlePreSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');

    if (loading || success) return;

    const isProjectReport = entityScope === 'PROJECT';
    const effectiveEntityId = isProjectReport ? entityId : targetUserId;

    if (!violationType) {
      setError('Please select a report type.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description.');
      return;
    }
    if (!effectiveEntityId) {
      setError(isProjectReport ? 'Project context is missing.' : 'Target user context is missing.');
      return;
    }

    // Show confirmation dialog
    setShowConfirm(true);
  }, [violationType, description, entityId, targetUserId, entityScope, loading, success]);

  // Step 2: Actually submit after confirmation
  const handleConfirmSubmit = useCallback(async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');

    const isProjectReport = entityScope === 'PROJECT';
    const effectiveEntityId = isProjectReport ? entityId : targetUserId;

    try {
      const payload = buildReportPayload({
        entityType: entityScope,
        entityId: effectiveEntityId,
        violationType,
        description: description.trim()
      });

      const result = await reportService.submitReport(payload);

      if (result.success) {
        setSuccess(true);
        clearCloseTimeout();
        closeTimeoutRef.current = window.setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.message || 'Failed to submit report.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.response?.status === 409) {
        setError('You have already submitted a similar report for this item. Please wait for it to be reviewed.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else {
        setError(err.message || 'Failed to submit report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [violationType, description, entityId, targetUserId, entityScope, handleClose, clearCloseTimeout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{entityScope === 'PROJECT' ? 'Báo cáo dự án' : 'Báo cáo người dùng'}</h2>
            {entityScope === 'PROJECT' ? (
              <p className="text-sm text-slate-500 mt-1">Dự án: <span className="font-medium text-slate-700">{projectTitle || 'Dự án được chọn'}</span></p>
            ) : targetUserName && (
              <p className="text-sm text-slate-500 mt-1">Đối tượng: <span className="font-medium text-slate-700">{targetUserName}</span></p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handlePreSubmit} className="p-6 space-y-5">
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
              value={violationType}
              onChange={(e) => setViolationType(e.target.value)}
              disabled={loading || success}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a reason for reporting</option>
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
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
              maxLength={5000}
              disabled={loading || success}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-slate-800 bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/5000</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
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

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 z-10">
            <div className="text-center max-w-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Xác nhận gửi báo cáo</h3>
              <p className="text-sm text-slate-600 mb-1">
                Bạn có chắc chắn muốn gửi báo cáo vi phạm này?
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Loại: <strong>{violationType}</strong> — Mô tả: "{description.substring(0, 100)}{description.length > 100 ? '...' : ''}"
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
                >
                  Xác nhận gửi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}