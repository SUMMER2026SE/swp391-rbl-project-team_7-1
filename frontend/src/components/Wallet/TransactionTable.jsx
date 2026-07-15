import React, { useState, useRef } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../../hooks/useAuth';

export default function TransactionTable({ transactions }) {
  const { user } = useAuth();
  const [selectedTx, setSelectedTx] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const invoiceRef = useRef(null);

  const handleExport = (tx) => {
    setSelectedTx(tx);
    setIsExporting(true);
    
    // Allow state to update and render the template in DOM before capturing
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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center text-[#475569]">
        Không có giao dịch nào phù hợp.
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - ${date.toLocaleDateString('vi-VN')}`;
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'DEPOSIT':
        return <span className="px-2.5 py-1 bg-[#E6F5EE] text-[#10B981] rounded-lg text-[11px] font-bold uppercase tracking-wider">Nạp tiền</span>;
      case 'WITHDRAWAL':
        return <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded-lg text-[11px] font-bold uppercase tracking-wider">Rút tiền</span>;
      case 'PAYMENT':
        return <span className="px-2.5 py-1 bg-[#FDF2F8] text-[#EC4899] rounded-lg text-[11px] font-bold uppercase tracking-wider">Thanh toán</span>;
      case 'ESCROW_DEPOSIT':
        return <span className="px-2.5 py-1 bg-[#FFF7ED] text-[#F97316] rounded-lg text-[11px] font-bold uppercase tracking-wider">Ký quỹ</span>;
      case 'ESCROW_RELEASE':
        return <span className="px-2.5 py-1 bg-[#E6F5EE] text-[#10B981] rounded-lg text-[11px] font-bold uppercase tracking-wider">Nhận tiền</span>;
      case 'REFUND':
        return <span className="px-2.5 py-1 bg-[#F5F3FF] text-[#8B5CF6] rounded-lg text-[11px] font-bold uppercase tracking-wider">Hoàn tiền</span>;
      case 'SERVICE_FEE':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">Phí dịch vụ</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-bold uppercase tracking-wider">{type}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-1 bg-[#E6F5EE] text-[#10B981] rounded-lg text-[11px] font-bold">Thành công</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold">Đang xử lý</span>;
      case 'FAILED':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-[11px] font-bold">Thất bại</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-bold">{status}</span>;
    }
  };

  const getDisplayAmount = (tx) => {
    let isPositive = tx.amount > 0;
    if (['WITHDRAWAL', 'SERVICE_FEE', 'ESCROW_DEPOSIT', 'PAYMENT'].includes(tx.transaction_type)) {
      isPositive = false;
    } else if (['DEPOSIT', 'ESCROW_RELEASE', 'REFUND'].includes(tx.transaction_type)) {
      isPositive = true;
    }
    const absAmount = Math.abs(tx.amount);
    const sign = isPositive ? '+' : '-';
    const colorClass = isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'; 
    return { text: `${sign}${formatCurrency(absAmount)}`, colorClass };
  };

  const cleanDescription = (desc) => {
    if (!desc) return '';
    return desc.replace(/Phí d\?ch v\? n\?n t\?ng/g, 'Phí dịch vụ nền tảng');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 rounded-tl-xl">Mã GD</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500">Loại</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500">Mô tả</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 text-right">Số tiền</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 text-center">Trạng thái</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500">Thời gian</th>
            <th className="p-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 text-center rounded-tr-xl">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const amountInfo = getDisplayAmount(tx);
            const desc = cleanDescription(tx.description);
            return (
              <tr key={tx.transaction_id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                <td className="p-4 text-[13px] font-bold text-slate-600">#{tx.transaction_id}</td>
                <td className="p-4">{getTypeBadge(tx.transaction_type)}</td>
                <td className="p-4 text-[13px] font-medium text-slate-700 max-w-[250px] truncate" title={desc}>{desc}</td>
                <td className={`p-4 text-[14px] font-bold text-right ${amountInfo.colorClass}`}>
                  {amountInfo.text}
                </td>
                <td className="p-4 text-center">{getStatusBadge(tx.status)}</td>
                <td className="p-4 text-[12px] font-medium text-slate-500">{formatDate(tx.created_at)}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleExport(tx)}
                    disabled={isExporting}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors disabled:opacity-50 border border-slate-200 mx-auto shadow-sm"
                    title="Xuất PDF"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Hidden Invoice Template for PDF Export */}
      {selectedTx && (
        <div style={{ position: 'fixed', top: 0, left: '-100vw', opacity: 0, zIndex: -100, pointerEvents: 'none' }}>
          <InvoiceTemplate ref={invoiceRef} transaction={selectedTx} user={user} />
        </div>
      )}
    </div>
  );
}
