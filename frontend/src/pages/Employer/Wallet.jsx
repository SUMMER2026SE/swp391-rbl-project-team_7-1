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
      <main className="flex-1 w-full min-h-screen bg-[#F8FAFC] flex justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#0F766E]">progress_activity</span>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full min-h-screen bg-[#F8FAFC] px-4 py-8 md:px-8 md:py-10 font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-[28px] font-black text-slate-800 tracking-tight mb-1">Ví tiền Nhà tuyển dụng</h1>
          <p className="text-[15px] text-slate-500 font-medium">Quản lý số dư, giao dịch và phương thức thanh toán</p>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Balance Card */}
            <div className="relative bg-gradient-to-r from-[#FFFFFF] via-[#EEFAF4] to-[#DDF1E8] rounded-3xl p-8 overflow-hidden shadow-sm border border-slate-100">
              {/* Blurred mesh gradient blobs */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#E6F4EA] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-[#D1FAE5] rounded-full mix-blend-multiply filter blur-[100px] opacity-55 pointer-events-none"></div>
              
              <div className="relative z-10 w-full sm:w-2/3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#0F766E] uppercase">Số dư hiện tại</span>
                  <span className="material-symbols-outlined text-[16px] text-[#0F766E]">visibility</span>
                </div>
                <h2 className="text-[40px] font-black text-slate-800 leading-none mb-1">{formatCurrency(wallet?.balance || 0)}</h2>
                <p className="text-sm font-bold text-[#0F766E] mb-10">Số dư khả dụng</p>
                
                <div className="flex items-center gap-8 border-t border-[#0F766E]/10 pt-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Đã ký quỹ (Giữ hộ)</p>
                    <p className="text-lg font-black text-amber-500">{formatCurrency(4500000)}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-[#0F766E]/10"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Tổng chi tiêu (Tháng)</p>
                    <p className="text-lg font-black text-rose-500">{formatCurrency(12500000)}</p>
                  </div>
                </div>
              </div>
              {/* Wallet Illustration (Placeholder with CSS shapes to mimic mockup) */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden sm:flex items-center justify-center pointer-events-none">
                <div className="relative w-40 h-40">
                  <div className="absolute right-2 bottom-6 w-32 h-24 bg-[#0F766E] rounded-xl shadow-lg transform rotate-[-5deg]"></div>
                  <div className="absolute right-6 bottom-10 w-28 h-20 bg-[#0D9488] rounded-xl shadow-inner transform rotate-[-5deg] border-t-4 border-[#0F766E]"></div>
                  <div className="absolute right-10 bottom-14 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-yellow-700 shadow-md rotate-12">$</div>
                  <div className="absolute right-20 bottom-24 w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-yellow-700 shadow-md">$</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button onClick={() => setIsDepositOpen(true)} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <span className="material-symbols-outlined font-light">add</span>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-slate-800">Nạp tiền</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Nạp tiền vào ví</p>
                </div>
              </button>
              <button onClick={() => navigate('/withdraw')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined font-light">send</span>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-slate-800">Rút tiền</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Rút tiền về tài khoản</p>
                </div>
              </button>
              <button onClick={() => navigate('/wallet/transactions')} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                  <span className="material-symbols-outlined font-light">history</span>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-slate-800">Lịch sử giao dịch</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Xem lịch sử giao dịch</p>
                </div>
              </button>
              <button onClick={() => setIsBankModalOpen(true)} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <span className="material-symbols-outlined font-light">credit_card</span>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-slate-800">Phương thức TT</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Quản lý thanh toán</p>
                </div>
              </button>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col">
              <div className="p-6 pb-0 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Lịch sử giao dịch</h3>
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span> Bộ lọc
                </button>
              </div>
              
              {/* Tabs */}
              <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
                {['Tất cả', 'Nạp tiền', 'Rút tiền', 'Thanh toán', 'Hoàn tiền'].map((tab, idx) => (
                  <button key={tab} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${idx === 0 ? 'bg-[#E6F5EE] text-[#10B981]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="px-6 pb-4 flex-1">
                <div className="space-y-1">
                  {transactions.length > 0 ? transactions.map(tx => {
                    const desc = (tx.description || tx.transaction_type).toLowerCase();
                    let style = { bg: 'bg-[#E6F5EE]', text: 'text-[#10B981]', icon: 'arrow_downward', amountColor: 'text-[#10B981]' };
                    
                    if (desc.includes('rút')) {
                      style = { bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]', icon: 'arrow_upward', amountColor: 'text-[#EF4444]' };
                    } else if (desc.includes('thanh toán')) {
                      style = { bg: 'bg-[#FDF2F8]', text: 'text-[#EC4899]', icon: 'receipt_long', amountColor: 'text-[#EF4444]' };
                    } else if (desc.includes('tạm giữ') || desc.includes('ký quỹ')) {
                      style = { bg: 'bg-[#FFF7ED]', text: 'text-[#F97316]', icon: 'lock', amountColor: 'text-[#EF4444]' };
                    } else if (desc.includes('hoàn tiền')) {
                      style = { bg: 'bg-[#F5F3FF]', text: 'text-[#8B5CF6]', icon: 'undo', amountColor: 'text-[#10B981]' };
                    }

                    return (
                    <div key={tx.transaction_id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-slate-50 last:border-0 gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>
                          <span className="material-symbols-outlined text-[20px] font-light">
                            {style.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{tx.description || tx.transaction_type}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{new Date(tx.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - {new Date(tx.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-14 sm:pl-0">
                        <span className={`text-[13px] font-bold ${style.amountColor}`}>
                          {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                            tx.status === 'COMPLETED' ? 'bg-[#E6F5EE] text-[#10B981]' : 
                            (desc.includes('tạm giữ') || desc.includes('ký quỹ')) ? 'bg-[#FFF7ED] text-[#F97316]' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {tx.status === 'COMPLETED' ? 'Thành công' : (desc.includes('tạm giữ') || desc.includes('ký quỹ')) ? 'Đang tạm giữ' : 'Đang xử lý'}
                          </span>
                          <button
                            onClick={() => handleExport(tx)}
                            disabled={isExporting}
                            className="w-7 h-7 rounded-md bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors disabled:opacity-50 border border-slate-100"
                            title="Xuất PDF"
                          >
                            <span className="material-symbols-outlined text-[15px]">download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}) : (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">Chưa có giao dịch nào.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 pt-0">
                <button onClick={() => navigate('/wallet/transactions')} className="w-full py-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-[13px] font-medium text-slate-600 transition-colors shadow-sm">
                  Xem tất cả giao dịch
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Overview Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-800">Tổng quan ví</h3>
                <button className="text-xs font-semibold text-[#0F766E] flex items-center">Chi tiết <span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Tổng số dư</span>
                  <span className="text-sm font-black text-slate-800">{formatCurrency((wallet?.balance || 0) + 4500000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Số dư khả dụng</span>
                  <span className="text-sm font-black text-emerald-500">{formatCurrency(wallet?.balance || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-500">Đã ký quỹ</span>
                  <span className="text-sm font-black text-amber-500">{formatCurrency(4500000)}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">Hạn mức chi tiêu</span>
                  <span className="text-xs font-bold text-slate-800">12.5%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '12.5%' }}></div>
                </div>
                <p className="text-[11px] font-semibold text-slate-400">12.500.000 đ / 100.000.000 đ</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-slate-800">Phương thức thanh toán</h3>
                <button onClick={() => setIsBankModalOpen(true)} className="text-xs font-semibold text-[#0F766E]">Quản lý</button>
              </div>
              
              <div className="space-y-3 mb-4">
                {bankAccount && (
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center font-bold">
                        {bankAccount.bank_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{bankAccount.bank_name} <span className="font-normal text-slate-500">**** {bankAccount.account_number.slice(-4)}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-[#10B981] bg-[#E6F5EE] px-2 py-0.5 rounded">Mặc định</span>
                      <span className="material-symbols-outlined text-slate-400 text-[18px] cursor-pointer hover:text-slate-600">more_vert</span>
                    </div>
                  </div>
                )}
                {!bankAccount && (
                  <div className="text-center py-4 text-slate-400 text-sm">Chưa liên kết thẻ</div>
                )}
              </div>
              
              <button onClick={() => setIsBankModalOpen(true)} className="w-full py-3 rounded-xl border border-dashed border-emerald-300 text-[13px] font-medium text-[#10B981] hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm phương thức thanh toán
              </button>
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
