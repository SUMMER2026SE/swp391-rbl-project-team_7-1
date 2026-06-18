import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';

export default function SubmitWork() {
  const { contractId } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [fetchingContract, setFetchingContract] = useState(true);
  const [externalLink, setExternalLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadContract = async () => {
      try {
        setFetchingContract(true);
        const data = await contractService.getContractById(contractId);
        if (data.success) {
          setContract(data.contract);
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin hợp đồng.');
      } finally {
        setFetchingContract(false);
      }
    };
    if (contractId) {
      loadContract();
    }
  }, [contractId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }
      formData.append('externalLink', externalLink);
      formData.append('notes', submissionNotes);

      await contractService.submitWork(contractId, formData);
      navigate('/freelancer-dashboard', { state: { message: 'Công việc đã được nộp thành công!' } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi nộp công việc.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingContract) {
    return (
      <main className="flex-grow pt-24 pb-12 px-6 w-full max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Đang tải thông tin hợp đồng…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-24 pb-12 px-6 w-full max-w-5xl mx-auto">
      {/* Context Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-[#0F766E] mb-4 bg-transparent border-none cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại danh sách
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          {contract ? contract.contract_title : 'Nộp Sản Phẩm'}
        </h1>
        <p className="text-base text-slate-600">
          Dự án: <strong className="text-slate-800">{contract?.project_title}</strong>
        </p>
        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Canvas */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* File Upload Area */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F766E]">cloud_upload</span>
                  Tập tin sản phẩm
                </h2>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-10 flex flex-col items-center justify-center text-center group hover:border-[#0F766E] transition-colors cursor-pointer relative overflow-hidden">
                  <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple type="file" onChange={(e) => setFiles(e.target.files)} />
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-[#0F766E] transition-colors">folder_open</span>
                  </div>
                  {files && files.length > 0 ? (
                    <div>
                      <p className="text-base text-slate-800 font-semibold mb-1">Đã chọn {files.length} tập tin</p>
                      <p className="text-sm text-[#0F766E] font-medium">
                        {Array.from(files).map(f => f.name).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-base text-slate-800 font-semibold mb-1">Click để tải lên hoặc kéo thả vào đây</p>
                      <p className="text-sm font-medium text-slate-600">Hỗ trợ các định dạng .zip, .pdf, .png, .jpg (Tối đa 50MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div className="mb-8">
                <label className="block text-base text-slate-800 font-semibold mb-2">Đường dẫn sản phẩm (Figma, GitHub, Drive...)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-600 text-[20px]">link</span>
                  </div>
                  <input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-base text-slate-800 focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] transition-all" placeholder="https://github.com/..." type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
                </div>
              </div>

              {/* Submission Notes */}
              <div className="mb-8">
                <label className="block text-base text-slate-800 font-semibold mb-2">Ghi chú gửi bài</label>
                <p className="text-sm font-medium text-slate-600 mb-3">Mô tả công việc đã hoàn thành hoặc các lưu ý đặc biệt dành cho khách hàng.</p>
                <textarea className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-base text-slate-800 focus:ring-2 focus:ring-[#0F766E] focus:border-[#0F766E] transition-all resize-none" placeholder="Ví dụ: Đã hoàn thành các yêu cầu, vui lòng kiểm tra..." rows="5" required value={submissionNotes} onChange={(e) => setSubmissionNotes(e.target.value)}></textarea>
              </div>

              <hr className="border-t border-slate-200 my-6" />

              {/* Footer Actions */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-2 text-slate-600 bg-slate-100 p-3 rounded-2xl md:max-w-md">
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">info</span>
                  <p className="text-sm font-medium">
                    Gửi sản phẩm sẽ gửi thông báo cho Nhà tuyển dụng duyệt. Khi được duyệt, ngân quỹ dự án sẽ được giải ngân vào ví của bạn.
                  </p>
                </div>
                <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-[#0F766E] text-white text-lg font-bold rounded-2xl hover:bg-[#0D5E58] transition-all duration-500 ease-out hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer">
                  {loading ? 'Đang gửi...' : 'Nộp Sản Phẩm'}
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Context/Milestone Tracker */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">Thông tin Hợp đồng</h3>
            <div className="space-y-4 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Ngân sách dự án:</span>
                <span className="font-bold text-slate-800">{contract ? parseInt(contract.total_amount).toLocaleString() : 0} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="font-bold text-[#0F766E]">{contract?.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Khách hàng:</span>
                <span className="font-bold text-slate-800">{contract?.employer_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian bắt đầu:</span>
                <span className="font-bold text-slate-800">{contract?.started_at ? new Date(contract.started_at).toLocaleDateString('vi-VN') : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
