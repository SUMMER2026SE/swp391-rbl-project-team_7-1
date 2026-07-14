import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contractService } from '../../services/contractService';

const renderDescription = (desc) => {
  if (!desc) return null;
  const marker = '[Đường dẫn sản phẩm]:';
  const index = desc.indexOf(marker);
  
  if (index !== -1) {
    const notes = desc.substring(0, index).trim();
    const link = desc.substring(index + marker.length).trim();
    return (
      <div className="space-y-4">
        <p className="whitespace-pre-line leading-relaxed">{notes}</p>
        {link && (
          <div className="mt-4 p-4 bg-teal-50/50 border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0F766E] bg-teal-100/30 p-2.5 rounded-xl">link</span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Đường dẫn sản phẩm</span>
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#0F766E] hover:text-[#0D5E58] font-bold text-sm break-all transition-colors underline decoration-2 decoration-[#0F766E]/20 hover:decoration-[#0D5E58] inline-flex items-center gap-1"
                >
                  {link}
                </a>
              </div>
            </div>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F766E] hover:bg-[#0D5E58] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all decoration-none flex-shrink-0 cursor-pointer"
            >
              Mở liên kết
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  return <p className="whitespace-pre-line leading-relaxed">{desc}</p>;
};

const renderSimpleDescription = (desc) => {
  if (!desc) return null;
  const marker = '[Đường dẫn sản phẩm]:';
  const index = desc.indexOf(marker);
  if (index !== -1) {
    const notes = desc.substring(0, index).trim();
    const link = desc.substring(index + marker.length).trim();
    return (
      <div className="space-y-1">
        <p className="text-sm text-slate-600 line-clamp-2">{notes}</p>
        {link && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px] text-[#0F766E]">link</span>
            Link: <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#0F766E] hover:underline break-all font-semibold">{link}</a>
          </p>
        )}
      </div>
    );
  }
  return <p className="text-sm text-slate-600 line-clamp-2">{desc}</p>;
};

export default function ReviewSubmission() {
  const { contractId } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal for Revision
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  // Rating & Review states
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const contractData = await contractService.getContractById(contractId);
      if (contractData.success) {
        setContract(contractData.contract);
      }
      
      const subsData = await contractService.getContractSubmissions(contractId);
      if (subsData.success) {
        setSubmissions(subsData.submissions);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Không thể tải thông tin sản phẩm và hợp đồng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractId) {
      loadData();
    }
  }, [contractId]);

  const handleApprove = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn nghiệm thu công việc này? Hành động này sẽ giải ngân toàn bộ số tiền ký quỹ trực tiếp cho Freelancer.')) {
      return;
    }
    
    const latestSub = submissions[0];
    if (!latestSub) return;

    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await contractService.approveSubmission(latestSub.submission_id);
      if (res.success) {
        setSuccessMsg('Nghiệm thu thành công và đã giải ngân thanh toán!');
        loadData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt sản phẩm.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendRevision = async (e) => {
    e.preventDefault();
    const latestSub = submissions[0];
    if (!latestSub || !revisionNote.trim()) return;

    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await contractService.requestRevision(latestSub.submission_id, revisionNote);
      if (res.success) {
        setSuccessMsg('Đã gửi yêu cầu chỉnh sửa thành công!');
        setShowRevisionModal(false);
        setRevisionNote('');
        loadData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi yêu cầu chỉnh sửa.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setReviewLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await contractService.submitReview(contractId, rating, reviewComment);
      if (res.success) {
        setSuccessMsg('Gửi đánh giá thành công!');
        loadData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow pt-24 pb-12 px-6 w-full max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Đang tải thông tin nộp bài…</p>
        </div>
      </main>
    );
  }

  const latestSubmission = submissions[0];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 pt-24">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/employer-dashboard')} className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium hover:text-[#0F766E] mb-4 bg-transparent border-none cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Quay lại Dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Nghiệm thu sản phẩm dự án
        </h1>
        <p className="text-base text-slate-600 mt-2">
          Hợp đồng: <strong className="text-slate-800">{contract?.contract_title}</strong>
        </p>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Submissions Content */}
        <div className="lg:col-span-8 space-y-6">
          {latestSubmission ? (
            <>
              {/* Submission Notes */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                  <span className="material-symbols-outlined text-[#0F766E] bg-slate-100 p-2 rounded-2xl">description</span>
                  <h2 className="text-lg font-bold text-slate-800">Thông tin bài nộp của Freelancer</h2>
                </div>
                <div className="text-base text-slate-600 space-y-4">
                  {renderDescription(latestSubmission.description)}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Gửi vào lúc: {new Date(latestSubmission.submitted_at).toLocaleString('vi-VN')}
                </p>
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    latestSubmission.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    latestSubmission.status === 'REVISION_REQUESTED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {latestSubmission.status === 'APPROVED' ? 'Đã duyệt' :
                     latestSubmission.status === 'REVISION_REQUESTED' ? 'Yêu cầu chỉnh sửa' :
                     'Đang chờ duyệt'}
                  </span>
                </div>
              </section>

              {/* Deliverables files list */}
              {latestSubmission.file_url && (
                <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#0F766E] bg-slate-100 p-2 rounded-2xl">folder_zip</span>
                      <h2 className="text-lg font-bold text-slate-800">Tập tin sản phẩm đính kèm</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {latestSubmission.file_url.split(',').map((url, index) => {
                      const fileName = url.substring(url.lastIndexOf('/') + 1);
                      return (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between hover:bg-slate-50 transition-all duration-300 decoration-none">
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
                              <span className="material-symbols-outlined text-2xl">insert_drive_file</span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-[#0F766E] transition-colors">{fileName}</h3>
                              <p className="text-xs text-slate-500">Xem / tải xuống sản phẩm</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-600 group-hover:text-[#0F766E] transition-colors">download</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">cloud_off</span>
              <p className="text-slate-600 font-semibold text-base mb-1">Freelancer chưa nộp sản phẩm nào</p>
              <p className="text-slate-500 text-sm">Hệ thống sẽ cập nhật ngay khi Freelancer gửi tài liệu bàn giao.</p>
            </div>
          )}

          {/* History of submissions if more than 1 */}
          {submissions.length > 1 && (
            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-4">Lịch sử bài nộp trước</h2>
              <div className="divide-y divide-slate-100">
                {submissions.slice(1).map((sub, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-slate-400">{new Date(sub.submitted_at).toLocaleString('vi-VN')}</span>
                      <span className="text-xs font-semibold text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded">{sub.status}</span>
                    </div>
                    {renderSimpleDescription(sub.description)}
                    {sub.revision_note && (
                      <div className="mt-2 p-2 bg-amber-50 text-xs text-amber-800 rounded border border-amber-100">
                        <strong>Yêu cầu chỉnh sửa:</strong> {sub.revision_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Decision Action panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Freelancer details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">Thực hiện bởi</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {contract?.freelancer_name ? contract.freelancer_name.split(' ').pop().charAt(0) : 'F'}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">{contract?.freelancer_name}</h4>
                <p className="text-xs font-medium text-slate-500">Freelancer chuyên nghiệp</p>
              </div>
            </div>
          </div>

          {/* Action or Review panel */}
          {contract?.status === 'COMPLETED' ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              {contract.review_rating ? (
                // Already reviewed
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 fill-amber-500">star</span>
                    Đánh giá của bạn
                  </h3>
                  <p className="text-sm font-medium text-slate-600 mb-4">Bạn đã đánh giá sản phẩm và thái độ làm việc của Freelancer này.</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`material-symbols-outlined text-xl ${
                            star <= contract.review_rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-sm font-bold text-slate-700 ml-2">{contract.review_rating} / 5</span>
                    </div>
                    {contract.review_comment && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 italic whitespace-pre-wrap">
                        "{contract.review_comment}"
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Not reviewed yet
                <form onSubmit={handleSendReview}>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Đánh giá Freelancer</h3>
                  <p className="text-sm font-medium text-slate-600 mb-4">Hợp đồng đã hoàn thành! Hãy dành ít phút để đánh giá chất lượng sản phẩm & dịch vụ của Freelancer.</p>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Điểm đánh giá</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="bg-transparent border-none p-0.5 cursor-pointer focus:outline-none"
                        >
                          <span 
                            className={`material-symbols-outlined text-2xl transition-all ${
                              star <= rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-300 hover:text-amber-300'
                            }`}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Lời nhận xét</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Mô tả chi tiết trải nghiệm hợp tác của bạn..."
                      rows="4"
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-[#0F766E] text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#0F766E]"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Quyết định nghiệm thu</h3>
              <p className="text-sm font-medium text-slate-600 mb-6">Nghiệm thu bài nộp để xác nhận hoàn thành công việc và giải ngân tiền ký quỹ.</p>
              <div className="space-y-3">
                <button 
                  onClick={handleApprove} 
                  disabled={actionLoading || !latestSubmission || latestSubmission.status === 'APPROVED'}
                  className="w-full bg-[#0F766E] text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Xác nhận hoàn thành
                </button>
                
                <button 
                  onClick={() => setShowRevisionModal(true)} 
                  disabled={actionLoading || !latestSubmission || latestSubmission.status === 'APPROVED'}
                  className="w-full bg-white text-slate-800 text-sm font-bold py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined">edit_note</span>
                  Yêu cầu chỉnh sửa
                </button>
              </div>

              {/* Escrow badge info */}
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0F766E] mt-0.5">gpp_good</span>
                <div className="text-xs font-medium">
                  <strong className="text-slate-800 block mb-1">Bảo vệ bởi VNPay Escrow</strong>
                  <span className="text-slate-600">
                    Số tiền ký quỹ <span className="text-[#0F766E] font-bold">{contract ? parseInt(contract.total_amount).toLocaleString() : 0} VNĐ</span> đang được tạm giữ an toàn.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Yêu cầu chỉnh sửa</h3>
              <button onClick={() => setShowRevisionModal(false)} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSendRevision}>
              <div className="p-6">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Nội dung yêu cầu chỉnh sửa</label>
                <textarea 
                  value={revisionNote} 
                  onChange={e => setRevisionNote(e.target.value)} 
                  placeholder="Mô tả chi tiết những phần cần sửa đổi, bổ sung..." 
                  rows="5"
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all resize-none"
                />
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button type="button" onClick={() => setShowRevisionModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                  Hủy
                </button>
                <button type="submit" disabled={actionLoading || !revisionNote.trim()} className="flex-1 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0D5E58] transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer border-none">
                  {actionLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
