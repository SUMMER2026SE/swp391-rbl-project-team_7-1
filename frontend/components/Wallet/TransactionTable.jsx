import React from 'react';

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center text-[#475569]">
        Không có giao dịch nào phù hợp.
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Thành công</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Đang chờ</span>;
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Thất bại</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className="p-4 font-semibold text-sm text-[#475569]">Mã GD</th>
            <th className="p-4 font-semibold text-sm text-[#475569]">Loại</th>
            <th className="p-4 font-semibold text-sm text-[#475569]">Mô tả</th>
            <th className="p-4 font-semibold text-sm text-[#475569]">Số tiền</th>
            <th className="p-4 font-semibold text-sm text-[#475569]">Trạng thái</th>
            <th className="p-4 font-semibold text-sm text-[#475569]">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors">
              <td className="p-4 text-sm font-medium text-[#334155]">#{tx.transaction_id}</td>
              <td className="p-4 text-sm text-[#475569]">{tx.transaction_type}</td>
              <td className="p-4 text-sm text-[#475569]">{tx.description}</td>
              <td className={`p-4 text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </td>
              <td className="p-4 text-sm">{getStatusBadge(tx.status)}</td>
              <td className="p-4 text-sm text-[#475569]">{formatDate(tx.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
