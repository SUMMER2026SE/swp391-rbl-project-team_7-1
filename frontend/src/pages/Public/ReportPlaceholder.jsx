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

/**
 * ReportPlaceholder
 * 
 * A page for submitting reports by entering a project/user ID or URL.
 * 
 * IMPORTANT: ownerId is NOT sent to ReportModal.
 * Backend resolves ownership from the database.
 */
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Báo cáo vi phạm</h1>
        <p className="mt-2 text-sm text-slate-600">BẠN MUỐN BÁO CÁO GÌ?</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setSelectedType('project');
              setEntityType('PROJECT');
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left font-semibold text-slate-700 transition hover:border-[#0F766E] hover:bg-teal-50"
          >
            Báo cáo dự án
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedType('user');
              setEntityType('USER');
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left font-semibold text-slate-700 transition hover:border-[#0F766E] hover:bg-teal-50"
          >
            Báo cáo người dùng
          </button>
        </div>

        {selectedType === 'project' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tìm kiếm dự án</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              placeholder="Nhập ID dự án hoặc dán link dự án"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleOpenProjectReport}
              disabled={loadingTarget}
              className="mt-3 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loadingTarget ? 'Đang tải...' : 'Mở form báo cáo'}
            </button>
            <p className="mt-2 text-xs text-slate-500">Sau khi chọn dự án, hệ thống sẽ mở form báo cáo với thông tin dự án.</p>
          </div>
        )}

        {selectedType === 'user' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tìm kiếm người dùng</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              placeholder="Nhập ID người dùng hoặc dán link hồ sơ"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleOpenUserReport}
              disabled={loadingTarget}
              className="mt-3 rounded-xl bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loadingTarget ? 'Đang tải...' : 'Mở form báo cáo'}
            </button>
            <p className="mt-2 text-xs text-slate-500">Sau khi chọn người dùng, hệ thống sẽ mở form báo cáo với thông tin người dùng.</p>
          </div>
        )}

        {errorMsg && <p className="mt-4 text-sm text-rose-600">{errorMsg}</p>}
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