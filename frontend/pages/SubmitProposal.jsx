import React from 'react';

export default function SubmitProposal() {
  return (
    <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop overflow-y-auto bg-slate-50">
      <div className="max-w-container-max mx-auto py-10 px-6">
        {/*  Header  */}
        <div className="mb-10">
          <h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-slate-800 mb-2">Nộp Đề Xuất</h1>
          <p className="text-base text-slate-600 max-w-2xl">
            Bạn đang nộp đề xuất cho dự án <strong className="text-on-surface text-slate-800">Thiết kế UI/UX Bảng điều khiển Doanh nghiệp</strong>. Hãy dành thời gian viết một đề xuất hấp dẫn.
          </p>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/*  Left Form Canvas (8 cols)  */}
          <div className="md:col-span-8 flex flex-col gap-8">
            {/*  Terms & Basics Card  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">monetization_on</span> Điều khoản & Thời gian
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Giá thầu (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium font-bold text-sm">VNĐ</span>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-14 pr-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base font-medium" id="bid-input" placeholder="Ví dụ: 15.000.000" type="number"/>
                  </div>
                  <p className="text-sm font-medium text-[#0F766E] mt-2 text-right">Ngân sách dự kiến: 50Tr - 80Tr</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Thời gian ước tính</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base appearance-none cursor-pointer">
                    <option disabled="" selected="" value="">Chọn thời gian...</option>
                    <option>Dưới 1 tháng</option>
                    <option>1 đến 3 tháng</option>
                    <option>3 đến 6 tháng</option>
                    <option>Hơn 6 tháng</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/*  Cover Letter Card  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">description</span> Thư giới thiệu (Cover Letter)
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">Giới thiệu bản thân và giải thích lý do tại sao bạn là ứng cử viên sáng giá cho công việc này.</p>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all text-base resize-y" placeholder="Chào bạn, tôi vừa hoàn thành một dự án tương tự..." rows="8"></textarea>
            </div>
            
            {/*  Milestones Bento Section  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F766E]">flag</span> Giai đoạn (Milestones)
                </h2>
                <button type="button" className="text-sm font-bold text-[#0F766E] bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                  + Thêm Giai đoạn
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="col-span-7">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Tên giai đoạn</label>
                    <input className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all" placeholder="Ví dụ: Thiết kế Wireframe" type="text" defaultValue="Thiết kế Wireframe"/>
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Số tiền (VNĐ)</label>
                    <input className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all" placeholder="0" type="number" defaultValue="5000000"/>
                  </div>
                  <div className="col-span-1 flex justify-end mt-4">
                    <button type="button" className="text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/*  Attachments & Portfolio  */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F766E]">attach_file</span> Tài liệu đính kèm
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-6">Đính kèm các dự án tương tự hoặc portfolio của bạn để tăng khả năng được nhận.</p>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-[#0F766E] transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[32px] text-slate-600 mb-2">cloud_upload</span>
                <p className="text-base text-slate-800 mb-1">Kéo thả file vào đây hoặc click để tải lên</p>
                <p className="text-sm font-medium text-slate-600">PDF, JPG, PNG tối đa 10MB</p>
              </div>
            </div>
          </div>
          
          {/*  Right Summary Sidebar (4 cols)  */}
          <div className="md:col-span-4 relative">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-800 text-base">Tổng quan Đề xuất</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Giá thầu của bạn</span>
                    <span className="font-bold text-slate-800">15.000.000 đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Phí nền tảng (10%)</span>
                    <span className="font-bold text-slate-800">- 1.500.000 đ</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-800 font-bold">Thực nhận ước tính</span>
                    <span className="font-bold text-lg text-[#0F766E]">13.500.000 đ</span>
                  </div>
                  
                  <div className="pt-6 mt-4">
                    <button type="button" className="w-full bg-[#0F766E] text-white text-base font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-[#0D5E58] transition-all duration-300 active:scale-[0.98] border-none flex items-center justify-center gap-2">
                      Gửi Đề xuất <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                    <button type="button" className="w-full mt-3 bg-white border border-slate-200 text-slate-600 text-sm font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all">
                      Hủy bỏ
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-[#0F766E] text-[20px]">gpp_good</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Bạn được bảo vệ bởi <strong className="text-slate-800">VNPay Escrow</strong>. Tiền sẽ được khách hàng nạp trước khi dự án bắt đầu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
