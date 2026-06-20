import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [contracts, setContracts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [activeTab, setActiveTab] = useState('contracts');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch active contracts
        const contractRes = await fetch('http://localhost:5000/api/contracts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contractData = await contractRes.json();
        if (contractRes.ok && contractData.success) {
          setContracts(contractData.contracts || []);
        }

        // 2. Fetch proposals
        if (user?.id) {
          const proposalRes = await fetch(`http://localhost:5000/api/proposals?freelancerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const proposalData = await proposalRes.json();
          if (proposalRes.ok && proposalData.success) {
            setProposals(proposalData.proposals || []);
          }
        }

        // 3. Fetch Wallet balance
        const walletRes = await fetch('http://localhost:5000/api/wallet/balance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const walletData = await walletRes.json();
        if (walletRes.ok) {
          setBalance(walletData.balance || 0);
        }

        // 4. Fetch recent messages
        try {
          const chatData = await chatService.getConversations('FREELANCER');
          setConversations(chatData.conversations || []);
        } catch (chatErr) {
          console.error('Error fetching chat conversations in dashboard:', chatErr);
        }

        // 5. Fetch Profile completion dynamically
        try {
          const profileRes = await fetch('http://localhost:5000/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          if (profileRes.ok && profileData.user) {
            const u = profileData.user;
            let ex = {};
            try { ex = u.bio_extras ? JSON.parse(u.bio_extras) : {}; } catch {}
            const fields = [
              !!u.full_name, !!u.email, !!u.phone, !!u.bio, !!u.avatar_url,
              !!ex.title, !!ex.hourlyRate, ex.skills?.length > 0,
              !!ex.portfolio
            ];
            const pct = Math.round(fields.filter(Boolean).length / fields.length * 100);
            setProfileCompletion(pct || 0);
          }
        } catch (profileErr) {
          console.error('Error fetching profile completion score:', profileErr);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setErrorMsg('Không thể tải một số dữ liệu bảng điều khiển.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user?.id, navigate]);

  const getPastelColor = (name) => {
    if (!name) return 'bg-teal-50 text-teal-700 border-teal-100';
    const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const colors = [
      'bg-teal-50 text-teal-700 border-teal-100',
      'bg-blue-50 text-blue-700 border-blue-100',
      'bg-indigo-50 text-indigo-700 border-indigo-100',
      'bg-purple-50 text-purple-700 border-purple-100',
      'bg-rose-50 text-rose-700 border-rose-100',
      'bg-amber-50 text-amber-700 border-amber-100',
      'bg-emerald-50 text-emerald-700 border-emerald-100',
    ];
    return colors[charCode % colors.length];
  };

  // Metrics
  const activeContractsCount = contracts.filter(c => c.status === 'ACTIVE').length;
  const completedContractsCount = contracts.filter(c => c.status === 'COMPLETED').length;
  const submittedProposalsCount = proposals.length;
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-10 bg-[#F8FAFC]">
      
      {/* Styled inline keyframes for text slide-up fade in and floating blobs */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
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
        .animate-greeting {
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-blob-1 {
          animation: floatBlob1 16s infinite ease-in-out;
        }
        .animate-blob-2 {
          animation: floatBlob2 20s infinite ease-in-out;
        }
        .animate-blob-3 {
          animation: floatBlob3 14s infinite ease-in-out;
        }
      `}} />

      {/* Light Header with Premium Blended Gradient (Loang màu nhạt thuần xanh siêu xịn) */}
      <div className="pt-8 pb-10 px-6 md:px-12 bg-gradient-to-br from-teal-50/40 via-[#F8FAFC] to-sky-50/40 border-b border-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.02)] relative overflow-hidden">
        {/* Soft Blended Pastel Blobs (Animated & Vivid - Green/Teal/Sky Theme) */}
        <div className="absolute top-[-40%] right-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-emerald-300/40 to-teal-200/40 rounded-full blur-[100px] pointer-events-none animate-blob-1"></div>
        <div className="absolute bottom-[-30%] left-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-teal-200/40 to-sky-200/40 rounded-full blur-[90px] pointer-events-none animate-blob-2"></div>
        <div className="absolute top-[10%] left-[45%] w-[320px] h-[320px] bg-gradient-to-r from-sky-300/35 to-emerald-100/40 rounded-full blur-[85px] pointer-events-none animate-blob-3"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 animate-greeting">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0F766E] border border-teal-100 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Không gian làm việc tự do</span>
            </div>
            
            <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-slate-800 mb-2">
              Chào mừng trở lại, {user?.fullName || 'Freelancer'}
            </h1>
            <p className="text-slate-500 font-semibold text-sm md:text-base max-w-2xl leading-relaxed">
              Theo dõi các hợp đồng đang thực hiện, gửi đề xuất ứng tuyển cho dự án mới, và quản lý doanh thu ví điện tử của bạn.
            </p>
          </div>

          <Link to="/profile" className="mt-4 md:mt-0 flex items-center bg-white/75 hover:bg-white border border-slate-100 hover:border-teal-200/50 hover:shadow-md px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer group/profile">
            <div className="flex flex-col mr-4">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 group-hover/profile:text-[#0F766E] transition-colors">Hoàn thiện hồ sơ</span>
              <span className="text-xs font-bold text-slate-600 mt-0.5">Hồ sơ cá nhân &amp; portfolio</span>
            </div>
            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-[#0F766E] h-2 rounded-full transition-all duration-500" style={{ "width": `${profileCompletion}%` }}></div>
            </div>
            <span className="text-sm font-black ml-3 text-[#0F766E]">{profileCompletion}%</span>
          </Link>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 relative z-20">
        
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Key Metrics Bento Grid (All clickable) */}
            {/* Metric 1: Click to active contracts */}
          <div 
            onClick={() => {
              setActiveTab('contracts');
              document.getElementById('dashboard-lists-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-teal-50/30 border-teal-200 shadow-[0_12px_30px_rgba(15,118,110,0.08)] -translate-y-1'
                : 'bg-white border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hợp đồng hoạt động</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50">
                  <span className="material-symbols-outlined text-[22px]">work_history</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{activeContractsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Đang trong tiến trình</span>
              <span className="text-blue-600 font-bold">Active</span>
            </div>
          </div>

          {/* Metric 2: Click to Proposals */}
          <div 
            onClick={() => {
              setActiveTab('proposals');
              document.getElementById('dashboard-lists-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              activeTab === 'proposals'
                ? 'bg-teal-50/30 border-teal-200 shadow-[0_12px_30px_rgba(15,118,110,0.08)] -translate-y-1'
                : 'bg-white border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đề xuất đã nộp</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{submittedProposalsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Xem danh sách đề xuất</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </div>

          {/* Metric 3: Click to Wallet */}
          <Link to="/freelancer-wallet" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Số dư khả dụng</span>
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100/50 group-hover:bg-rose-100/50 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{Math.round(balance).toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold group-hover:text-rose-500 transition-colors">
              <span>Xem chi tiết ví</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </Link>

          {/* Metric 4: Click to contracts (Completed contracts) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dự án hoàn thành</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{completedContractsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Đã hoàn tất thanh toán</span>
              <span className="text-indigo-600 font-bold">Done</span>
            </div>
          </div>
        </div>

        {/* Dashboard split content */}
        <div id="dashboard-lists-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Active Projects (Left Column) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6 border-b border-slate-100 sm:border-none pb-3 sm:pb-0">
                  <button 
                    onClick={() => setActiveTab('contracts')}
                    className={`pb-1 text-base md:text-lg font-bold transition-all relative ${
                      activeTab === 'contracts' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Hợp đồng hiện tại ({contracts.length})
                    {activeTab === 'contracts' && (
                      <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#0F766E] rounded-full"></span>
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('proposals')}
                    className={`pb-1 text-base md:text-lg font-bold transition-all relative ${
                      activeTab === 'proposals' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Đề xuất đã nộp ({submittedProposalsCount})
                    {activeTab === 'proposals' && (
                      <span className="absolute bottom-[-10px] left-0 right-0 h-0.5 bg-[#0F766E] rounded-full"></span>
                    )}
                  </button>
                </div>
                <Link to="/browse-projects" className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1 self-start sm:self-auto">
                  Khám phá dự án mới <span className="material-symbols-outlined text-[14px]">east</span>
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-500 font-semibold flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Đang tải dữ liệu...</span>
                </div>
              ) : activeTab === 'contracts' ? (
                contracts.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 px-6 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">work_off</span>
                    <p className="text-sm font-semibold text-slate-500">Bạn chưa có hợp đồng nào đang chạy.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">Hãy gửi đề xuất nộp bài trên các dự án có sẵn để bắt đầu nhận việc.</p>
                    <Link to="/browse-projects" className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:bg-[#0D5E58] transition-all">
                      Tìm kiếm việc làm
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {contracts.map((contract) => (
                      <div key={contract.contract_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              contract.status === 'COMPLETED' 
                                ? 'bg-slate-100 text-slate-500 border-slate-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {contract.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang thực hiện'}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">
                              Mã HĐ: #{contract.contract_id}
                            </span>
                          </div>
                          
                          <h3 className="font-extrabold text-slate-800 text-base mb-1 truncate">
                            {contract.contract_title || contract.project_title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 font-semibold">
                            <span className="flex items-center gap-1 text-[#0F766E] font-bold">
                              <span className="material-symbols-outlined text-[16px]">payments</span>
                              {Math.round(contract.total_amount).toLocaleString('vi-VN')} đ
                            </span>
                            <span>•</span>
                            <span>Bắt đầu: {new Date(contract.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {contract.status !== 'COMPLETED' ? (
                            <Link 
                              to={`/submit-work/${contract.contract_id}`}
                              className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:bg-[#0D5E58] hover:shadow-md transition-all flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">send</span>
                              Nộp sản phẩm
                            </Link>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                              Đã thanh toán
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                proposals.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 px-6 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">description</span>
                    <p className="text-sm font-semibold text-slate-500">Bạn chưa gửi đề xuất nào.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">Gửi đề xuất ứng tuyển trên các dự án mở để nhận công việc mong muốn.</p>
                    <Link to="/browse-projects" className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:bg-[#0D5E58] transition-all">
                      Khám phá dự án
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {proposals.map((prop) => (
                      <div key={prop.proposal_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              prop.status === 'APPROVED' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : prop.status === 'REJECTED'
                                ? 'bg-rose-50 text-rose-700 border-rose-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {prop.status === 'APPROVED' ? 'Chấp nhận' : prop.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">
                              Mã đề xuất: #{prop.proposal_id}
                            </span>
                          </div>
                          
                          <h3 className="font-extrabold text-slate-800 text-base mb-1 truncate">
                            {prop.project_title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 font-semibold">
                            <span className="flex items-center gap-1 text-[#0F766E] font-bold">
                              <span className="material-symbols-outlined text-[16px]">payments</span>
                              Chào giá: {Math.round(prop.bid_amount).toLocaleString('vi-VN')} đ
                            </span>
                            <span>•</span>
                            <span>Gửi ngày: {new Date(prop.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <Link 
                            to={`/project-details/${prop.project_id || prop.projectId}`}
                            className="px-4 py-2 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl text-xs font-bold hover:bg-[#0F766E] hover:text-white transition-all"
                          >
                            Chi tiết dự án
                          </Link>
                        </div>
                      </div>
                    ))}
                )
              )}
            </div>
          </div>

          {/* Recent Messages / Inbox (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    Tin nhắn gần đây
                    {unreadMessagesCount > 0 && (
                      <span className="px-2.5 py-0.5 text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-full animate-pulse">
                        {unreadMessagesCount} mới
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hộp thư trao đổi công việc liên lạc đối tác.</p>
                </div>
                <Link to="/messages-freelancer" className="text-xs font-bold text-[#0F766E] hover:text-[#0D5E58] transition-colors flex items-center gap-0.5">
                  Xem hộp thư <span className="material-symbols-outlined text-[14px]">east</span>
                </Link>
              </div>

              {conversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-medium">
                  Không có tin nhắn gần đây.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {conversations.slice(0, 4).map((conv) => (
                    <div 
                      key={conv.conversationId} 
                      onClick={() => navigate('/messages-freelancer')}
                      className="p-4 hover:bg-slate-50/70 cursor-pointer transition-all duration-200 flex items-center gap-3.5 relative group border-l-2 border-transparent hover:border-[#0F766E]"
                    >
                      <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-extrabold text-sm uppercase tracking-wider transition-transform group-hover:scale-105 duration-200 shadow-sm ${getPastelColor(conv.partnerName)}`}>
                          {conv.partnerName ? conv.partnerName.slice(0, 2) : 'FL'}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full absolute -top-1 -right-1 animate-pulse z-10"></div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-800 group-hover:text-[#0F766E] transition-colors truncate">{conv.partnerName}</h4>
                          <span className="text-[9px] text-slate-400 font-bold shrink-0 ml-2">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : ''}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? 'text-slate-800 font-bold' : 'text-slate-400 font-medium'}`}>
                          {conv.lastMessage || 'Bắt đầu cuộc hội thoại mới'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
