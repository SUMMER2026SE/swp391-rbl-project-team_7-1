import React, { useState, useEffect } from 'react';
import BankAccountModal from '../../components/Wallet/BankAccountModal';
import { useNavigate } from 'react-router-dom';

export default function FreelancerWallet() {
  const [wallet, setWallet] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  const handleBankUpdateSuccess = (updatedBankAccount) => {
    setBankAccount(updatedBankAccount);
  };

  if (loading) {
    return (
      <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex flex-col">
        <div className="flex justify-center items-center h-64">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#0F766E]">progress_activity</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex flex-col">
      {/* Header */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-2xl text-headline-2xl text-on-surface mb-2">Ví & Thu nhập</h2>
          <p className="font-body-base text-body-base text-on-surface-variant">Quản lý quỹ của bạn và tài khoản ngân hàng liên kết.</p>
        </div>
        <button 
          onClick={() => navigate('/withdraw')}
          className="bg-[#0F766E] text-white px-6 py-2 rounded-lg font-body-base text-body-base hover:bg-[#0D5E58] transition-colors shadow-level-1 flex items-center"
          title="Tạo yêu cầu rút tiền"
        >
          <span className="material-symbols-outlined mr-2">account_balance</span> Rút tiền
        </button>
      </header>

      {/* Bento Grid: Balances & Bank */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Available Balance */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-level-1 card-hover transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F766E] opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Số dư khả dụng</h3>
            <span className="material-symbols-outlined text-[#0F766E] bg-[#0F766E]/10 p-2 rounded-full">account_balance_wallet</span>
          </div>
          <div className="relative z-10">
            <p className="font-display-hero text-display-hero text-[#334155]">
              ${wallet?.balance !== undefined ? parseFloat(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
              Sẵn sàng rút tiền
            </p>
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
            <p className="font-body-sm text-body-sm text-[#475569] mb-3">Tài khoản ngân hàng liên kết (Dùng để rút tiền)</p>
            
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
        <p className="text-[#475569] max-w-md text-center mb-6">Xem toàn bộ lịch sử rút tiền, nhận thanh toán và hoàn tiền trong ví của bạn.</p>
        <button 
          onClick={() => navigate('/wallet/transactions')}
          className="bg-white border border-[#E2E8F0] text-[#0F766E] px-6 py-2 rounded-lg font-medium hover:bg-[#F8FAFC] transition-colors"
        >
          Xem chi tiết lịch sử
        </button>
      </section>

      <BankAccountModal 
        isOpen={isBankModalOpen} 
        onClose={() => setIsBankModalOpen(false)} 
        initialData={bankAccount}
        onSuccess={handleBankUpdateSuccess}
      />
    </main>
  );
}
