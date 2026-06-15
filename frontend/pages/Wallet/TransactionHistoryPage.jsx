import React, { useState, useEffect } from 'react';
import TransactionTable from '../../components/Wallet/TransactionTable';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    fetchTransactions();
  }, [page, type]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/wallet/transactions?page=${page}&limit=${limit}&type=${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    setType(e.target.value);
    setPage(1); // Reset to first page on filter
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-[#F8FAFC] max-w-container-max mx-auto w-full flex flex-col">
      <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="font-headline-2xl text-headline-2xl text-on-surface mb-2">Lịch sử giao dịch</h2>
          <p className="font-body-base text-body-base text-on-surface-variant">Xem lại các biến động số dư trong ví của bạn.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-[#475569]">Lọc theo:</label>
          <select 
            value={type} 
            onChange={handleFilterChange}
            className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none text-[#334155]"
          >
            <option value="">Tất cả</option>
            <option value="DEPOSIT">Nạp tiền (Deposit)</option>
            <option value="ESCROW_DEPOSIT">Ký quỹ (Escrow Deposit)</option>
            <option value="PAYMENT">Thanh toán (Payment)</option>
            <option value="REFUND">Hoàn tiền (Refund)</option>
          </select>
        </div>
      </header>

      <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-level-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#0F766E]">progress_activity</span>
          </div>
        ) : (
          <>
            <TransactionTable transactions={transactions} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <button 
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-white disabled:opacity-50 transition-colors"
                >
                  Trước
                </button>
                <span className="text-sm text-[#475569]">Trang {page} / {totalPages}</span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-white disabled:opacity-50 transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
