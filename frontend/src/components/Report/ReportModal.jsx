import { useState, useEffect, useCallback, useRef } from 'react';
import { buildReportPayload, reportService } from '../../services/reportService';

const REPORT_TYPES = [
  { value: 'FRAUD', label: 'Lừa đảo / Gian lận' },
  { value: 'HARASSMENT', label: 'Quấy rối / Công kích' },
  { value: 'SPAM', label: 'Spam quảng cáo / Rác' },
  { value: 'FAKE_PROFILE', label: 'Tài khoản giả mạo' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Nội dung không lành mạnh' },
  { value: 'COPYRIGHT', label: 'Vi phạm bản quyền' },
  { value: 'OTHER', label: 'Lý do khác' }
];

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
      setError('Vui lòng chọn loại vi phạm cần báo cáo.');
      return;
    }
    if (!description.trim()) {
      setError('Vui lòng cung cấp mô tả chi tiết hành vi vi phạm.');
      return;
    }
    if (!effectiveEntityId) {
      setError(isProjectReport ? 'Thiếu thông tin đối tượng dự án.' : 'Thiếu thông tin đối tượng người dùng.');
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
        setError(result.message || 'Gửi báo cáo vi phạm thất bại.');
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.response?.status === 409) {
        setError('Bạn đã gửi một báo cáo tương tự cho đối tượng này gần đây. Vui lòng chờ kiểm duyệt.');
      } else if (err.response?.status === 429) {
        setError('Hành động quá nhanh. Vui lòng chờ giây lát trước khi thử lại.');
      } else {
        setError(err.message || 'Gửi báo cáo thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  }, [violationType, description, entityId, targetUserId, entityScope, handleClose, clearCloseTimeout]);

  if (!isOpen) return null;

  const currentReportTypeLabel = REPORT_TYPES.find(t => t.value === violationType)?.label || violationType;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden border border-slate-100 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-150">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-rose-600 text-[22px]">gavel</span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {entityScope === 'PROJECT' ? 'Báo cáo dự án tuyển dụng' : 'Báo cáo người dùng'}
              </h2>
              {entityScope === 'PROJECT' ? (
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Dự án: <span className="font-bold text-[#0F766E]">{projectTitle || 'Dự án được chọn'}</span></p>
              ) : targetUserName && (
                <p className="text-xs text-slate-400 mt-0.5 font-semibold">Đối tượng: <span className="font-bold text-[#0F766E]">{targetUserName}</span></p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        {showConfirm ? (
          <div className="p-6 text-center max-w-sm mx-auto animate-in fade-in duration-200">
            <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-rose-600 text-[24px]">warning</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5">Xác nhận gửi báo cáo</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Bạn có chắc chắn muốn gửi báo cáo vi phạm này đến Ban quản trị FJMS để xử lý không?
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[11px] text-left text-slate-500 font-semibold mb-6 space-y-1">
              <p>• Loại: <span className="text-rose-600 font-bold">{currentReportTypeLabel}</span></p>
              <p className="line-clamp-2">• Nội dung: "{description}"</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer bg-white"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer border-none"
              >
                Xác nhận gửi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePreSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-[18px] text-rose-500 mt-0.5 shrink-0">error</span>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-2xl text-xs font-bold flex items-start gap-2.5 animate-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-[18px] text-emerald-500 mt-0.5 shrink-0">check_circle</span>
                <p className="leading-relaxed">Báo cáo vi phạm đã được gửi thành công. Đội ngũ kiểm duyệt sẽ xử lý trong thời gian sớm nhất.</p>
              </div>
            )}

            {/* Report Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Lý do báo cáo vi phạm <span className="text-rose-500">*</span>
              </label>
              <select
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                disabled={loading || success}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300"
              >
                <option value="">Chọn lý do báo cáo vi phạm</option>
                {REPORT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết vi phạm <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng cung cấp chi tiết bằng chứng và hành vi vi phạm..."
                rows={4}
                maxLength={5000}
                disabled={loading || success}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white resize-none disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300"
              />
              <p className="text-[10px] text-slate-455 mt-1 text-right font-bold">{description.length}/5000 ký tự</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer bg-white"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 py-3 px-4 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {loading && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                )}
                {loading ? 'Đang gửi...' : success ? 'Đã gửi ✓' : 'Gửi báo cáo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}