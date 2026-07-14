import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';
import VisualEscrowTimeline from '../../components/Project/VisualEscrowTimeline';

export default function SubmitWork() {
  const { contractId } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [fetchingContract, setFetchingContract] = useState(true);
  const [externalLink, setExternalLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchingContract(true);
        const [contractRes, subsRes] = await Promise.all([
          contractService.getContractById(contractId),
          contractService.getContractSubmissions(contractId)
        ]);
        if (contractRes.success) setContract(contractRes.contract);
        if (subsRes.success) setSubmissions(subsRes.submissions || []);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin hợp đồng.');
      } finally {
        setFetchingContract(false);
      }
    };
    if (contractId) loadData();
  }, [contractId]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return { icon: 'picture_as_pdf', color: 'text-rose-500', bg: 'bg-rose-50' };
    if (['zip', 'rar', '7z'].includes(ext)) return { icon: 'folder_zip', color: 'text-amber-500', bg: 'bg-amber-50' };
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return { icon: 'image', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (['doc', 'docx'].includes(ext)) return { icon: 'description', color: 'text-blue-700', bg: 'bg-blue-50' };
    if (['xls', 'xlsx'].includes(ext)) return { icon: 'table_chart', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return { icon: 'insert_drive_file', color: 'text-slate-500', bg: 'bg-slate-100' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionNotes.trim()) {
      setErrorMsg('Vui lòng nhập ghi chú mô tả công việc đã hoàn thành.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      formData.append('externalLink', externalLink);
      formData.append('notes', submissionNotes);

      await contractService.submitWork(contractId, formData);
      setSuccessMsg('Nộp sản phẩm thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/freelancer-dashboard', { state: { message: 'Công việc đã được nộp thành công!' } }), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi nộp công việc.');
    } finally {
      setLoading(false);
    }
  };

  const latestSubmission = submissions[0];
  const canSubmit = !latestSubmission || latestSubmission.status === 'REVISION_REQUESTED';

  if (fetchingContract) {
    return (
      <main className="flex-grow pt-24 pb-12 px-6 w-full max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Đang tải thông tin hợp đồng…</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.3s ease forwards; }
        @keyframes fileIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .file-in { animation: fileIn 0.2s ease forwards; }
      `}</style>

      <main className="flex-grow pb-16 bg-[#F8FAFC]">
        {/* Contextual Top Header */}
        <div className="bg-white border-b border-slate-100 pt-8 pb-6 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/3 to-transparent pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0F766E] transition-colors mb-4 bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Quay lại
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse"></div>
                  <span className="text-xs font-black text-[#0F766E] uppercase tracking-wider">Nộp Sản Phẩm</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                  {contract?.contract_title || 'Bàn giao Công việc'}
                </h1>
                {contract?.project_title && (
                  <p className="text-slate-500 text-sm font-semibold mt-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0F766E]">folder_open</span>
                    Dự án: <span className="text-slate-700">{contract.project_title}</span>
                  </p>
                )}
              </div>

              {/* Status badge */}
              {latestSubmission && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold flex-shrink-0 ${
                  latestSubmission.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  latestSubmission.status === 'REVISION_REQUESTED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {latestSubmission.status === 'APPROVED' ? 'check_circle' :
                     latestSubmission.status === 'REVISION_REQUESTED' ? 'pending' : 'hourglass_top'}
                  </span>
                  {latestSubmission.status === 'APPROVED' ? 'Đã được duyệt' :
                   latestSubmission.status === 'REVISION_REQUESTED' ? 'Yêu cầu chỉnh sửa' : 'Đang chờ duyệt'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8">
          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-sm flex items-start gap-3 font-semibold slide-in">
              <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-sm flex items-center gap-3 font-semibold slide-in">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Revision request notice */}
          {latestSubmission?.status === 'REVISION_REQUESTED' && (
            <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl slide-in">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-[22px] flex-shrink-0">edit_note</span>
                <div>
                  <p className="font-bold text-amber-800 mb-1">Nhà tuyển dụng yêu cầu chỉnh sửa</p>
                  <p className="text-sm text-amber-700 font-medium whitespace-pre-line">
                    {latestSubmission.revision_note || 'Vui lòng xem lại và nộp lại sản phẩm đã chỉnh sửa.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Escrow Timeline */}
          <VisualEscrowTimeline contract={contract} hasSubmissions={submissions.length > 0} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-8 space-y-6">

              {latestSubmission?.status === 'APPROVED' ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.02)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500"></div>
                  
                  <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                    {/* Premium Pulse Circle */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full bg-emerald-100/60 blur-md scale-125 animate-pulse"></div>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg relative z-10 text-white">
                        <span className="material-symbols-outlined text-4xl animate-[bounce_2s_infinite]">paid</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Nghiệm thu thành công!</h2>
                    <p className="text-slate-500 font-semibold text-sm mb-8 leading-relaxed">
                      Nhà tuyển dụng đã xác nhận hoàn thành công việc của bạn. Hệ thống đang thực hiện lệnh giải ngân nguồn vốn ký quỹ.
                    </p>

                    {/* Escrow Status Timeline Grid */}
                    <div className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-5 mb-8 text-left space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                        <span className="material-symbols-outlined text-[16px] text-teal-600">shield_with_heart</span>
                        Tiến độ giải ngân VNPay Escrow
                      </h4>

                      {/* Step 1 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                          <div className="w-0.5 h-6 bg-emerald-300"></div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-700">Bước 1: Nhà tuyển dụng phê duyệt</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Xác nhận sản phẩm đạt yêu cầu &amp; đồng ý tất toán</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">2</div>
                          <div className="w-0.5 h-6 bg-slate-200"></div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-teal-700 flex items-center gap-1">
                            Bước 2: Hệ thống đang xử lý lệnh chuyển tiền
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Yêu cầu rút tiền ký quỹ VNPay đang được chuyển tiếp vào Ví Freelancer</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400">Bước 3: Nhận tiền về ví</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Số tiền <span className="text-teal-700 font-bold">{contract ? parseInt(contract.total_amount || 0).toLocaleString('vi-VN') : 0} đ</span> khả dụng rút về tài khoản ngân hàng</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                      <button
                        onClick={() => navigate('/freelancer-wallet')}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-teal-600/10 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        Kiểm tra số dư Ví
                      </button>
                      <button
                        onClick={() => navigate('/freelancer-dashboard')}
                        className="px-6 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        Về Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Submit Form */
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* File Upload */}
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0F766E]"></div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0F766E] bg-[#0F766E]/5 p-2 rounded-2xl">cloud_upload</span>
                        Tài liệu &amp; Tập tin sản phẩm
                      </h2>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">Max 50MB/file</span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mb-6">Đính kèm mã nguồn (.zip, .rar), tài liệu hướng dẫn (.pdf, .doc), hoặc hình ảnh thiết kế (.png, .jpg) bàn giao cho khách hàng.</p>

                    {/* Drop Zone */}
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 select-none cursor-pointer ${
                        dragOver
                          ? 'border-[#0F766E] bg-[#0F766E]/5 scale-[1.01] shadow-[0_8px_30px_rgba(15,118,110,0.08)]'
                          : 'border-slate-200 bg-slate-50/30 hover:border-[#0F766E]/50 hover:bg-[#0F766E]/3'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${dragOver ? 'bg-[#0F766E]/15 scale-110 rotate-6 text-[#0F766E]' : 'bg-slate-100 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-[32px]">
                          {dragOver ? 'upload_file' : 'add_to_photos'}
                        </span>
                      </div>
                      <p className="text-sm font-black text-slate-700 mb-1">
                        {dragOver ? 'Thả các tập tin của bạn tại đây' : 'Kéo thả tập tin hoặc nhấn để chọn'}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">Hỗ trợ tải lên nhiều định dạng tệp tin cùng lúc</p>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-teal-600">attachment</span>
                          Danh sách tài liệu đã chọn ({files.length})
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {files.map((file, idx) => {
                            const { icon, color, bg } = getFileIcon(file.name);
                            return (
                              <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl group hover:border-[#0F766E]/30 hover:shadow-sm transition-all duration-200 file-in relative overflow-hidden">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                    <span className={`material-symbols-outlined text-[22px] ${color}`}>{icon}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate pr-4">{file.name}</p>
                                    <p className="text-xs text-slate-400 font-semibold">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all border-none cursor-pointer flex-shrink-0 shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* External Link */}
                  <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
                    <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0F766E]">link</span>
                      Đường dẫn sản phẩm
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mb-5">GitHub, Figma, Google Drive, Behance… — không bắt buộc nếu đã tải file trực tiếp</p>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">open_in_new</span>
                      </span>
                      <input
                        type="url"
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                        placeholder="https://github.com/your-repo hoặc https://figma.com/..."
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-3xl border border-slate-100/80 p-6 md:p-8 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
                    <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0F766E]">notes</span>
                      Ghi chú bàn giao <span className="text-rose-500 text-base">*</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mb-5">Mô tả chi tiết công việc đã hoàn thành, các điểm nổi bật, lưu ý cho nhà tuyển dụng khi kiểm tra.</p>
                    <textarea
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="Ví dụ: Đã hoàn thành toàn bộ thiết kế UI theo yêu cầu. File Figma đã bao gồm các màn hình: Homepage, Product, Cart, Checkout. Đã export PNG và SVG đầy đủ. Vui lòng phản hồi nếu cần điều chỉnh..."
                      rows="6"
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 transition-all resize-none leading-relaxed"
                    />
                    <p className="text-xs text-slate-400 mt-2 font-medium text-right">
                      {submissionNotes.length} ký tự
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
                    <div className="flex items-start gap-3 text-slate-500 max-w-sm">
                      <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#0F766E]">shield</span>
                      <p className="text-xs font-semibold leading-relaxed">
                        Khi nộp, nhà tuyển dụng sẽ nhận thông báo để xem xét. Tiền ký quỹ sẽ được giải ngân sau khi được nghiệm thu.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !canSubmit}
                      className="w-full sm:w-auto flex-shrink-0 px-8 py-3.5 bg-[#0F766E] text-white text-sm font-black rounded-2xl hover:bg-[#0D5E58] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(15,118,110,0.18)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          {latestSubmission?.status === 'REVISION_REQUESTED' ? 'Nộp lại Sản phẩm' : 'Nộp Sản phẩm'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">

              {/* Contract Info */}
              <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_15px_45px_rgba(15,23,42,0.015)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F766E] rounded-t-3xl"></div>

                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-5">Thông tin Hợp đồng</h3>

                {/* Employer */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F766E] to-teal-400 text-white flex items-center justify-center font-black text-base shadow-sm flex-shrink-0">
                    {contract?.employer_name ? contract.employer_name.split(' ').pop()[0] : 'E'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{contract?.employer_name || 'Nhà tuyển dụng'}</p>
                    <p className="text-xs text-slate-400 font-semibold">Nhà tuyển dụng</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">payments</span>
                      <span className="text-xs font-semibold text-slate-500">Giá trị hợp đồng</span>
                    </div>
                    <span className="font-black text-sm text-[#0F766E]">
                      {contract ? parseInt(contract.total_amount || 0).toLocaleString('vi-VN') : 0} đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">circle</span>
                      <span className="text-xs font-semibold text-slate-500">Trạng thái HĐ</span>
                    </div>
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                      contract?.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : contract?.latest_submission_status === 'SUBMITTED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : contract?.latest_submission_status === 'REVISION_REQUESTED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {contract?.status === 'COMPLETED' 
                        ? 'Hoàn thành' 
                        : contract?.latest_submission_status === 'SUBMITTED'
                          ? 'Chờ duyệt sản phẩm'
                          : contract?.latest_submission_status === 'REVISION_REQUESTED'
                            ? 'Yêu cầu chỉnh sửa'
                            : 'Đang thực hiện'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                      <span className="text-xs font-semibold text-slate-500">Bắt đầu</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {contract?.started_at ? new Date(contract.started_at).toLocaleDateString('vi-VN') : '—'}
                    </span>
                  </div>
                  {contract?.project_deadline && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-500 text-[18px]">event_busy</span>
                        <span className="text-xs font-semibold text-slate-500">Hạn chót</span>
                      </div>
                      <span className="text-xs font-bold text-rose-600">
                        {new Date(contract.project_deadline).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Escrow security badge */}
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#0F766E] text-[20px] flex-shrink-0">gpp_good</span>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Bảo vệ bởi VNPay Escrow</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="text-[#0F766E] font-black">{contract ? parseInt(contract.total_amount || 0).toLocaleString('vi-VN') : 0} đ</span> đang được tạm giữ an toàn
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission History */}
              {submissions.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-[0_15px_45px_rgba(15,23,42,0.015)]">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Lịch sử nộp bài</h3>
                  <div className="space-y-0">
                    {submissions.map((sub, i) => (
                      <div key={i} className="flex gap-3">
                        {/* Icon + connector line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            sub.status === 'APPROVED' ? 'bg-emerald-100' :
                            sub.status === 'REVISION_REQUESTED' ? 'bg-amber-100' :
                            'bg-blue-100'
                          }`}>
                            <span className={`material-symbols-outlined text-[16px] ${
                              sub.status === 'APPROVED' ? 'text-emerald-600' :
                              sub.status === 'REVISION_REQUESTED' ? 'text-amber-600' :
                              'text-blue-600'
                            }`}>
                              {sub.status === 'APPROVED' ? 'check_circle' :
                               sub.status === 'REVISION_REQUESTED' ? 'pending' :
                               'hourglass_top'}
                            </span>
                          </div>
                          {/* Vertical connector — only between items, not after the last */}
                          {i < submissions.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-100 my-1" style={{ minHeight: '16px' }}></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 ${i < submissions.length - 1 ? 'pb-4' : 'pb-1'}`}>
                          <p className={`text-xs font-bold ${
                            sub.status === 'APPROVED' ? 'text-emerald-700' :
                            sub.status === 'REVISION_REQUESTED' ? 'text-amber-700' :
                            'text-blue-700'
                          }`}>
                            {sub.status === 'APPROVED' ? 'Đã được duyệt' :
                             sub.status === 'REVISION_REQUESTED' ? 'Yêu cầu chỉnh sửa' :
                             'Đang chờ duyệt'}
                            {i === 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black">Mới nhất</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                          </p>
                          {sub.revision_note && (
                            <div className="mt-2 p-2.5 bg-amber-50 text-xs text-amber-800 rounded-xl border border-amber-100 font-medium">
                              <strong className="block mb-0.5">Ghi chú chỉnh sửa:</strong>
                              {sub.revision_note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-[#0F766E]/5 to-teal-50/50 rounded-3xl border border-[#0F766E]/10 p-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0F766E] mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
                  Mẹo bàn giao hiệu quả
                </h3>
                <ul className="space-y-2.5">
                  {[
                    'Đính kèm tất cả file sản phẩm và tài liệu liên quan',
                    'Mô tả rõ những gì đã làm và các lưu ý khi sử dụng',
                    'Cung cấp link repository hoặc môi trường xem thực tế',
                    'Đảm bảo tất cả yêu cầu trong hợp đồng đã được đáp ứng'
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] flex-shrink-0 mt-1.5"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
