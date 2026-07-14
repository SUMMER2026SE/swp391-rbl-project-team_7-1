import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DepositModal from '../../components/Wallet/DepositModal';
import BankAccountModal from '../../components/Wallet/BankAccountModal';
import { useAuth } from '../../hooks/useAuth';
import InvoiceTemplate from '../../components/Wallet/InvoiceTemplate';
import html2pdf from 'html2pdf.js';

export default function EmployerWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedTx, setSelectedTx] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const invoiceRef = useRef(null);

  const handleExport = (tx) => {
    setSelectedTx(tx);
    setIsExporting(true);
    
    setTimeout(() => {
      if (!invoiceRef.current) {
        setIsExporting(false);
        return;
      }
      
      const element = invoiceRef.current;
      const opt = {
        margin: 0,
        filename: `Hoa_Don_FJMS_${tx.transaction_id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        setIsExporting(false);
        setSelectedTx(null);
      });
    }, 500);
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch Wallet
      const walletRes = await fetch('http://localhost:5000/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }

      // Fetch Bank Account
      const bankRes = await fetch('http://localhost:5000/api/bank-account', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bankRes.ok) {
        const bankData = await bankRes.json();
        setBankAccount(bankData);
      }

      // Fetch Transactions
      const txRes = await fetch('http://localhost:5000/api/wallet/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        const txArray = txData.data || [];
        setTransactions(txArray.slice(0, 4)); // Only keep latest 4
      }

    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSuccess = (newBalance) => {
    setWallet(prev => ({ ...prev, balance: newBalance }));
    fetchWalletData(); // Refresh transactions
  };

  const handleBankUpdateSuccess = (updatedBankAccount) => {
    setBankAccount(updatedBankAccount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <main className="flex-1 w-full min-h-screen bg-[#F2F0EB] flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#4A6755]">progress_activity</span>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full min-h-screen bg-[#F2F0EB] px-4 py-8 md:px-8 md:py-10 font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4A6755] flex items-center justify-center text-white text-xl">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Xin chào, {user?.full_name?.split(' ')[0] || 'bạn'}!</h1>
              <p className="text-sm text-slate-500 font-medium">Khám phá thông tin và hoạt động ví của bạn</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="bg-[#4A6755] hover:bg-[#3d5446] text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nạp Tiền
            </button>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-600 cursor-pointer hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </div>
          </div>
        </header>

        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">
          
          {/* TOP ROW: Stats */}
          <div className="md:col-span-3 bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center">
            <p className="text-xs text-slate-500 font-semibold mb-1">Số dư khả dụng</p>
            <h2 className="text-2xl font-black text-slate-800">{formatCurrency(wallet?.balance || 0)}</h2>
            <div className="mt-4 flex items-end gap-1 h-8 opacity-40">
              {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                <div key={i} className="w-full bg-[#4A6755] rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3 bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-center relative overflow-hidden">
            <p className="text-xs text-slate-500 font-semibold mb-1">Tổng chi tiêu (Tháng)</p>
            <h2 className="text-2xl font-black text-slate-800">{formatCurrency(12500000)}</h2>
            <div className="absolute right-[-10px] bottom-[-20px] opacity-20">
              <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="#4A6755" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0,80 Q20,20 50,50 T100,10" />
              </svg>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-1">Dự án đang chạy</p>
              <h2 className="text-2xl font-black text-slate-800">12</h2>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined">work</span>
            </div>
          </div>

          <div className="md:col-span-3 bg-[#4A6755] p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col justify-center relative text-white overflow-hidden">
            <p className="text-xs text-white/70 font-medium mb-1">Đã ký quỹ (Giữ hộ)</p>
            <h2 className="text-2xl font-black">{formatCurrency(4500000)}</h2>
            <div className="absolute right-0 bottom-10 w-24 h-8">
               <svg width="100%" height="100%" viewBox="0 0 100 30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round">
                <path d="M0,15 Q20,30 40,15 T80,15 T100,5" />
              </svg>
            </div>
          </div>

          {/* MIDDLE ROW */}
          <div className="md:col-span-8 bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Biến động số dư <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </h3>
              <select className="bg-slate-50 border-none text-xs font-semibold text-slate-500 py-1.5 px-3 rounded-full outline-none cursor-pointer">
                <option>Tháng này</option>
                <option>Tháng trước</option>
              </select>
            </div>
            
            <div className="flex gap-8 mb-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Thu vào</p>
                <p className="text-lg font-black text-slate-800 flex items-center gap-1">
                  45.50% <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">+2.45%</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold">Chi ra</p>
                <p className="text-lg font-black text-slate-800 flex items-center gap-1">
                  {formatCurrency(12500000)} <span className="text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded font-bold">-4.75%</span>
                </p>
              </div>
            </div>
            
            {/* 2-Column Bar Chart */}
            <div className="flex-1 min-h-[160px] flex items-end justify-center gap-12 pt-6 pb-2 border-b-2 border-slate-50 mt-4">
              {/* Income Bar */}
              <div className="w-[80px] flex flex-col items-center gap-3">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-emerald-100 shadow-sm">+ Tiền cộng</span>
                <div className="w-full bg-gradient-to-t from-emerald-200 to-emerald-500 rounded-t-[10px] shadow-sm transition-all duration-300 hover:brightness-110" style={{ height: '60px' }}></div>
              </div>

              {/* Outcome Bar */}
              <div className="w-[80px] flex flex-col items-center gap-3">
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full whitespace-nowrap border border-rose-100 shadow-sm">- Tiền trừ</span>
                <div className="w-full bg-gradient-to-t from-rose-200 to-rose-500 rounded-t-[10px] shadow-sm transition-all duration-300 hover:brightness-110" style={{ height: '140px' }}></div>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="md:col-span-4 bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 p-1 mb-4">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0" alt="Avatar" className="w-full h-full rounded-full object-cover" />
            </div>
            <h3 className="text-lg font-black text-slate-800">{user?.full_name}</h3>
            <p className="text-xs font-semibold text-slate-400 mb-6">{user?.email}</p>
            
            <div className="w-full grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
              <div>
                <p className="text-lg font-black text-slate-800">26</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Dự án</p>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800">12</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Đánh giá</p>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800">4.8</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Điểm</p>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="md:col-span-6 bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Tài khoản Ngân hàng</h3>
              <button onClick={() => setIsBankModalOpen(true)} className="text-xs bg-[#4A6755] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#3d5446] transition-colors">
                {bankAccount ? 'Cập nhật' : 'Thêm thẻ +'}
              </button>
            </div>
            
            {bankAccount ? (
              <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[1.25rem] p-5 text-white relative overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-mono text-sm tracking-widest opacity-80">{bankAccount.bank_name}</span>
                  <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <p className="font-mono text-xl tracking-[0.15em] mb-4 text-slate-200">
                  {bankAccount.account_number.replace(/\d(?=\d{4})/g, "*")}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest opacity-60 mb-1">Chủ tài khoản</p>
                    <p className="font-bold text-sm tracking-wide">{bankAccount.account_holder_name.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-rose-500/80 mix-blend-multiply"></div>
                    <div className="w-6 h-6 rounded-full bg-amber-400/80 mix-blend-multiply -ml-3"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-[1.25rem] flex flex-col items-center justify-center p-6 text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setIsBankModalOpen(true)}>
                <span className="material-symbols-outlined text-4xl mb-2">add_card</span>
                <p className="text-sm font-semibold text-slate-600">Chưa liên kết ngân hàng</p>
                <p className="text-xs text-center mt-1">Thêm tài khoản để thực hiện giao dịch thuận tiện hơn.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-6 bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
             <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Giao dịch gần đây</h3>
              <button onClick={() => navigate('/wallet/transactions')} className="text-[10px] uppercase font-bold text-slate-400 hover:text-[#4A6755]">Xem tất cả</button>
            </div>
            
            <div className="space-y-4 flex-1">
              {transactions.length > 0 ? transactions.map(tx => (
                <div key={tx.transaction_id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {tx.amount > 0 ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{tx.description || tx.transaction_type}</p>
                      <p className="text-[10px] text-slate-400">{new Date(tx.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleExport(tx)}
                      disabled={isExporting}
                      className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
                      title="Xuất Hóa Đơn PDF"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-400">
                  <span className="material-symbols-outlined text-3xl mb-2">receipt_long</span>
                  <p className="text-sm">Chưa có giao dịch nào.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onSuccess={handleDepositSuccess}
      />
      
      <BankAccountModal 
        isOpen={isBankModalOpen} 
        onClose={() => setIsBankModalOpen(false)} 
        initialData={bankAccount}
        onSuccess={handleBankUpdateSuccess}
      />

      {/* Hidden Invoice Template for PDF Export */}
      {selectedTx && (
        <div style={{ position: 'fixed', top: 0, left: '-100vw', opacity: 0, zIndex: -100, pointerEvents: 'none' }}>
          <InvoiceTemplate ref={invoiceRef} transaction={selectedTx} user={user} />
        </div>
      )}
    </main>
  );
}
