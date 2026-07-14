import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { proposalService } from '../../services/proposalService';

export default function EditProposal() {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [proposal, setProposal] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [currentAttachmentName, setCurrentAttachmentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        if (proposalId) {
          const data = await proposalService.getProposalById(proposalId);
          if (data.success && data.proposal) {
            const prop = data.proposal;
            setProposal(prop);
            setBidAmount(Math.round(prop.proposed_price).toString());
            
            // Map delivery days back to the select option
            const days = prop.delivery_time_days;
            if (days <= 3) setDuration("Dưới 3 ngày");
            else if (days <= 7) setDuration("3 đến 7 ngày");
            else if (days <= 14) setDuration("1 đến 2 tuần");
            else if (days <= 28) setDuration("2 đến 4 tuần");
            else if (days <= 90) setDuration("1 đến 3 tháng");
            else setDuration("Hơn 3 tháng");

            // Extract original cover letter content before the attachment delimiter if present
            const originalLetter = prop.cover_letter || '';
            const delimiterIndex = originalLetter.indexOf('\n\n----------------------------------------\n[Tệp đính kèm]:');
            if (delimiterIndex !== -1) {
              setCoverLetter(originalLetter.substring(0, delimiterIndex));
              // Extract file name or URL if possible
              const fileUrl = originalLetter.substring(delimiterIndex).split('[Tệp đính kèm]: ')[1];
              if (fileUrl) {
                const parts = fileUrl.split('/');
                setCurrentAttachmentName(parts[parts.length - 1]);
              }
            } else {
              setCoverLetter(originalLetter);
            }
          } else {
            setErrorMsg('Không thể tải thông tin đề xuất.');
          }
        }
      } catch (err) {
        console.error("Failed to load proposal details", err);
        setErrorMsg('Lỗi khi tải thông tin đề xuất từ máy chủ.');
      } finally {
        setFetching(false);
      }
    };
    fetchProposalDetails();
  }, [proposalId]);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Kích thước file không được vượt quá 10MB.');
        return;
      }
      setAttachment(file);
      setCurrentAttachmentName('');
      setErrorMsg('');
    }
  };

  const platformFee = bidAmount ? (parseInt(bidAmount) * 0.05) : 0;
  const estimatedReceive = bidAmount ? (parseInt(bidAmount) - platformFee) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      let days = 30;
      if (duration === "Dưới 3 ngày") days = 3;
      else if (duration === "3 đến 7 ngày") days = 7;
      else if (duration === "1 đến 2 tuần") days = 14;
      else if (duration === "2 đến 4 tuần") days = 28;
      else if (duration === "1 đến 3 tháng") days = 90;
      else if (duration === "Hơn 3 tháng") days = 180;

      const formData = new FormData();
      formData.append('proposedPrice', bidAmount);
      formData.append('deliveryTimeDays', days);
      formData.append('coverLetter', coverLetter);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await proposalService.updateProposal(proposalId, formData);
      navigate('/freelancer-dashboard', { state: { message: 'Đề xuất đã được cập nhật thành công!' } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật đề xuất.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="flex-1 min-h-screen pb-20 bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-semibold text-sm">Đang tải thông tin đề xuất...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-screen pb-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Inline animations and custom blob floating */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatBlob1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes floatBlob3 {
          0% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(25px, 25px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(0.95); }
        }
        .animate-blob-1 { animation: floatBlob1 16s infinite ease-in-out; }
        .animate-blob-2 { animation: floatBlob2 20s infinite ease-in-out; }
        .animate-blob-3 { animation: floatBlob3 14s infinite ease-in-out; }
      `}} />

      {/* Light Header with Premium Blended Gradient & Subtle Dot Grid Pattern */}
      <div className="pt-12 pb-14 px-6 md:px-12 bg-gradient-to-br from-[#F0F9F8] via-[#F3F8FC] to-[#F5FCF8] border-b border-slate-100/60 shadow-sm relative overflow-hidden">
        {/* Modern Dot Grid Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        {/* Soft Blended Pastel Aurora Blobs */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-teal-200/10 to-emerald-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-1"></div>
        <div className="absolute bottom-[-40%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-sky-200/10 to-cyan-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-2"></div>
        <div className="absolute top-[0%] left-[40%] w-[380px] h-[380px] bg-gradient-to-r from-emerald-200/8 to-teal-200/8 rounded-full blur-[90px] pointer-events-none animate-blob-3"></div>

        <div className="max-w-7xl mx-auto text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#0F766E] border border-slate-200/60 shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Chỉnh sửa đề xuất</span>
          </div>

          <h1 className="text-4xl md:text-5.5xl font-black tracking-tight mb-3 leading-none pb-1 bg-gradient-to-r from-slate-900 via-[#0F766E] to-slate-800 bg-clip-text text-transparent">
            Chỉnh sửa Đề xuất ứng tuyển
          </h1>
          <p className="text-slate-500 font-semibold text-sm md:text-base max-w-2xl leading-relaxed">
            Dự án: <strong className="text-slate-800">{proposal?.project_title}</strong>. Bạn có thể thay đổi giá thầu, thời gian hoặc cập nhật thư giới thiệu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 relative z-20">
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Terms & Basics Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.015)]">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Điều khoản & Thời gian
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Giá đề xuất mới (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">VNĐ</span>
                    <input 
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-14 pr-4 text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all text-base font-medium" 
                      placeholder="Ví dụ: 15.000.000" 
                      type="text"
                      required
                      value={bidAmount ? bidAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                      onChange={(e) => {
                        const rawVal = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                        setBidAmount(rawVal);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Thời gian ước tính</label>
                  <select 
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all text-base cursor-pointer"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  >
                    <option disabled value="">Chọn thời gian...</option>
                    <option value="Dưới 3 ngày">Dưới 3 ngày</option>
                    <option value="3 đến 7 ngày">3 đến 7 ngày</option>
                    <option value="1 đến 2 tuần">1 đến 2 tuần</option>
                    <option value="2 đến 4 tuần">2 đến 4 tuần</option>
                    <option value="1 đến 3 tháng">1 đến 3 tháng</option>
                    <option value="Hơn 3 tháng">Hơn 3 tháng</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Cover Letter Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.015)]">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">description</span> Thư giới thiệu (Cover Letter)
              </h2>
              <p className="text-sm font-medium text-slate-400 mb-6">Giới thiệu bản thân và giải thích lý do tại sao bạn là ứng cử viên sáng giá cho công việc này.</p>
              <textarea 
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 px-4 text-slate-800 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all text-base resize-y" 
                placeholder="Chào bạn, tôi vừa hoàn thành một dự án tương tự..." 
                rows="8"
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>
            
            {/* Attachments */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.015)]">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">attach_file</span> Tài liệu đính kèm
              </h2>
              <p className="text-sm font-medium text-slate-400 mb-6">Tải lên file đính kèm mới để thay thế cho file cũ nếu cần thiết.</p>
              
              <div 
                onClick={handleFileClick}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-teal-300 transition-all cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="hidden" 
                />
                
                {attachment ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-[#0F766E]">insert_drive_file</span>
                    <p className="text-base font-semibold text-slate-800">{attachment.name}</p>
                    <p className="text-xs text-slate-500">{(attachment.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachment(null);
                      }} 
                      className="mt-3 text-xs text-red-500 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Xóa file
                    </button>
                  </div>
                ) : currentAttachmentName ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[32px] text-[#0F766E]">insert_drive_file</span>
                    <p className="text-base font-semibold text-slate-800">Tệp đã nộp: {currentAttachmentName}</p>
                    <p className="text-xs text-slate-500">Nhấp để tải lên tệp mới thay thế</p>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-slate-400 mb-2">cloud_upload</span>
                    <p className="text-base text-slate-800 mb-1">Click để chọn file hoặc kéo thả vào đây</p>
                    <p className="text-sm font-medium text-slate-500">PDF, JPG, PNG tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_15px_40px_rgba(15,23,42,0.02)] overflow-hidden">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base">Tổng quan Đề xuất</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Giá đề xuất của bạn</span>
                    <span className="font-bold text-slate-800">{bidAmount ? parseInt(bidAmount).toLocaleString() : 0} đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Phí nền tảng (5%)</span>
                    <span className="font-bold text-slate-800">- {platformFee.toLocaleString()} đ</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold">Thực nhận ước tính</span>
                    <span className="font-bold text-lg text-[#0F766E]">{estimatedReceive.toLocaleString()} đ</span>
                  </div>
                  
                  <div className="pt-6 mt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#0F766E] text-white text-base font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all duration-300 active:scale-[0.98] border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu Thay đổi'} <span className="material-symbols-outlined text-[20px]">save</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => navigate('/freelancer-dashboard')}
                      className="w-full mt-3 bg-white border border-slate-200 text-slate-500 text-sm font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-[#0F766E] text-[20px]">gpp_good</span>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Được bảo mật an toàn qua tài khoản Escrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
