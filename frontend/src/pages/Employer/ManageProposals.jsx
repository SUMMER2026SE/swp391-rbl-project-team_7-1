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
    return new Date(b.created_at) - new Date(a.created_at); // NEWEST
  });

  return (
    <main className="flex-1 p-margin-desktop pt-12 overflow-y-auto bg-slate-50">
      <div className="max-w-container-max mx-auto px-6">
        {/*  Page Header  */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link className="flex items-center gap-1 text-sm font-semibold hover:underline mb-2 text-[#0F766E]" to="/employer-dashboard">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Quay lại Bảng điều khiển
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý Đề xuất cho: <span className="font-normal text-slate-600">{projectTitle}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#0F766E]"
            >
              <option value="ALL">Tất cả đề xuất ({proposals.length})</option>
              <option value="SHORTLISTED">Được chọn ({proposals.filter(p => p.status === 'SHORTLISTED').length})</option>
              <option value="SUBMITTED">Chờ duyệt ({proposals.filter(p => p.status === 'SUBMITTED').length})</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#0F766E]"
            >
              <option value="NEWEST">Sắp xếp: Mới nhất</option>
              <option value="PRICE_ASC">Sắp xếp: Giá thấp nhất</option>
              <option value="RATING_DESC">Sắp xếp: Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {/*  Proposals Bento Grid Layout  */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-semibold bg-white rounded-2xl border border-slate-200">Đang tải danh sách đề xuất...</div>
          ) : sortedProposals.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
              <span className="material-symbols-outlined text-5xl mb-2">find_in_page</span>
              <p>Chưa có đề xuất nào khớp với bộ lọc của bạn.</p>
            </div>
          ) : (
            sortedProposals.map((proposal) => (
              <article 
                key={proposal.proposal_id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              >
                {/*  Subtle Status Indicator Strip  */}
                {proposal.status === 'SHORTLISTED' && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0F766E]"></div>
                )}
                {proposal.status === 'ACCEPTED' && proposal.contract_id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                )}
                {proposal.status === 'ACCEPTED' && !proposal.contract_id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                )}
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/*  Left: Freelancer Info  */}
                  <div className="flex-shrink-0 w-full md:w-64 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <img 
                        alt="Freelancer Avatar" 
                        className="w-16 h-16 rounded-full border border-slate-200 object-cover" 
                        src={proposal.freelancer_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCioT3d29HAboKCh5FtH6yfJpreH6DQUNNdw8JVFoWTx6CMJJV0VXmJh5I4syj9A0nIm_Gn_kL4WN6hfVI3NVC1kL3X5kfRJVJyhppVo7GXsDb968rw3xdoxDmwSwigUm0d5Kj5VgB_1-w1p2eLFKTMOkAjmBe5lwKPjINix_mvuV2Cs99sGXjriNMQP2UhQRV6Xn1lM9CDkekRwQrNn2cP4aNr1sPsokHcK5zgQ6pdDtwQYOddnNJI8opkRkmtbH-OjupriQb1o5g"}
                      />
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{proposal.freelancer_name}</h3>
                        <p className="text-sm font-medium text-slate-500">Freelancer</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-yellow-500 text-[16px] font-variation-settings-'FILL'-1">star</span>
                          <span className="text-sm font-bold text-slate-700">{proposal.rating_average ? proposal.rating_average.toFixed(1) : '0.0'}</span>
                          <span className="text-sm font-medium text-slate-400">({proposal.total_reviews || 0} việc)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  Middle: Proposal Content  */}
                  <div className="flex-grow flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        {proposal.status === 'SHORTLISTED' && (
                          <span className="px-3 py-1 bg-teal-50 text-xs font-bold uppercase tracking-wider rounded-full border border-teal-100 text-[#0F766E]">Được chọn</span>
                        )}
                        {proposal.status === 'ACCEPTED' && proposal.contract_id && (
                          <span className="px-3 py-1 bg-green-50 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100 text-green-700">Đã thuê</span>
                        )}
                        {proposal.status === 'ACCEPTED' && !proposal.contract_id && (
                          <span className="px-3 py-1 bg-amber-50 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200 text-amber-700">Chờ ký quỹ</span>
                        )}
                        {proposal.status === 'SUBMITTED' && (
                          <span className="px-3 py-1 bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-200 text-slate-500">Chờ duyệt</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-[#0F766E]">{proposal.proposed_price.toLocaleString('vi-VN')} đ</div>
                        <div className="text-xs text-slate-500 font-semibold mt-1">trong {proposal.delivery_time_days} ngày</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-sm font-medium text-slate-600 whitespace-pre-line">
                        {proposal.cover_letter}
                      </p>
                    </div>
                  </div>

                  {/*  Right: Actions  */}
                  <div className="flex-shrink-0 w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    {proposal.status !== 'ACCEPTED' ? (
                      <>
                        <button 
                          onClick={() => handleHire(proposal.proposal_id, proposal.proposed_price)}
                          className="w-full py-3 bg-[#0F766E] text-white rounded-xl text-sm font-bold border-none shadow-[0_4px_12px_rgba(15,118,110,0.15)] transition-all hover:bg-[#0D5E58] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">account_balance</span>
                          Thuê &amp; Ký quỹ Escrow
                        </button>
                        <button 
                          onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                          className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                          Nhắn tin
                        </button>
                        <div className="flex gap-2 mt-1">
                          {proposal.status === 'SHORTLISTED' ? (
                            <button 
                              onClick={() => handleStatusChange(proposal.proposal_id, 'SUBMITTED')}
                              className="flex-1 py-2 text-slate-500 text-xs font-bold hover:bg-slate-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                            >
                              Bỏ chọn
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(proposal.proposal_id, 'SHORTLISTED')}
                              className="flex-1 py-2 text-[#0F766E] text-xs font-bold hover:bg-teal-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                            >
                              Lưu ưu tiên
                            </button>
                          )}
                          <button 
                            onClick={() => handleStatusChange(proposal.proposal_id, 'REJECTED')}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer"
                            title="Từ chối đề xuất"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </>
                    ) : !proposal.contract_id ? (
                      <>
                        <div className="text-center py-2 px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl mb-1">
                          <span className="material-symbols-outlined text-2xl text-amber-600 mb-0.5">pending</span>
                          <p className="text-xs font-bold">Chờ thanh toán ký quỹ</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/project/${projectId}/fund?amount=${proposal.proposed_price}`)}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold border-none transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">payment</span>
                          Ký quỹ ngay
                        </button>
                        <button 
                          onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                          className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Nhắn tin
                        </button>
                        <button 
                          onClick={() => handleStatusChange(proposal.proposal_id, 'SUBMITTED')}
                          className="w-full py-1 text-slate-500 text-[11px] font-bold hover:bg-slate-100 rounded-xl transition-colors border-none bg-transparent cursor-pointer mt-1"
                        >
                          Hủy trạng thái duyệt thuê
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-4 bg-green-50 text-green-800 border border-green-100 rounded-xl flex flex-col gap-2.5 items-center">
                        <span className="material-symbols-outlined text-3xl mb-1 text-green-600">done_all</span>
                        <p className="text-sm font-bold">Đã ký hợp đồng</p>
                        <button 
                          onClick={() => navigate('/messages-employer', { state: { selectConvId: `direct-${projectId}-${proposal.freelancer_id}` } })}
                          className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Nhắn tin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
