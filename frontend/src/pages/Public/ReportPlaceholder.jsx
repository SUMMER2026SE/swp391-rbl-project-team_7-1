import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildReportPayload, reportService } from '../../services/reportService';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';

const PROJECT_VIOLATION_TYPES = [
  { value: 'FRAUD', label: 'Dự án có dấu hiệu lừa đảo / Yêu cầu đặt cọc trước', icon: 'gpp_bad' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Nội dung dự án không lành mạnh / Vi phạm thuần phong mỹ tục', icon: 'no_adult_content' },
  { value: 'SPAM', label: 'Spam tin tuyển dụng / Đăng tin trùng lặp nhiều lần', icon: 'block' },
  { value: 'COPYRIGHT', label: 'Dự án vi phạm bản quyền / Sử dụng trái phép ý tưởng', icon: 'copyright' },
  { value: 'OTHER', label: 'Lý do khác (Mô tả chi tiết ở phần nội dung)', icon: 'more_horiz' }
];

const USER_VIOLATION_TYPES = [
  { value: 'FRAUD', label: 'Gian lận thanh toán / Không bàn giao sản phẩm / Vi phạm cam kết hợp đồng', icon: 'gpp_bad' },
  { value: 'HARASSMENT', label: 'Ngôn từ không phù hợp / Quấy rối / Công kích cá nhân', icon: 'person_off' },
  { value: 'FAKE_PROFILE', label: 'Thông tin hồ sơ giả mạo / Gian lận chứng chỉ & kỹ năng', icon: 'badge' },
  { value: 'SPAM', label: 'Spam tin nhắn quảng cáo / Gửi liên kết độc hại', icon: 'block' },
  { value: 'OTHER', label: 'Lý do khác (Mô tả chi tiết ở phần nội dung)', icon: 'more_horiz' }
];

const ENTITY_TYPES = [
  { value: 'PROJECT', label: 'Báo cáo Dự án', icon: 'work', color: 'violet' },
  { value: 'USER', label: 'Báo cáo Người dùng', icon: 'person', color: 'teal' },
];

const MAX_IMAGES = 5;
const MAX_IMG_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export default function ReportPlaceholder() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [countdown, setCountdown] = useState(3);

  // Pre-fill from query params
  const [entityType, setEntityType] = useState(params.get('type')?.toUpperCase() || location.state?.type || '');
  const [entityId, setEntityId] = useState(params.get('entityId') || location.state?.entityId || '');
  const [entityLabel, setEntityLabel] = useState(params.get('title') || location.state?.title || '');
  const [violation, setViolation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Evidence images
  const [imageFiles, setImageFiles] = useState([]); // { file: File, previewUrl: string, id: string }
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceTimer = useRef(null);

  const currentReportTypes = entityType === 'PROJECT' ? PROJECT_VIOLATION_TYPES : USER_VIOLATION_TYPES;

  useEffect(() => {
    const uid = params.get('targetUserId') || location.state?.targetUserId;
    const name = params.get('targetUserName') || location.state?.targetUserName;
    if (uid && !entityId) {
      setEntityType('USER');
      setEntityId(String(uid));
      setEntityLabel(name || '');
    }
  }, []); // eslint-disable-line

  // Autocomplete search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        if (entityType === 'PROJECT') {
          const res = await projectService.getPublicProjects({ search: searchQuery, limit: 10, report: 'true' });
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
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [searchQuery, entityType]);

  const selectedEntity = ENTITY_TYPES.find(e => e.value === entityType);

  // ---- Image handling ----
  const addImages = useCallback((files) => {
    const validFiles = Array.from(files).filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError(`File "${f.name}" không phải ảnh hợp lệ (JPG, PNG, GIF, WEBP).`);
        return false;
      }
      if (f.size > MAX_IMG_SIZE_MB * 1024 * 1024) {
        setError(`File "${f.name}" vượt quá ${MAX_IMG_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    setImageFiles(prev => {
      const remaining = MAX_IMAGES - prev.length;
      const toAdd = validFiles.slice(0, remaining).map(file => ({
        id: Math.random().toString(36).slice(2),
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      if (validFiles.length > remaining) {
        setError(`Tối đa ${MAX_IMAGES} ảnh bằng chứng. Bỏ qua ${validFiles.length - remaining} ảnh thừa.`);
      }
      return [...prev, ...toAdd];
    });
  }, []);

  const removeImage = (id) => {
    setImageFiles(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  }, [addImages]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);

  // ---- Form logic ----
  const validate = () => {
    if (!entityType) return 'Vui lòng chọn loại đối tượng báo cáo.';
    if (!entityId.trim()) return `Vui lòng chọn hoặc nhập ${entityType === 'PROJECT' ? 'Dự án' : 'Người dùng'} cần báo cáo.`;
    if (!/^\d+$/.test(entityId.trim())) return 'ID phải là số nguyên dương.';
    if (!violation) return 'Vui lòng chọn lý do vi phạm.';
    if (!description.trim() || description.trim().length < 20) return 'Vui lòng nhập mô tả chi tiết vi phạm (tối thiểu 20 ký tự).';
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
      // 1. Upload images first (if any)
      let uploadedUrls = [];
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        try {
          const uploadResult = await reportService.uploadEvidenceImages(imageFiles.map(i => i.file));
          if (uploadResult.success && uploadResult.images) {
            uploadedUrls = uploadResult.images;
          }
        } catch (uploadErr) {
          console.warn('Image upload failed, continuing without images:', uploadErr);
        } finally {
          setUploadingImages(false);
        }
      }

      // 2. Submit the report
      const payload = buildReportPayload({
        entityType,
        entityId: entityId.trim(),
        violationType: violation,
        description: description.trim(),
      });
      const result = await reportService.submitReport(payload);

      if (result.success) {
        // 3. Add evidence records for each uploaded image
        if (uploadedUrls.length > 0 && result.report?.id) {
          const reportId = result.report.id;
          for (const img of uploadedUrls) {
            try {
              await reportService.addEvidence(reportId, {
                fileUrl: img.url,
                fileType: 'IMAGE',
                fileName: img.fileName,
                fileSize: img.fileSize
              });
            } catch (evidenceErr) {
              console.warn('Failed to attach evidence image:', evidenceErr);
            }
          }
        }
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
        setError(`Không tìm thấy ${entityType === 'PROJECT' ? 'dự án' : 'người dùng'} với ID này.`);
      } else {
        setError(msg || 'Lỗi kết nối. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    imageFiles.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setEntityType(''); setEntityId(''); setEntityLabel('');
    setViolation(''); setDescription(''); setError(''); setSuccess(false);
    setSearchQuery(''); setSearchResults([]);
    setImageFiles([]);
  };

  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) { navigate('/'); return; }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSelectSearchResult = (item) => {
    setEntityId(item.id);
    setEntityLabel(item.title);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, []); // eslint-disable-line

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_48px_rgba(15,23,42,0.08)] p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="material-symbols-outlined text-white text-[38px]">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Gửi báo cáo thành công!</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            Báo cáo vi phạm của bạn đã được ghi nhận. Đội ngũ kiểm duyệt FJMS sẽ xem xét và xử lý trong vòng 24–48 giờ.
          </p>
          <p className="text-xs text-emerald-600 font-bold mb-7 bg-emerald-50 py-2 px-4 rounded-full inline-block">
            Tự động về trang chủ sau {countdown} giây...
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#0F766E] to-teal-500 hover:from-[#0D5E58] hover:to-teal-600 text-white rounded-2xl text-sm font-bold transition-all cursor-pointer border-none shadow-md shadow-teal-200"
            >
              Về trang chủ ngay
            </button>
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-sm font-bold transition-all cursor-pointer border-none"
            >
              Gửi báo cáo khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/20 py-10 px-4 md:px-8">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
            <span className="material-symbols-outlined text-white text-[22px]">flag</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Báo cáo vi phạm</h1>
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-wider">Hệ thống xử lý vi phạm FJMS · Bảo mật 100%</p>
          </div>
        </div>

        <form onSubmit={handlePreSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_40px_rgba(15,23,42,0.07)] p-6 flex flex-col gap-6">

          {/* ── Step 1: Loại đối tượng ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Bước 1 — Chọn loại đối tượng báo cáo <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ENTITY_TYPES.map(({ value, label, icon, color }) => {
                const isSelected = entityType === value;
                const borderClass = isSelected
                  ? (value === 'PROJECT' ? 'border-purple-600 bg-purple-50/70 shadow-md shadow-purple-100' : 'border-teal-600 bg-teal-50/70 shadow-md shadow-teal-100')
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm';
                const iconBgClass = isSelected
                  ? (value === 'PROJECT' ? 'bg-purple-600 text-white' : 'bg-teal-600 text-white')
                  : (value === 'PROJECT' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600');
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setEntityType(value); setEntityId(''); setEntityLabel(''); setSearchQuery(''); setSearchResults([]); setViolation(''); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${borderClass}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${iconBgClass}`}>
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <span className="font-bold text-slate-700 text-xs leading-tight">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Step 2: Tìm kiếm đối tượng ── */}
          {entityType && (
            <div className="animate-in fade-in duration-200 relative">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Bước 2 — {entityType === 'PROJECT' ? 'Chọn Dự án bị báo cáo' : 'Chọn Người dùng bị báo cáo'} <span className="text-rose-500">*</span>
              </label>

              {entityLabel ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-2 border-slate-200 rounded-2xl">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${entityType === 'PROJECT' ? 'bg-purple-100' : 'bg-teal-100'}`}>
                    <span className={`material-symbols-outlined text-[16px] ${entityType === 'PROJECT' ? 'text-purple-600' : 'text-teal-600'}`}>
                      {selectedEntity?.icon}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-700 truncate">{entityLabel}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">ID: {entityId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEntityLabel(''); setEntityId(''); }}
                    className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer border-none bg-transparent transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[16px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      if (/^\d+$/.test(e.target.value.trim())) setEntityId(e.target.value.trim());
                    }}
                    placeholder={entityType === 'PROJECT' ? 'Tìm theo tên dự án hoặc nhập trực tiếp ID số...' : 'Tìm theo tên, email, username hoặc nhập ID số...'}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white placeholder-slate-400"
                  />
                  {searching && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <span className="w-4 h-4 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin block" />
                    </span>
                  )}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectSearchResult(item)}
                          className="w-full flex flex-col p-3.5 hover:bg-slate-50 text-left cursor-pointer transition-all"
                        >
                          <span className="text-xs font-bold text-slate-700">{item.title}</span>
                          <span className="text-[9px] text-slate-400 font-semibold mt-0.5">ID: {item.id}{item.extra ? ` · ${item.extra}` : ''}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="mt-1.5 text-[10px] text-slate-400 font-semibold leading-relaxed">
                💡 Tìm kiếm theo tên rồi chọn từ danh sách, hoặc nhập trực tiếp số ID đối tượng.
              </p>
            </div>
          )}

          {/* ── Step 3: Lý do vi phạm ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Bước 3 — Lý do vi phạm <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {currentReportTypes.map(t => {
                const isSelected = violation === t.value;
                return (
                  <label
                    key={t.value}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all select-none ${
                      isSelected ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="violation"
                      value={t.value}
                      checked={isSelected}
                      onChange={() => setViolation(t.value)}
                      className="accent-rose-600 w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span className={`material-symbols-outlined text-[17px] shrink-0 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`}>{t.icon}</span>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>{t.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Step 4: Mô tả chi tiết ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Bước 4 — Mô tả chi tiết vi phạm <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể hành vi vi phạm: thời gian xảy ra, bằng chứng liên quan, tác hại gây ra... (tối thiểu 20 ký tự)"
              rows={5}
              maxLength={5000}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#0F766E]/10 focus:border-[#0F766E] outline-none transition-all text-sm text-slate-800 bg-white resize-none placeholder-slate-400 leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1">
              <span className={`text-[10px] font-semibold ${description.trim().length < 20 && description.length > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                {description.trim().length < 20 && description.length > 0 ? `Cần thêm ${20 - description.trim().length} ký tự nữa` : 'Tối thiểu 20 ký tự'}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{description.length}/5000</span>
            </div>
          </div>

          {/* ── Step 5: Upload ảnh bằng chứng ── */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Bước 5 — Ảnh bằng chứng <span className="text-slate-400 font-normal normal-case">(Tùy chọn, tối đa {MAX_IMAGES} ảnh)</span>
            </label>

            {/* Drop zone */}
            {imageFiles.length < MAX_IMAGES && (
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-2 py-7 px-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#0F766E] bg-teal-50/50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDragOver ? 'bg-teal-100' : 'bg-slate-100'}`}>
                  <span className={`material-symbols-outlined text-[24px] ${isDragOver ? 'text-teal-600' : 'text-slate-400'}`}>add_photo_alternate</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600">
                    {isDragOver ? 'Thả ảnh vào đây!' : 'Kéo thả ảnh hoặc nhấp để chọn'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    JPG, PNG, GIF, WEBP · Tối đa {MAX_IMG_SIZE_MB}MB mỗi ảnh · {imageFiles.length}/{MAX_IMAGES} ảnh đã chọn
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={e => { if (e.target.files) addImages(e.target.files); e.target.value = ''; }}
                  className="hidden"
                />
              </div>
            )}

            {/* Image preview grid */}
            {imageFiles.length > 0 && (
              <div className={`grid grid-cols-3 gap-2.5 ${imageFiles.length < MAX_IMAGES ? 'mt-3' : ''}`}>
                {imageFiles.map(img => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center border-none cursor-pointer shadow-lg hover:bg-rose-700 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    {/* File name tooltip */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] text-white font-semibold truncate">{img.file.name}</p>
                      <p className="text-[8px] text-slate-300">{(img.file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                ))}
                {/* Add more button */}
                {imageFiles.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#0F766E] hover:bg-teal-50/50 transition-all"
                  >
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">add</span>
                    <span className="text-[9px] text-slate-400 font-bold">Thêm</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="material-symbols-outlined text-rose-500 text-[16px] shrink-0 mt-0.5">error</span>
              <p className="text-xs font-bold text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Info note */}
          <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
            <span className="material-symbols-outlined text-blue-500 text-[15px] shrink-0 mt-0.5">policy</span>
            <p className="text-[11px] text-blue-700 font-semibold leading-relaxed">
              Báo cáo được xem xét trong 24–48 giờ. Thông tin của bạn được bảo mật hoàn toàn. Báo cáo sai sự thật hoặc cố tình gây hại có thể dẫn đến khóa tài khoản.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer bg-white disabled:opacity-50"
            >
              Xóa form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-2xl font-bold text-sm transition-all cursor-pointer border-none flex items-center justify-center gap-2 shadow-md shadow-rose-200 disabled:opacity-60 disabled:shadow-none"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />}
              {loading
                ? (uploadingImages ? 'Đang tải ảnh...' : 'Đang gửi báo cáo...')
                : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                    Gửi báo cáo vi phạm
                  </>
                )
              }
            </button>
          </div>
        </form>

        {/* Confirm overlay */}
        {showConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-6" onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
                <span className="material-symbols-outlined text-white text-[28px]">flag</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-1.5">Xác nhận gửi báo cáo?</h3>
              <p className="text-xs text-slate-400 text-center leading-relaxed mb-5">
                Báo cáo sẽ được gửi đến Ban quản trị FJMS để xem xét và xử lý theo quy trình chính thức.
              </p>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0">Đối tượng:</span>
                  <span className="text-xs font-bold text-slate-700">{selectedEntity?.label || entityType}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0">Tên:</span>
                  <span className="text-xs font-bold text-slate-700 truncate">{entityLabel || `ID: ${entityId}`}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0">Vi phạm:</span>
                  <span className="text-xs font-bold text-rose-600 leading-tight">
                    {currentReportTypes.find(t => t.value === violation)?.label}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0 mt-0.5">Mô tả:</span>
                  <span className="text-xs text-slate-500 line-clamp-2">"{description}"</span>
                </div>
                {imageFiles.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-slate-400 w-24 shrink-0">Ảnh bằng chứng:</span>
                    <span className="text-xs font-bold text-teal-600">{imageFiles.length} ảnh đính kèm</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer bg-white"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-2xl font-bold text-xs transition-all cursor-pointer border-none shadow-md shadow-rose-200"
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