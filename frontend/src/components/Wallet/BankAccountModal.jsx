import React, { useState, useEffect, useRef } from 'react';

const BANK_LIST = [
  { value: "Vietcombank", label: "Vietcombank (VCB)" },
  { value: "Techcombank", label: "Techcombank (TCB)" },
  { value: "BIDV", label: "BIDV" },
  { value: "VietinBank", label: "VietinBank" },
  { value: "Agribank", label: "Agribank" },
  { value: "MB Bank", label: "MB Bank (MB)" },
  { value: "ACB", label: "ACB" },
  { value: "VPBank", label: "VPBank" },
  { value: "TPBank", label: "TPBank" },
  { value: "Sacombank", label: "Sacombank" },
  { value: "VIB", label: "VIB" },
  { value: "HDBank", label: "HDBank" },
  { value: "SHB", label: "SHB" }
];

export default function BankAccountModal({ isOpen, onClose, initialData, onSuccess }) {
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        bank_name: initialData.bank_name || '',
        account_number: initialData.account_number || '',
        account_holder_name: initialData.account_holder_name || ''
      });
      const matchedBank = BANK_LIST.find(b => b.value === initialData.bank_name);
      setSearchTerm(matchedBank ? matchedBank.label : initialData.bank_name || '');
    } else {
      setFormData({ bank_name: '', account_number: '', account_holder_name: '' });
      setSearchTerm('');
    }
    setIsDropdownOpen(false);
  }, [initialData, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        // Revert search term to match the currently selected bank value label
        const selected = BANK_LIST.find(b => b.value === formData.bank_name);
        setSearchTerm(selected ? selected.label : '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [formData.bank_name]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredBanks = BANK_LIST.filter(bank => 
    bank.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBank = (bank) => {
    setFormData(prev => ({ ...prev, bank_name: bank.value }));
    setSearchTerm(bank.label);
    setIsDropdownOpen(false);
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
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Tên ngân hàng
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Tìm và chọn ngân hàng..."
                className="w-full px-4 py-2 pr-10 border border-[#E2E8F0] rounded-lg focus:ring-1 focus:ring-[#0F766E] focus:border-[#0F766E] outline-none transition-colors bg-white cursor-text"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  keyboard_arrow_down
                </span>
              </button>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <div
                      key={bank.value}
                      onClick={() => handleSelectBank(bank)}
                      className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-teal-50 transition-colors flex items-center justify-between ${
                        formData.bank_name === bank.value ? 'bg-teal-50/50 font-semibold text-[#0F766E]' : 'text-slate-700'
                      }`}
                    >
                      <span>{bank.label}</span>
                      {formData.bank_name === bank.value && (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400 text-center">
                    Không tìm thấy ngân hàng nào
                  </div>
                )}
              </div>
            )}
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
