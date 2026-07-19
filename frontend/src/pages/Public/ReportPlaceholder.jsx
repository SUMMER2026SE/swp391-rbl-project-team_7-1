import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildReportPayload, reportService } from '../../services/reportService';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';

const PROJECT_VIOLATION_TYPES = [
  { value: 'FRAUD',                 label: 'Dự án giả mạo / Lừa đảo tiền đặt cọc' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Nội dung tuyển dụng không lành mạnh / Thô tục' },
  { value: 'SPAM',                  label: 'Spam tuyển dụng / Trùng lặp nhiều lần' },
  { value: 'COPYRIGHT',             label: 'Vi phạm bản quyền / Đạo nhái ý tưởng dự án' },
  { value: 'OTHER',                 label: 'Lý do khác (Mô tả chi tiết bên dưới)' }
];

const USER_VIOLATION_TYPES = [
  { value: 'FRAUD',                 label: 'Lừa đảo / Quỵt tiền / Không bàn giao sản phẩm' },
  { value: 'HARASSMENT',            label: 'Quấy rối / Công kích cá nhân / Thái độ thô lỗ' },
  { value: 'FAKE_PROFILE',          label: 'Hồ sơ giả mạo / Gian lận thông tin kỹ năng' },
  { value: 'SPAM',                  label: 'Spam tin nhắn / Quảng cáo rác' },
  { value: 'OTHER',                 label: 'Lý do khác (Mô tả chi tiết bên dưới)' }
];

const ENTITY_TYPES = [
  { value: 'PROJECT', label: 'Dự án tuyển dụng', icon: 'work',         color: 'violet' },
  { value: 'USER',    label: 'Người dùng',        icon: 'person',       color: 'teal'   },
];

export default function ReportPlaceholder() {
  const navigate = useNavigate();
  const location = useLocation();
  const params   = new URLSearchParams(location.search);
  const [countdown, setCountdown] = useState(3);

  // Pre-fill from query params (e.g. from ProjectDetails or Profile page)
  const [entityType,   setEntityType]   = useState(params.get('type')?.toUpperCase()   || location.state?.type        || '');
  const [entityId,     setEntityId]     = useState(params.get('entityId')               || location.state?.entityId    || '');
  const [entityLabel,  setEntityLabel]  = useState(params.get('title')                  || location.state?.title       || '');
  const [violation,    setViolation]    = useState('');
  const [description,  setDescription]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // Search states for autocomplete
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceTimer = useRef(null);

  const currentReportTypes = entityType === 'PROJECT' ? PROJECT_VIOLATION_TYPES : USER_VIOLATION_TYPES;
  useEffect(() => {
    const uid  = params.get('targetUserId') || location.state?.targetUserId;
    const name = params.get('targetUserName') || location.state?.targetUserName;
    if (uid && !entityId) {
      setEntityType('USER');
      setEntityId(String(uid));
      setEntityLabel(name || '');
    }
  }, []); // eslint-disable-line

  // Handle autocomplete search based on entityType
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        if (entityType === 'PROJECT') {
          const res = await projectService.getPublicProjects({ search: searchQuery, limit: 10 });
          const projects = res.projects || res.data || [];
          setSearchResults(projects.map(p => ({
            id: String(p.project_id),
            title: p.title,
            extra: p.company_name || p.full_name || 'Nhà tuyển dụng'
          })));
        } else if (entityType === 'USER') {
          const res = await userService.getAllFreelancers();
          const freelancers = res.freelancers || res.users || res.data || [];
          const filtered = freelancers.filter(u => 
            (u.fullName || u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 10);

          setSearchResults(filtered.map(u => ({
            id: String(u.userId || u.user_id || u.id),
            title: u.fullName || u.full_name || u.username || 'Người dùng',
            extra: u.email || ''
          })));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, entityType]);

  const selectedEntity = ENTITY_TYPES.find(e => e.value === entityType);

  const validate = () => {
    if (!entityType) return 'Vui lòng chọn loại đối tượng báo cáo.';
    if (!entityId.trim()) return `Vui lòng chọn hoặc nhập ${entityType === 'PROJECT' ? 'Dự án' : 'Người dùng'} cần báo cáo.`;
    if (!/^\d+$/.test(entityId.trim())) return 'ID phải là số nguyên dương.';
    if (!violation) return 'Vui lòng chọn lý do vi phạm.';
    if (!description.trim()) return 'Vui lòng nhập mô tả chi tiết vi phạm.';
    return '';
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');
    try {
      const payload = buildReportPayload({
        entityType,
        entityId:      entityId.trim(),
        violationType: violation,
        description:   description.trim(),
      });
      const result = await reportService.submitReport(payload);
       if (result.success) {
        setSuccess(true);
        setCountdown(3);
      } else {
        setError(result.message || 'Gửi báo cáo thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 409) {
        setError('Bạn đã gửi báo cáo tương tự gần đây. Vui lòng chờ đội ngũ xử lý.');
      } else if (err?.response?.status === 429) {
        setError('Quá nhiều yêu cầu. Vui lòng chờ vài phút rồi thử lại.');
      } else if (err?.response?.status === 404) {
        setError(`Không tìm thấy ${entityType === 'PROJECT' ? 'dự án' : 'người dùng'} với ID này. Vui lòng kiểm tra lại.`);
      } else {
        setError(msg || 'Lỗi kết nối. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEntityType(''); setEntityId(''); setEntityLabel('');
    setViolation(''); setDescription(''); setError(''); setSuccess(false);
    setSearchQuery(''); setSearchResults([]);
  };

  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSelectSearchResult = (item) => {
    setEntityId(item.id);
    setEntityLabel(item.title);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_4px_32px_rgba(15,23,42,0.06)] p-10 max-w-md w-full text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-[32px]">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Gửi báo cáo thành công!</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Báo cáo vi phạm của bạn đã được ghi nhận. Đội ngũ kiểm duyệt FJMS sẽ xem xét và xử lý trong vòng 24–48 giờ.
          </p>
          <p className="text-xs text-[#0F766E] font-bold mb-6">
            Tự động chuyển về trang chủ sau {countdown} giây...
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2.5 bg-[#0F766E] hover:bg-[#0D5E58] text-white rounded-xl text-sm font-bold transition-all cursor-pointer border-none"
            >
              Về trang chủ ngay
            </button>
            <button
              onClick={handleReset}
              className="w-full px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all cursor-pointer border-none"
            >
              Gửi báo cáo khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 md:px-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-rose-600 text-[22px]">flag</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Báo cáo vi phạm</h1>
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-wider">Hệ thống xử lý vi phạm FJMS</p>
          </div>
        </div>

        <form onSubmit={handlePreSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_32px_rgba(15,23,42,0.06)] p-6 flex flex-col gap-5">

          {/* ── Step 1: Loại đối tượng ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Loại đối tượng báo cáo <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ENTITY_TYPES.map(({ value, label, icon, color }) => {
                const isSelected = entityType === value;
                // Sửa màu CSS động để tránh mất hình và lỗi màu
                const borderClass = isSelected 
                  ? (value === 'PROJECT' ? 'border-purple-600 bg-purple-50/50' : 'border-teal-600 bg-teal-50/50') 
                  : 'border-slate-200 bg-white hover:border-slate-300';
                const iconBgClass = isSelected 
                  ? (value === 'PROJECT' ? 'bg-purple-600 text-white' : 'bg-teal-600 text-white') 
                  : (value === 'PROJECT' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600');

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setEntityType(value); setEntityId(''); setEntityLabel(''); setSearchQuery(''); setSearchResults([]); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${borderClass}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${iconBgClass}`}>
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </div>
                    <span className="font-bold text-slate-700 text-xs">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Step 2: Tìm kiếm / Nhập đối tượng ── */}
          {entityType && (
            <div className="animate-in fade-in duration-150 relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {entityType === 'PROJECT' ? 'Tìm hoặc Nhập dự án' : 'Tìm hoặc Nhập người dùng'} <span className="text-rose-500">*</span>
              </label>
              
              {entityLabel ? (
                <div className="mb-2 flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className={`material-symbols-outlined text-[14px] ${entityType === 'PROJECT' ? 'text-purple-600' : 'text-teal-600'}`}>
                    {selectedEntity?.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">{entityLabel}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">ID: {entityId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEntityLabel(''); setEntityId(''); }}
                    className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      // Hỗ trợ nhập trực tiếp ID bằng số
                      if (/^\d+$/.test(e.target.value.trim())) {
                        setEntityId(e.target.value.trim());
                      }
                    }}
                    placeholder={entityType === 'PROJECT' ? 'Tìm theo tên dự án hoặc nhập trực tiếp ID...' : 'Tìm theo tên, email, username hoặc nhập trực tiếp ID...'}
                    className="w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white placeholder-slate-400"
                  />
                  {searching && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <span className="w-4 h-4 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin block" />
                    </span>
                  )}
                  
                  {/* Dropdown kết quả tìm kiếm */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-55 max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item)}
                          className="w-full flex flex-col p-3 hover:bg-slate-50 text-left cursor-pointer transition-all"
                        >
                          <span className="text-xs font-bold text-slate-700">{item.title}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">ID: {item.id} {item.extra ? `· ${item.extra}` : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="mt-1.5 text-[10px] text-slate-400 font-semibold">
                💡 Bạn có thể nhập **Tên để tìm kiếm** và chọn từ danh sách, hoặc **nhập trực tiếp số ID** của đối tượng.
              </p>
            </div>
          )}

          {/* ── Step 3: Lý do vi phạm ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Lý do vi phạm <span className="text-rose-500">*</span>
            </label>
            <select
              value={violation}
              onChange={e => setViolation(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white cursor-pointer"
            >
              <option value="">Chọn lý do vi phạm...</option>
              {currentReportTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* ── Step 4: Mô tả chi tiết ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Mô tả chi tiết vi phạm <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể hành vi vi phạm, thời gian, bằng chứng liên quan (tối thiểu 20 ký tự)..."
              rows={4}
              maxLength={5000}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white resize-none placeholder-slate-400"
            />
            <p className="text-[10px] text-slate-400 mt-1 text-right font-semibold">
              {description.length}/5000 ký tự
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl animate-in slide-in-from-top-1">
              <span className="material-symbols-outlined text-rose-500 text-[16px] shrink-0 mt-0.5">error</span>
              <p className="text-xs font-bold text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Info note */}
          <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="material-symbols-outlined text-blue-500 text-[15px] shrink-0 mt-0.5">info</span>
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Báo cáo sẽ được đội ngũ FJMS xem xét trong 24–48 giờ. Thông tin của bạn được bảo mật. Báo cáo sai sự thật có thể dẫn đến khóa tài khoản.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer bg-white disabled:opacity-50"
            >
              Xóa form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />}
              {loading ? 'Đang gửi...' : 'Gửi báo cáo vi phạm'}
            </button>
          </div>
        </form>

        {/* Policy note */}
        <div className="mt-5 flex items-start gap-2.5 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-slate-400 text-[17px] shrink-0 mt-0.5">policy</span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-600">Chính sách báo cáo FJMS: </span>
            Mọi báo cáo được xem xét độc lập và bảo mật. Báo cáo có chủ đích gây hại hoặc không có cơ sở sẽ bị từ chối và có thể dẫn đến xử lý tài khoản người báo cáo.
          </p>
        </div>
      </div>

      {/* Confirm overlay */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-6 animate-in fade-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-rose-500 text-[24px]">flag</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-1.5">Xác nhận gửi báo cáo?</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed mb-4">
              Báo cáo này sẽ được gửi đến Ban quản trị FJMS để xem xét và xử lý.
            </p>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1.5 mb-5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-20 shrink-0">Loại:</span>
                <span className="font-bold">{selectedEntity?.label || entityType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-20 shrink-0">ID:</span>
                <span className="font-bold">{entityId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400 w-20 shrink-0">Vi phạm:</span>
                <span className="font-bold text-rose-600">
                  {currentReportTypes.find(t => t.value === violation)?.label}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-400 w-20 shrink-0 mt-0.5">Mô tả:</span>
                <span className="line-clamp-2 text-slate-500">"{description}"</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer bg-white"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer border-none"
              >
                Xác nhận gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}