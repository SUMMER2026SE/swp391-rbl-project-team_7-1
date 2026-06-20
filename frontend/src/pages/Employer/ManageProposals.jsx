import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { proposalService } from '../../services/proposalService';

export default function ManageProposals() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [projectTitle, setProjectTitle] = useState('Đang tải...');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'SHORTLISTED', 'SUBMITTED'
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST', 'PRICE_ASC', 'RATING_DESC'
  const [expandedProposals, setExpandedProposals] = useState({});

  const toggleExpandProposal = (id) => {
    setExpandedProposals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const parseProposalCoverLetter = (text) => {
    if (!text) return { coverLetter: '', attachmentUrl: null };
    const marker = '[Tệp đính kèm]:';
    const index = text.indexOf(marker);
    if (index !== -1) {
      let coverLetter = text.substring(0, index);
      coverLetter = coverLetter.replace(/-{10,}\s*$/, '').trim();
      const attachmentUrl = text.substring(index + marker.length).trim();
      return { coverLetter, attachmentUrl };
    }
    return { coverLetter: text, attachmentUrl: null };
  };

  const fetchProposals = async () => {
    try {
      const data = await proposalService.getProjectProposals(projectId);
      if (data.success) {
        setProposals(data.proposals || []);
        setProjectTitle(data.projectTitle || 'Chi tiết dự án');
      } else {
        setErrorMsg('Không thể tải danh sách đề xuất.');
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
      setErrorMsg(err.response?.data?.message || 'Lỗi server khi lấy danh sách đề xuất.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProposals();
    }
  }, [projectId]);

  const handleStatusChange = async (proposalId, newStatus) => {
    try {
      const data = await proposalService.updateProposalStatus(proposalId, newStatus);
      if (data.success) {
        fetchProposals(); // Reload list
      } else {
        alert(data.message || 'Lỗi khi cập nhật đề xuất.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Lỗi mạng khi cập nhật trạng thái đề xuất.');
    }
  };

  const handleHire = async (proposalId, proposedPrice) => {
    if (!window.confirm(`Bạn có đồng ý chấp nhận đề xuất này với chi phí ${proposedPrice.toLocaleString('vi-VN')} đ và chuyển tới trang ký quỹ?`)) {
      return;
    }
    try {
      // 1. Accept proposal
      const data = await proposalService.updateProposalStatus(proposalId, 'ACCEPTED');
      if (data.success) {
        // 2. Redirect to escrow deposit page with amount prefilled
        navigate(`/project/${projectId}/fund?amount=${proposedPrice}`);
      } else {
        alert(data.message || 'Lỗi khi duyệt đề xuất.');
      }
    } catch (err) {
      console.error('Error hiring:', err);
      alert(err.response?.data?.message || 'Lỗi hệ thống khi duyệt đề xuất.');
    }
  };

  // Filter & Sort Logic
  const filteredProposals = proposals.filter(p => {
    if (filterStatus === 'SHORTLISTED') return p.status === 'SHORTLISTED';
    if (filterStatus === 'SUBMITTED') return p.status === 'SUBMITTED';
    return true; // ALL
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (sortBy === 'PRICE_ASC') return a.proposed_price - b.proposed_price;
    if (sortBy === 'RATING_DESC') return (b.rating_average || 0) - (a.rating_average || 0);
    return new Date(b.created_at || b.proposal_id) - new Date(a.created_at || a.proposal_id);
  });

  return (
    <main className="flex-1 min-h-screen pb-20 bg-[#F8FAFC]">
      {/* Simple Clean Header */}
      <div className="pt-8 pb-6 px-6 md:px-12 bg-white border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto text-left">
          <Link className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#0F766E] transition-colors mb-3" to="/my-projects">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Quay lại Dự án của tôi
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Quản lý Đề xuất
          </h1>
          <p className="text-slate-500 font-semibold text-xs mt-1">
            Dự án: <span className="text-[#0F766E] font-bold">{projectTitle}</span>
          </p>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filter Toolbar Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.015)] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Hồ sơ ứng viên</h2>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">Chọn lọc và sắp xếp danh sách các hồ sơ phù hợp.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all cursor-pointer"
              >
                <option value="ALL">Tất cả đề xuất ({proposals.length})</option>
                <option value="SHORTLISTED">Được chọn ({proposals.filter(p => p.status === 'SHORTLISTED').length})</option>
                <option value="SUBMITTED">Chờ duyệt ({proposals.filter(p => p.status === 'SUBMITTED').length})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-50 focus:border-teal-300 transition-all cursor-pointer"
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="PRICE_ASC">Giá thấp nhất</option>
                <option value="RATING_DESC">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6 mb-12">
          {loading ? (
            <div className="text-center py-24 text-slate-500 font-bold flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.02)]">
              <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Đang tải danh sách đề xuất...</span>
            </div>
          ) : sortedProposals.length === 0 ? (
            <div className="text-center py-20 text-slate-400 flex flex-col items-center justify-center px-6 bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.02)]">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <span className="material-symbols-outlined text-[36px]">find_in_page</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy đề xuất</h3>
              <p className="text-sm text-slate-500 max-w-sm">Chưa có đề xuất nào khớp với bộ lọc của bạn.</p>
            </div>
          ) : (
            sortedProposals.map((proposal) => {
              const { coverLetter: parsedLetter, attachmentUrl } = parseProposalCoverLetter(proposal.cover_letter);
              const isExpanded = expandedProposals[proposal.proposal_id];
              const shouldTruncate = parsedLetter.length > 180;
              const displayedText = (shouldTruncate && !isExpanded) 
                ? `${parsedLetter.substring(0, 180)}...` 
                : parsedLetter;

              return (
                <article 
                  key={proposal.proposal_id}
                  className={`bg-white border rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.015)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col md:flex-row gap-6 md:gap-8 ${
                    proposal.status === 'REJECTED' ? 'opacity-65 border-slate-200 bg-slate-50/30' : 'border-slate-100'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  {proposal.status === 'SHORTLISTED' && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0F766E]"></div>
                  )}
                  {proposal.status === 'ACCEPTED' && proposal.contract_id && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  )}
                  {proposal.status === 'ACCEPTED' && !proposal.contract_id && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                  )}
                  {proposal.status === 'REJECTED' && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-400"></div>
                  )}

                  {/* Left: Freelancer Details */}
                  <div className="flex-shrink-0 w-full md:w-60 flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <Link to={`/profile/${proposal.freelancer_id}`}>
                        <img 
                          alt="Freelancer Avatar" 
                          className="w-14 h-14 rounded-full border border-slate-100 object-cover cursor-pointer hover:opacity-90 transition-all" 
                          src={proposal.freelancer_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5hfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g"}
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${proposal.freelancer_id}`} className="hover:text-[#0F766E] transition-colors">
                          <h3 className="text-base font-bold text-slate-800 leading-tight">{proposal.freelancer_name}</h3>
                        </Link>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">Freelancer chuyên nghiệp</p>
                        
                        <div className="flex items-center gap-1 mt-1 bg-amber-50/60 border border-amber-100 px-2 py-0.5 rounded-lg w-max">
                          <span className="material-symbols-outlined text-amber-500 text-[14px] font-variation-settings-'FILL'-1">star</span>
                          <span className="text-xs font-bold text-amber-700">{proposal.rating_average ? proposal.rating_average.toFixed(1) : '0.0'}</span>
                          <span className="text-[10px] font-bold text-slate-400">({proposal.total_reviews || 0} dự án)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Cover Letter & Budget */}
                  <div className="flex-grow flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {proposal.status === 'SHORTLISTED' && (
                          <>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-slate-200 text-slate-500">Chờ duyệt</span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-teal-100 text-[#0F766E]">Ưu tiên</span>
                          </>
                        )}
                        {proposal.status === 'ACCEPTED' && proposal.contract_id && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-emerald-100 text-emerald-700">Đã thuê</span>
                        )}
                        {proposal.status === 'ACCEPTED' && !proposal.contract_id && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-amber-200 text-amber-700">Chờ ký quỹ</span>
                        )}
                        {proposal.status === 'SUBMITTED' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-slate-200 text-slate-500">Chờ duyệt</span>
                        )}
                        {proposal.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-[10px] font-extrabold uppercase tracking-wide rounded-full border border-rose-150 text-rose-600">Đã từ chối</span>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chi phí đề xuất</p>
                        <p className="text-lg font-black text-[#0F766E] mt-0.5">{proposal.proposed_price.toLocaleString('vi-VN')} đ</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Thời gian thực hiện: {proposal.delivery_time_days} ngày</p>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <p className="text-sm font-semibold text-slate-600 whitespace-pre-line leading-relaxed">
                        {displayedText}
                      </p>
                      {shouldTruncate && (
                        <button 
                          type="button"
                          onClick={() => toggleExpandProposal(proposal.proposal_id)}
                          className="mt-2 text-xs text-[#0F766E] font-black hover:underline cursor-pointer border-none bg-transparent flex items-center gap-0.5"
                        >
                          {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                          <span className="material-symbols-outlined text-[14px]">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      )}
                    </div>

                    {attachmentUrl && (
                      <div className="mt-1">
                        <a 
                          href={attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F766E]/5 hover:bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] rounded-xl text-xs font-bold transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">file_open</span>
                          Mở file đề xuất đính kèm
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex-shrink-0 w-full md:w-52 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    {proposal.status === 'ACCEPTED' ? (
                      !proposal.contract_id ? (
                        <>
                          <div className="text-center py-3 px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl mb-1 flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl text-amber-600 mb-0.5 animate-pulse">pending</span>
                            <p className="text-[11px] font-bold">Chờ thanh toán ký quỹ</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/project/${projectId}/fund?amount=${proposal.proposed_price}`)}
                            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold border-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">payment</span>
                            Ký quỹ ngay
                          </button>
                          <button 
                            onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                            className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                            Nhắn tin trao đổi
                          </button>
                          <button 
                            onClick={() => handleStatusChange(proposal.proposal_id, 'SUBMITTED')}
                            className="w-full py-1 text-slate-400 hover:text-slate-600 text-[10px] font-extrabold uppercase tracking-wide hover:bg-slate-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer mt-1"
                          >
                            Hủy trạng thái thuê
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-4 bg-emerald-50/50 text-emerald-800 border border-emerald-100/60 rounded-2xl flex flex-col gap-2.5 items-center">
                          <span className="material-symbols-outlined text-3xl text-emerald-600">done_all</span>
                          <p className="text-xs font-bold">Đã ký hợp đồng</p>
                          <button 
                            onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                            className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                            Nhắn tin trao đổi
                          </button>
                        </div>
                      )
                    ) : proposal.status === 'REJECTED' ? (
                      <>
                        <div className="text-center py-3 px-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl mb-1 flex flex-col items-center">
                          <span className="material-symbols-outlined text-xl text-slate-400 mb-0.5">cancel</span>
                          <p className="text-[11px] font-bold">Đề xuất đã từ chối</p>
                        </div>
                        <button 
                          onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                          className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Nhắn tin trao đổi
                        </button>
                        <button 
                          onClick={() => handleStatusChange(proposal.proposal_id, 'SUBMITTED')}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">restore_from_trash</span>
                          Khôi phục hồ sơ
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleHire(proposal.proposal_id, proposal.proposed_price)}
                          className="w-full py-3 bg-[#0F766E] text-white rounded-xl text-xs font-bold border-none shadow-[0_4px_12px_rgba(15,118,110,0.15)] transition-all hover:bg-[#0D5E58] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">account_balance</span>
                          Thuê &amp; Ký quỹ Escrow
                        </button>

                        <button 
                          onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                          className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Nhắn tin trao đổi
                        </button>

                        <div className="flex gap-2 mt-1">
                          {proposal.status === 'SHORTLISTED' ? (
                            <button 
                              onClick={() => handleStatusChange(proposal.proposal_id, 'SUBMITTED')}
                              className="flex-1 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wide hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px]">star_half</span>
                              Bỏ chọn
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(proposal.proposal_id, 'SHORTLISTED')}
                              className="flex-1 py-2 bg-teal-50/50 text-[#0F766E] border border-teal-100 rounded-xl text-[10px] font-black uppercase tracking-wide hover:bg-teal-50 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px] font-variation-settings-'FILL'-1">star</span>
                              Ưu tiên
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusChange(proposal.proposal_id, 'REJECTED')}
                            className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-wide hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
                            title="Từ chối đề xuất"
                          >
                            <span className="material-symbols-outlined text-[12px]">block</span>
                            Từ chối
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
