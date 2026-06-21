import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepositModal from '../../components/Wallet/DepositModal';
import BankAccountModal from '../../components/Wallet/BankAccountModal';

export default function EmployerWallet() {
  const [wallet, setWallet] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const navigate = useNavigate();

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
        setBankAccount(bankData); // can be null if not created
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSuccess = (newBalance) => {
    setWallet(prev => ({ ...prev, balance: newBalance }));
  };

  const handleBankUpdateSuccess = (updatedBankAccount) => {
    setBankAccount(updatedBankAccount);
  };

  if (loading) {
    return (
      <main className="flex-1 ml-0 overflow-y-auto w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 bg-[#F8FAFC]">
        <div className="flex justify-center items-center h-64">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#0F766E]">progress_activity</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 ml-0 overflow-y-auto w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 bg-[#F8FAFC]">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-[#334155] mb-2">Wallet &amp; Transactions</h1>
          <p className="font-body-base text-body-base text-[#475569]">Manage your wallet balance and linked bank account.</p>
        </div>
        <button 
          onClick={() => setIsDepositOpen(true)}
          className="bg-[#0F766E] hover:bg-[#0d615b] text-white font-body-base font-semibold py-3 px-6 rounded-lg transition-colors shadow-[0_2px_12px_rgba(15,23,42,0.015)] flex items-center justify-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Nạp Tiền
        </button>
      </header>

      {/* Bento Grid: Financial Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Wallet Balance Card */}
        <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="font-label-caps text-label-caps bg-[#ECFDF5] text-[#0F766E] px-2 py-1 rounded-full uppercase">Active</span>
          </div>
          <div>
            <p className="font-body-sm text-body-sm text-[#475569] mb-1">Số dư ví (Wallet Balance)</p>
            <h3 className="font-headline-2xl text-headline-2xl text-[#334155]">
              {wallet?.balance !== undefined ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallet.balance) : '0 ₫'}
            </h3>
            <p className="font-body-sm text-body-sm text-[#475569] mt-2 text-xs">
              Mã ví: #{wallet?.wallet_id || 'N/A'}
            </p>
          </div>
        </div>

        {/* Saved Bank Account Card */}
        <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <button 
              onClick={() => setIsBankModalOpen(true)}
              className="text-[#475569] hover:text-[#0F766E] transition-colors"
            >
              <span className="material-symbols-outlined">{bankAccount ? 'edit' : 'add'}</span>
            </button>
          </div>
          <div>
            <p className="font-body-sm text-body-sm text-[#475569] mb-3">Tài khoản ngân hàng liên kết</p>
            
            {bankAccount ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] mb-2">
                <span className="material-symbols-outlined text-[#0F766E]">credit_score</span>
                <div className="flex-1">
                  <p className="font-body-sm text-body-sm font-semibold text-[#334155]">{bankAccount.bank_name}</p>
                  <p className="text-xs text-[#475569]">{bankAccount.account_number} - {bankAccount.account_holder_name}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[#E2E8F0] bg-[#F8FAFC] mb-2 cursor-pointer hover:bg-[#F1F5F9]" onClick={() => setIsBankModalOpen(true)}>
                <span className="material-symbols-outlined text-[#475569]">add_circle</span>
                <div className="flex-1">
                  <p className="font-body-sm text-body-sm font-semibold text-[#475569]">Chưa có tài khoản</p>
                  <p className="text-xs text-[#475569]">Nhấn để thêm tài khoản ngân hàng</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Transaction History Banner */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-level-1 flex-1 mb-8 overflow-hidden flex flex-col justify-center items-center py-16">
        <span className="material-symbols-outlined text-4xl text-[#94A3B8] mb-4">history</span>
        <h3 className="font-headline-xl text-headline-xl text-[#334155] mb-2">Lịch sử giao dịch</h3>
        <p className="text-[#475569] max-w-md text-center mb-6">Xem toàn bộ lịch sử nạp, rút, ký quỹ và thanh toán trong ví của bạn.</p>
        <button 
          onClick={() => navigate('/wallet/transactions')}
          className="bg-white border border-[#E2E8F0] text-[#0F766E] px-6 py-2 rounded-lg font-medium hover:bg-[#F8FAFC] transition-colors"
        >
          Xem chi tiết lịch sử
        </button>
      </section>

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
    </main>
  );
}
