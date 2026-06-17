import React, { useState, useEffect } from 'react';

export default function BankAccountModal({ isOpen, onClose, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        bank_name: initialData.bank_name || '',
        account_number: initialData.account_number || '',
        account_holder_name: initialData.account_holder_name || ''
      });
    } else {
      setFormData({ bank_name: '', account_number: '', account_holder_name: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.bank_name || !formData.account_number || !formData.account_holder_name) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isUpdating = !!initialData;
      const url = isUpdating 
        ? `http://localhost:5000/api/bank-account/${initialData.bank_account_id}`
        : 'http://localhost:5000/api/bank-account';
      
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi lưu thông tin tài khoản.');
      }

      onSuccess(data.bankAccount);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#475569] hover:text-[#0F766E] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-xl font-bold text-[#334155] mb-4">
          {initialData ? 'Cập nhật tài khoản ngân hàng' : 'Thêm tài khoản ngân hàng'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Tên ngân hàng
            </label>
            <select
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors bg-white cursor-pointer"
              required
            >
              <option value="" disabled>-- Chọn ngân hàng --</option>
              <option value="Vietcombank">Vietcombank (VCB)</option>
              <option value="Techcombank">Techcombank (TCB)</option>
              <option value="BIDV">BIDV</option>
              <option value="VietinBank">VietinBank</option>
              <option value="Agribank">Agribank</option>
              <option value="MB Bank">MB Bank (MB)</option>
              <option value="ACB">ACB</option>
              <option value="VPBank">VPBank</option>
              <option value="TPBank">TPBank</option>
              <option value="Sacombank">Sacombank</option>
              <option value="VIB">VIB</option>
              <option value="HDBank">HDBank</option>
              <option value="SHB">SHB</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Số tài khoản
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="VD: 1903456789..."
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Tên chủ tài khoản
            </label>
            <input
              type="text"
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
              placeholder="VD: NGUYEN VAN A"
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d615b] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
