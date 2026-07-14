import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';
import { proposalService } from '../../services/proposalService';
import { invitationService } from '../../services/invitationService';
import Swal from 'sweetalert2';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [contracts, setContracts] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [invitations, setInvitations] = useState([]);
  const [activeTab, setActiveTab] = useState('contracts');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch active contracts
      const contractRes = await fetch('http://localhost:5000/api/contracts?role=FREELANCER', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contractData = await contractRes.json();
      if (contractRes.ok && contractData.success) {
        setContracts(contractData.contracts || []);
      }

      // 2. Fetch proposals
      const freelancerId = user?.userId || user?.user_id || user?.id;
      if (freelancerId) {
        const proposalRes = await fetch(`http://localhost:5000/api/proposals?freelancerId=${freelancerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const proposalData = await proposalRes.json();
        if (proposalRes.ok && proposalData.success) {
          const activeProposals = (proposalData.proposals || []).filter(
            p => p.status !== 'ACCEPTED' && p.status !== 'APPROVED'
          );
          setProposals(activeProposals);
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

      // 6. Fetch invitations
      try {
        const inviteRes = await invitationService.getFreelancerInvitations();
        if (inviteRes.success) {
          setInvitations(inviteRes.invitations || []);
        }
      } catch (inviteErr) {
        console.error('Error fetching freelancer invitations:', inviteErr);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setErrorMsg('Không thể tải một số dữ liệu bảng điều khiển.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();

    // Load message from redirect state if available
    if (location.state?.message) {
      setToastMsg(location.state.message);
      // Clear navigation state so it doesn't trigger again
      navigate(location.pathname, { replace: true });
      setTimeout(() => setToastMsg(''), 4000);
    }
  }, [token, user?.userId, user?.user_id, user?.id, navigate]);

  const handleWithdrawProposal = async (proposalId) => {
    const result = await Swal.fire({
      title: 'Rút đề xuất?',
      text: 'Bạn có chắc chắn muốn rút đề xuất này? Thao tác này không thể hoàn tác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Đồng ý rút',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;

    try {
      const data = await proposalService.deleteProposal(proposalId);
      if (data.success) {
        setToastMsg('Đã rút đề xuất thành công!');
        fetchDashboardData();
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        Swal.fire({
          title: 'Thất bại',
          text: data.message || 'Lỗi khi rút đề xuất.',
          icon: 'error',
          confirmButtonColor: '#0F766E'
        });
      }
    } catch (err) {
      console.error('Error withdrawing proposal:', err);
      Swal.fire({
        title: 'Lỗi kết nối',
        text: 'Lỗi mạng khi thực hiện rút đề xuất.',
        icon: 'error',
        confirmButtonColor: '#0F766E'
      });
    }
  };

  const handleRespondToInvitation = async (invitationId, status) => {
    const isAccept = status === 'ACCEPTED';
    const result = await Swal.fire({
      title: isAccept ? 'Chấp nhận lời mời?' : 'Từ chối lời mời?',
      text: `Bạn có chắc chắn muốn ${isAccept ? 'CHẤP NHẬN' : 'TỪ CHỐI'} lời mời hợp tác này?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: isAccept ? '#0F766E' : '#E11D48',
      cancelButtonColor: '#64748B',
      confirmButtonText: isAccept ? 'Đồng ý nhận' : 'Từ chối',
      cancelButtonText: 'Hủy'
    });

    if (!result.isConfirmed) return;
    
    try {
      const res = await invitationService.respondToInvitation(invitationId, status);
      if (res.success) {
        setToastMsg(res.message);
        fetchDashboardData();
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        Swal.fire({
          title: 'Thất bại',
          text: res.message || 'Lỗi khi phản hồi lời mời.',
          icon: 'error',
          confirmButtonColor: '#0F766E'
        });
      }
    } catch (err) {
      console.error('Error responding to invitation:', err);
      Swal.fire({
        title: 'Lỗi kết nối',
        text: err.response?.data?.message || 'Lỗi mạng khi phản hồi lời mời.',
        icon: 'error',
        confirmButtonColor: '#0F766E'
      });
    }
  };

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

  // Metrics
  const activeContractsCount = contracts.filter(c => c.status === 'ACTIVE').length;
  const completedContractsCount = contracts.filter(c => c.status === 'COMPLETED').length;
  const submittedProposalsCount = proposals.length;
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <main className="flex-1 min-h-screen pb-20 md:pb-10 bg-[#F8FAFC]">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md text-slate-800 px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(15,118,110,0.15)] border border-teal-100 max-w-sm animate-[bounce_1s_infinite]">
          <span className="material-symbols-outlined text-[24px] text-teal-600 font-bold">check_circle</span>
          <span className="font-bold text-sm text-slate-700">{toastMsg}</span>
        </div>
      )}
      
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

      {/* Light Header with Premium Blended Gradient & Subtle Dot Grid Pattern (Trend 2026 SaaS UI) */}
      <div className="pt-12 pb-14 px-6 md:px-12 bg-gradient-to-br from-[#F0F9F8] via-[#F3F8FC] to-[#F5FCF8] border-b border-slate-100/60 shadow-sm relative overflow-hidden">
        {/* Modern Dot Grid Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

        {/* Soft Blended Pastel Aurora Blobs (Extremely subtle, sleek mesh style) */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-teal-200/10 to-emerald-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-1"></div>
        <div className="absolute bottom-[-40%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-sky-200/10 to-cyan-200/10 rounded-full blur-[110px] pointer-events-none animate-blob-2"></div>
        <div className="absolute top-[0%] left-[40%] w-[380px] h-[380px] bg-gradient-to-r from-emerald-200/8 to-teal-200/8 rounded-full blur-[90px] pointer-events-none animate-blob-3"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 animate-greeting">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#0F766E] border border-slate-200/60 shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Không gian làm việc tự do</span>
            </div>
            
            <h1 className="text-4xl md:text-5.5xl font-black tracking-tight mb-3 leading-none pb-1 bg-gradient-to-r from-slate-900 via-[#0F766E] to-slate-800 bg-clip-text text-transparent">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Metric 1: Click to active contracts */}
          <div 
            onClick={() => {
              setActiveTab('contracts');
              document.getElementById('dashboard-lists-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Hợp đồng hoạt động</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50 group-hover:bg-blue-100/50 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">work_history</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{activeContractsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold group-hover:text-blue-600 transition-colors">
              <span>Xem danh sách</span>
              <span className="material-symbols-outlined text-[16px]">east</span>
            </div>
          </div>

          {/* Metric 2: Click to Proposals */}
          <div 
            onClick={() => {
              setActiveTab('proposals');
              document.getElementById('dashboard-lists-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Đề xuất đã nộp</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50 group-hover:bg-emerald-100/50 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">description</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{submittedProposalsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold group-hover:text-emerald-600 transition-colors">
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
          <div 
            onClick={() => {
              setActiveTab('contracts');
              document.getElementById('dashboard-lists-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">Dự án hoàn thành</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50 group-hover:bg-indigo-100/50 transition-colors">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                </div>
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{completedContractsCount}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold group-hover:text-indigo-600 transition-colors">
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
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Hợp đồng &amp; Đề xuất của tôi</h2>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">Theo dõi các hợp đồng đang thực hiện và các đề xuất ứng tuyển.</p>
                </div>
                
                <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-100 shrink-0 self-start sm:self-auto">
                  <button 
                    onClick={() => setActiveTab('contracts')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeTab === 'contracts' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Hợp đồng ({contracts.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('proposals')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeTab === 'proposals' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Đề xuất đã nộp ({submittedProposalsCount})
                  </button>
                  <button 
                    onClick={() => setActiveTab('invitations')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeTab === 'invitations' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lời mời ({invitations.filter(i => i.status === 'PENDING').length})
                  </button>
                </div>
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
                    <Link to="/browse-projects" className="px-4 py-2 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl text-xs font-bold hover:bg-[#0F766E] hover:text-white transition-all">
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
                                : contract.latest_submission_status === 'SUBMITTED'
                                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                                  : contract.latest_submission_status === 'REVISION_REQUESTED'
                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {contract.status === 'COMPLETED' 
                                ? 'Đã hoàn thành' 
                                : contract.latest_submission_status === 'SUBMITTED'
                                  ? 'Chờ duyệt sản phẩm'
                                  : contract.latest_submission_status === 'REVISION_REQUESTED'
                                    ? 'Yêu cầu chỉnh sửa'
                                    : 'Đang thực hiện'}
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
                            {contract.project_deadline && (
                              <>
                                <span>•</span>
                                <span className="text-rose-600 font-bold flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[14px]">event_busy</span>
                                  Hạn chót: {new Date(contract.project_deadline).toLocaleDateString('vi-VN')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {contract.status !== 'COMPLETED' ? (
                            <Link 
                              to={`/submit-work/${contract.contract_id}`}
                              className="px-4 py-2 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl text-xs font-bold hover:bg-[#0F766E] hover:text-white transition-all flex items-center gap-1"
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
              ) : activeTab === 'proposals' ? (
                proposals.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 px-6 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">description</span>
                    <p className="text-sm font-semibold text-slate-500">Bạn chưa gửi đề xuất nào.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">Gửi đề xuất ứng tuyển trên các dự án mở để nhận công việc mong muốn.</p>
                    <Link to="/browse-projects" className="px-4 py-2 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl text-xs font-bold hover:bg-[#0F766E] hover:text-white transition-all">
                      Khám phá dự án
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {proposals.map((prop) => {
                      const { coverLetter, attachmentUrl } = parseProposalCoverLetter(prop.cover_letter);
                      const price = prop.proposed_price || prop.proposedPrice || prop.bid_amount || prop.bidAmount || 0;

                      return (
                        <div key={prop.proposal_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                prop.status === 'ACCEPTED' || prop.status === 'APPROVED'
                                  ? prop.contract_id
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                  : prop.status === 'REJECTED'
                                  ? 'bg-rose-50 text-rose-700 border-rose-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>
                                {prop.status === 'ACCEPTED' || prop.status === 'APPROVED'
                                  ? prop.contract_id
                                    ? 'Đã thuê'
                                    : 'Chờ ký quỹ'
                                  : prop.status === 'REJECTED'
                                  ? 'Từ chối'
                                  : 'Chờ duyệt'}
                              </span>
                              <span className="text-slate-400 text-xs font-semibold">
                                Mã đề xuất: #{prop.proposal_id}
                              </span>
                            </div>
                            
                            <h3 className="font-extrabold text-slate-800 text-base mb-1 truncate">
                              {prop.project_title}
                            </h3>

                            {coverLetter && (
                              <p className="text-slate-500 text-xs mt-1 max-w-xl leading-relaxed">
                                <strong className="text-slate-700">Thư giới thiệu:</strong> {coverLetter.length > 120 ? `${coverLetter.substring(0, 120)}...` : coverLetter}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-slate-400 font-semibold">
                              <span className="flex items-center gap-1 text-[#0F766E] font-bold">
                                <span className="material-symbols-outlined text-[16px]">payments</span>
                                Chi phí đề xuất: {Math.round(price).toLocaleString('vi-VN')} đ
                              </span>
                              <span>•</span>
                              <span>Gửi ngày: {new Date(prop.created_at).toLocaleDateString('vi-VN')}</span>
                              {attachmentUrl && (
                                <>
                                  <span>•</span>
                                  <a 
                                    href={attachmentUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-0.5 text-teal-600 hover:text-teal-800 hover:underline font-bold"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">description</span>
                                    Tệp đính kèm
                                  </a>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <Link 
                              to={`/project-details/${prop.project_id || prop.projectId}`}
                              className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 hover:text-slate-900 transition-all"
                            >
                              Chi tiết dự án
                            </Link>

                            {prop.status !== 'APPROVED' && prop.status !== 'REJECTED' && (
                              <>
                                <Link 
                                  to={`/edit-proposal/${prop.proposal_id}`}
                                  className="px-4 py-2 bg-teal-50 text-[#0F766E] border border-teal-100 rounded-xl text-xs font-bold hover:bg-[#0F766E] hover:text-white transition-all flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">edit</span>
                                  Chỉnh sửa
                                </Link>
                                <button 
                                  onClick={() => handleWithdrawProposal(prop.proposal_id)}
                                  className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer border-none"
                                >
                                  <span className="material-symbols-outlined text-[14px]">delete</span>
                                  Rút đề xuất
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* activeTab === 'invitations' */
                invitations.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 px-6 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3">mail_outline</span>
                    <p className="text-sm font-semibold text-slate-500">Bạn chưa nhận được lời mời làm việc nào.</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">Khi các nhà tuyển dụng mời bạn tham gia dự án của họ, chúng sẽ xuất hiện ở đây.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {invitations.map((invite) => (
                      <div key={invite.invitation_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              invite.status === 'ACCEPTED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : invite.status === 'DECLINED'
                                ? 'bg-rose-50 text-rose-700 border-rose-100'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {invite.status === 'ACCEPTED' ? 'Đã chấp nhận' : invite.status === 'DECLINED' ? 'Đã từ chối' : 'Đang chờ'}
                            </span>
                            <span className="text-slate-400 text-xs font-semibold">
                              Nhà tuyển dụng: <span className="text-[#0f766e] font-bold">{invite.employer_name}</span>
                            </span>
                          </div>
                          
                          <h3 className="font-extrabold text-slate-800 text-base mb-1 truncate">
                            {invite.project_title}
                          </h3>

                          {invite.message && (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 mt-2 max-w-xl text-xs text-slate-600 italic break-words break-all whitespace-pre-wrap max-h-32 overflow-y-auto">
                              "{invite.message}"
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-400 font-semibold">
                            <span>Mời ngày: {new Date(invite.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {invite.status === 'PENDING' && (
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => handleRespondToInvitation(invite.invitation_id, 'DECLINED')}
                              className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all cursor-pointer border-none"
                            >
                              Từ chối
                            </button>
                            <button
                              onClick={() => handleRespondToInvitation(invite.invitation_id, 'ACCEPTED')}
                              className="px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-bold hover:bg-[#0D5E58] transition-all cursor-pointer border-none"
                            >
                              Đồng ý &amp; Ứng tuyển
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
