import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReportModal from '../../components/Report/ReportModal';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';

const extractProjectId = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  const match = trimmed.match(/(?:\/project-details\/|\/project\/|\/projects\/)(\d+)/i);
  if (match) return match[1];
  return /^\d+$/.test(trimmed) ? trimmed : '';
};

const extractUserId = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  const match = trimmed.match(/(?:\/profile\/)(\d+)/i);
  if (match) return match[1];
  return /^\d+$/.test(trimmed) ? trimmed : '';
};

export default function ReportPlaceholder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [entityType, setEntityType] = useState('USER');
  const [entityId, setEntityId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const [targetUserId] = useState(searchParams.get('targetUserId') || location.state?.targetUserId || '');
  const [targetUserName] = useState(searchParams.get('targetUserName') || location.state?.targetUserName || '');

  const openReportForSelection = (scope, nextEntityId = '') => {
    setEntityType(scope);
    setEntityId(nextEntityId);
    setShowReportModal(true);
  };

  const handleOpenProjectReport = async () => {
    setErrorMsg('');
    const projectId = extractProjectId(inputValue);
    if (!projectId) {
      setErrorMsg('Vui lòng nhập ID dự án hoặc dán link dự án hợp lệ.');
      return;
    }

    setLoadingTarget(true);
    try {
      const response = await projectService.getProjectById(projectId);
      const project = response.project || response;
      const ownerId = project?.employer_id || project?.owner_id || project?.user_id;
      if (!ownerId) {
        throw new Error('Không tìm thấy thông tin người sở hữu dự án.');
      }
      setProjectTitle(project?.title || 'Dự án được chọn');
      openReportForSelection('PROJECT', String(project.project_id || projectId));
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tải thông tin dự án.');
    } finally {
      setLoadingTarget(false);
    }
  };

  const handleOpenUserReport = async () => {
    setErrorMsg('');
    const userId = extractUserId(inputValue);
    if (!userId) {
      setErrorMsg('Vui lòng nhập ID người dùng hoặc dán link hồ sơ hợp lệ.');
      return;
    }

    setLoadingTarget(true);
    try {
      const response = await userService.getPublicProfile(userId);
      const profile = response.user || response;
      if (!profile?.user_id && !profile?.id) {
        throw new Error('Không tìm thấy thông tin người dùng.');
      }
      openReportForSelection('USER', String(profile.user_id || profile.id));
    } catch (err) {
      setErrorMsg(err.message || 'Không thể tải thông tin người dùng.');
    } finally {
      setLoadingTarget(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100/55">
            <span className="material-symbols-outlined text-rose-600 text-[24px]">flag</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Báo cáo vi phạm</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Hệ thống xử lý vi phạm FJMS</p>
          </div>
        </div>

        <p className="text-[14px] text-slate-600 mb-6 leading-relaxed">Bạn muốn thực hiện báo cáo vi phạm cho đối tượng nào dưới đây?</p>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <button
            type="button"
            onClick={() => {
              setSelectedType('project');
              setEntityType('PROJECT');
            }}
            className={`flex flex-col gap-3.5 p-5 rounded-2xl border-2 text-left transition-all duration-200 group cursor-pointer
              ${selectedType === 'project' ? 'border-[#0F766E] bg-teal-50/50' : 'border-slate-200 bg-white hover:border-[#0F766E]/40 hover:bg-slate-50/50'}`}
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${selectedType === 'project' ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-[#0F766E]'}`}>
              <span className="material-symbols-outlined text-[20px]">work</span>
            </span>
            <div>
              <p className="font-bold text-slate-800 text-sm">Báo cáo dự án</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-semibold">Báo cáo các tin tuyển dụng giả mạo, lừa đảo, hoặc vi phạm chính sách của FJMS.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('user');
              setEntityType('USER');
            }}
            className={`flex flex-col gap-3.5 p-5 rounded-2xl border-2 text-left transition-all duration-200 group cursor-pointer
              ${selectedType === 'user' ? 'border-[#0F766E] bg-teal-50/50' : 'border-slate-200 bg-white hover:border-[#0F766E]/40 hover:bg-slate-50/50'}`}
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${selectedType === 'user' ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-[#0F766E]'}`}>
              <span className="material-symbols-outlined text-[20px]">person</span>
            </span>
            <div>
              <p className="font-bold text-slate-800 text-sm">Báo cáo người dùng</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-semibold">Báo cáo tài khoản giả mạo, spam tin nhắn hoặc có hành vi quấy rối khi cộng tác.</p>
            </div>
          </button>
        </div>

        {selectedType === 'project' && (
          <div className="rounded-2xl border border-slate-150 bg-slate-50/60 p-5 animate-in fade-in duration-200">
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">Tìm kiếm dự án</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0F766E] transition-all"
                placeholder="Nhập ID dự án hoặc dán link dự án..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="button"
                onClick={handleOpenProjectReport}
                disabled={loadingTarget}
                className="rounded-xl bg-[#0F766E] hover:bg-[#0D5E58] px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-60 cursor-pointer"
              >
                {loadingTarget ? 'Đang tải...' : 'Mở báo cáo'}
              </button>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed font-bold">
              * Hệ thống sẽ tự động xác minh thông tin dự án trước khi mở biểu mẫu báo cáo chi tiết.
            </p>
          </div>
        )}

        {selectedType === 'user' && (
          <div className="rounded-2xl border border-slate-150 bg-slate-50/60 p-5 animate-in fade-in duration-200">
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase tracking-wider">Tìm kiếm người dùng</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0F766E] transition-all"
                placeholder="Nhập ID người dùng hoặc dán link hồ sơ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="button"
                onClick={handleOpenUserReport}
                disabled={loadingTarget}
                className="rounded-xl bg-[#0F766E] hover:bg-[#0D5E58] px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-60 cursor-pointer"
              >
                {loadingTarget ? 'Đang tải...' : 'Mở báo cáo'}
              </button>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed font-bold">
              * Hệ thống sẽ tự động xác minh thông tin tài khoản trước khi mở biểu mẫu báo cáo chi tiết.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-red-500">error</span>
            {errorMsg}
          </div>
        )}
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        entityType={entityType}
        entityId={entityId}
        projectTitle={projectTitle}
        targetUserName={targetUserName}
      />
    </div>
  );
}