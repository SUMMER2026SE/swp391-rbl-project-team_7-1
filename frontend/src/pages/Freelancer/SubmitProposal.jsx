import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { proposalService } from '../../services/proposalService';

export default function SubmitProposal() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [project, setProject] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [milestones, setMilestones] = useState([{ name: 'Thiết kế Wireframe', amount: '5000000' }]);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          const data = await projectService.getProjectById(projectId);
          const proj = data.project || data;
          setProject(proj);
          if (proj && proj.budget_max) {
            setBidAmount(proj.budget_max.toString());
          }
        }
      } catch (err) {
        console.error("Failed to load project details", err);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { name: '', amount: '' }]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleRemoveMilestone = (index) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

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

      await proposalService.submitProposal(projectId, formData);
      navigate('/freelancer-dashboard', { state: { message: 'Đề xuất đã được gửi thành công!' } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi nộp đề xuất.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop overflow-y-auto bg-slate-50">
      <div className="max-w-container-max mx-auto py-10 px-6">
        {/*  Header  */}
        <div className="mb-10">
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">Nộp Đề Xuất</h1>
          <p className="text-base text-slate-600 max-w-2xl">
            Bạn đang nộp đề xuất cho dự án <strong className="text-on-surface text-slate-800">{project ? project.title : 'Đang tải...'}</strong>. Hãy dành thời gian viết một đề xuất hấp dẫn.
          </p>
          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/*  Left Form Canvas (8 cols)  */}
          <div className="md:col-span-8 flex flex-col gap-8">
            {/*  Terms & Basics Card  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Điều khoản & Thời gian
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Giá đề xuất (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">VNĐ</span>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-14 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base font-medium" 
                      id="bid-input" 
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
                  <p className="text-sm font-medium text-[#0F766E] mt-2 text-right">
                    Ngân sách dự kiến: {project?.budget_max?.toLocaleString()} VNĐ
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Thời gian ước tính</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer"
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
            
            {/*  Cover Letter Card  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">description</span> Thư giới thiệu (Cover Letter)
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">Giới thiệu bản thân và giải thích lý do tại sao bạn là ứng cử viên sáng giá cho công việc này.</p>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base resize-y" 
                placeholder="Chào bạn, tôi vừa hoàn thành một dự án tương tự..." 
                rows="8"
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>
            
            {/* Attachments & Portfolio */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">attach_file</span> Tài liệu đính kèm
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">Đính kèm các dự án tương tự hoặc portfolio của bạn để tăng khả năng được nhận.</p>
              
              <div 
                onClick={handleFileClick}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-[#0F766E] transition-all cursor-pointer"
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
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-slate-600 mb-2">cloud_upload</span>
                    <p className="text-base text-slate-800 mb-1">Click để chọn file hoặc kéo thả vào đây</p>
                    <p className="text-sm font-medium text-slate-600">PDF, JPG, PNG tối đa 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/*  Right Summary Sidebar (4 cols)  */}
          <div className="md:col-span-4 relative">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 text-base">Tổng quan Đề xuất</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Giá đề xuất của bạn</span>
                    <span className="font-bold text-slate-800">{bidAmount ? parseInt(bidAmount).toLocaleString() : 0} đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Phí nền tảng (5%)</span>
                    <span className="font-bold text-slate-800">- {platformFee.toLocaleString()} đ</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2"></div>
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
                      {loading ? 'Đang gửi...' : 'Gửi Đề xuất'} <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => navigate(-1)}
                      className="w-full mt-3 bg-white border border-slate-200 text-slate-600 text-sm font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-[#0F766E] text-[20px]">gpp_good</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Bạn được bảo vệ bởi <strong className="text-slate-800">VNPay Escrow</strong>. Tiền sẽ được khách hàng nạp trước khi dự án bắt đầu.
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
