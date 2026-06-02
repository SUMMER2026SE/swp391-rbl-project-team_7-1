import React from 'react';

export default function MessagesFreelancer() {
  return (
    <main className="flex-1 h-full flex flex-col bg-slate-50">

      {/*  Messages Dual Pane Layout  */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/*  Left Pane: Conversation List  */}
        <aside className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden shrink-0">
          {/*  Search  */}
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors" placeholder="Tìm kiếm tin nhắn..." type="text"/>
            </div>
          </div>
          {/*  List  */}
          <div className="flex-1 overflow-y-auto">
            {/*  Active Card  */}
            <div className="p-4 border-l-4 border-[#0F766E] bg-slate-50 hover:bg-[#E2E8F0]/30 transition-colors cursor-pointer border-b border-slate-200">
              <div className="flex gap-3">
                <div className="relative">
                  <img alt="Marcus Johnson" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQC38KxfAqaGEdfcmvr6s2tOW5WvMn2n8_dPFIZKH8KCCovQWZkBKme_54X85yrvk0gvQjdRa_BGgWPaP5DGdaDzjPl3dInHkEeGm7nNfpjlAy8quNLi3UztakmtPme5J7e4EnV4mljVId4ejunVyhI_uT2bR_46Hwf-U3n39cjGAMuSFZteeaAmG5HE-XWoXgkfLqGf8kWZ3l_9C0ChuPYbVV6-E7o-EWNnvRMvjCZevmCCeWNkBY37MI1GMR-qXcnoqMj0Y0auE"/>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0F766E] border-2 border-[#F8FAFC] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-headline-xl text-body-base font-semibold text-slate-800 truncate">Marcus Johnson</h3>
                    <span className="font-label-caps text-[10px] text-[#0F766E]">10:42 SA</span>
                  </div>
                  <div className="font-body-sm text-[12px] text-slate-600 font-medium mb-1 truncate">Thiết kế lại Bảng điều khiển Doanh nghiệp</div>
                  <p className="font-body-sm text-sm text-slate-600 truncate">Trông tuyệt lắm! Bạn có thể gửi liên kết Figma không?</p>
                </div>
              </div>
            </div>
            {/*  Inactive Card 1  */}
            <div className="p-4 border-l-4 border-transparent hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200">
              <div className="flex gap-3">
                <div className="relative">
                  <img alt="Sarah Chen" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of an Asian woman in a business casual outfit, looking thoughtfully at the camera." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3zlubYBZ3hncYtUL1GHSNMo7qa2TvPO1YNZltWJXZbTbEq8k79XmaoyHs53FTbaPB_QRf6yxtAHjvQXjpI6J8b2shVJkImkAmpHZ9_IcTLQjXq89Ivm2pVNtsCoi7uXeMsg9Nd7LiASWrQhb_fX9Y7nDMkbiQSMgNRiBd_ydkAygyZe8QHil6nGfQ2zuoFH_K4oeSSmhS7p85EQkWOJgVBeWd1cjnBWa4r80qk1xGvGqzlvbxsXfleQoA40kz3qGGWT7UBJuC2o"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-headline-xl text-body-base font-semibold text-slate-800 truncate">Sarah Chen</h3>
                    <span className="font-label-caps text-[10px] text-slate-600">Hôm qua</span>
                  </div>
                  <div className="font-body-sm text-[12px] text-slate-600 mb-1 truncate">Ứng dụng Di động Fintech</div>
                  <p className="font-body-sm text-sm text-slate-600 truncate">Chúng tôi đã phê duyệt các giai đoạn mới nhất.</p>
                </div>
              </div>
            </div>
            {/*  Inactive Card 2  */}
            <div className="p-4 border-l-4 border-transparent hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-200">
              <div className="flex gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 font-headline-xl text-body-base font-bold">DR</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-headline-xl text-body-base font-semibold text-slate-800 truncate">David Rodriguez</h3>
                    <span className="font-label-caps text-[10px] text-slate-600">Thứ Hai</span>
                  </div>
                  <div className="font-body-sm text-[12px] text-slate-600 mb-1 truncate">Xây dựng Thương hiệu Thương mại Điện tử</div>
                  <p className="font-body-sm text-sm text-slate-600 truncate">Cảm ơn vì đã cập nhật. Chúng ta sẽ liên lạc vào tuần tới.</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/*  Right Pane: Active Chat Window  */}
        <section className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden relative">
          {/*  Chat Header  */}
          <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <img alt="Marcus Johnson" className="w-10 h-10 rounded-full object-cover" data-alt="A professional headshot of a mature man in a sharp grey suit, smiling confidently." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuRmdH0pmUk4CUFA7GVfdB_QgRHfxgkRBL8gC84oFHuxGkaTBYbQGgaJlnXAnzyu9smaPGQC1O8q5S461ZP2FYyu5HAWCB1184uIluz0IzllNRz-ObM1Ddz2Z5eA-Y1ePqdbCCfM6MMiDyEFFlkXJqIAcZsMWqilWGXBcrDITab2hdPkK9r7lZdVTmXfouQRuciYnlnpUbxzVDZK7lKBlXRB0QVKKm5OM9H3kk-8dq0UM-DpCRtsoIWXi5JIq-EyJXMPhSCFCCBEg"/>
              <div>
                <h2 className="font-headline-xl text-body-base font-semibold text-slate-800">Marcus Johnson</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#0F766E] rounded-full"></div>
                  <span className="font-body-sm text-[12px] text-slate-600">Đang trực tuyến • Trưởng nhóm thiết kế UI/UX</span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white border border-transparent text-sm font-medium font-semibold py-2 px-4 rounded-2xl transition-all hover:-translate-y-[1px] hover:shadow-sm">
              Xem Dự án
            </button>
          </div>
          {/*  Chat History  */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
            {/*  Date Divider  */}
            <div className="flex items-center justify-center">
              <span className="bg-[#E2E8F0] text-slate-600 font-label-caps text-[10px] px-3 py-1 rounded-full">HÔM NAY</span>
            </div>
            {/*  Employer Message (Gray)  */}
            <div className="flex gap-4 max-w-[80%]">
              <img alt="Marcus Johnson" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8HmHJcnrB-_zZ4oWacG9OTeL65c8Vo_kJc6J_X7O0u97vFVJGDINe9MyCoIizF9E2PioDbKjGwStuC925yCyCe60Ci9hcxAacK5pby7VkBsYZ7DTfDlZOpcWYPAZLcMMm-hR3F4pp6dDi2KTaD05gO_C9u0YrU6F5EEfDB7fLgeLtm0FXBsb5Lw0QBQNelOyFJxxegHiZhR_t7DKZXSMVvzWkSoku9uaWCJyS33fXgfqW4Y7j44UJReky1WDiCrEHWf3D7LTUoY8"/>
              <div>
                <div className="bg-white border border-slate-200 text-slate-800 text-sm font-medium p-4 rounded-2xl rounded-tl-sm shadow-sm">
                  Chào bạn! Tôi đang xem xét các wireframe ban đầu cho Thiết kế lại Bảng điều khiển Doanh nghiệp.
                </div>
                <div className="font-label-caps text-[10px] text-slate-600 mt-1 ml-1">10:30 SA</div>
              </div>
            </div>
            {/*  Employer Message (Gray)  */}
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 shrink-0"></div> {/*  Spacer for avatar alignment  */}
              <div>
                <div className="bg-white border border-slate-200 text-slate-800 text-sm font-medium p-4 rounded-2xl rounded-tl-sm shadow-sm">
                  Bố cục trông rất chắc chắn. Khách hàng đã đặc biệt hỏi về các thành phần trực quan hóa dữ liệu trên chế độ xem chính.
                </div>
                <div className="font-label-caps text-[10px] text-slate-600 mt-1 ml-1">10:31 SA</div>
              </div>
            </div>
            {/*  Freelancer Message  */}
            <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
              <img alt="Freelancer profile photo" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_5AMUepKN2pAFl5jn7PPkFfAYjQ7MXQRxVSmZiXMpKPQTsqycFxkBQd-SogzedBSKPapICapXE6nljrdZWmldR-PGaSsuHpBd_27hSSLGTvzL7LDUIiOL__wJO-3KbAIdg2E9Y8LEVR-VbcWD9EAMtSVi8rFNaK3R6wKov9m3kqF_Aj_CdHEifi51QSk2HEnfOvV-o2Zm-5j2GP3XG5QnPUr0NDBKiaTD7lK8joEasbpkzkgTwGRo36OVaF4mfd0jeiqQwOGsxyw"/>
              <div className="flex flex-col items-end">
                <div className="bg-[#0F766E] text-white text-sm font-medium p-4 rounded-2xl rounded-tr-sm shadow-sm">
                  Chào Marcus! Cảm ơn phản hồi của bạn. Tôi đã tập trung vào việc giữ cho các biểu đồ đó rõ ràng nhất có thể, tuân theo hệ thống thiết kế mới mà chúng ta đã thống nhất.
                </div>
                <div className="font-label-caps text-[10px] text-slate-600 mt-1 mr-1">10:38 SA</div>
              </div>
            </div>
            {/*  Employer Message (Gray)  */}
            <div className="flex gap-4 max-w-[80%]">
              <img alt="Marcus Johnson" className="w-8 h-8 rounded-full object-cover shrink-0 mt-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEPa-D8MLPh62quX1M91kbvpKUsCeXW7Af6gyJWdgSo9r5BtQEt-bHfgQ9Ny8pEKeAbRv2Tx9w8BKuKumqnJSCEGdYYwOaXgWNwq87bXY29itJJr7NxizYdhF8d5hd83uqGPYNpL6F77_EbWMOkHtX045evP6v2MBgSgL0XeYIz4EsgflSj7rDEjK25In8sdynX7sB-404ixtZhuMCTeCkJn1tvS9bqo3NGPBMjUIBbZzrDuxST_ddJpWyPW22Mu5m4jeRMH7XPqE"/>
              <div>
                <div className="bg-white border border-slate-200 text-slate-800 text-sm font-medium p-4 rounded-2xl rounded-tl-sm shadow-sm">
                  Trông tuyệt lắm! Bạn có thể gửi liên kết Figma không? Tôi muốn xem qua các phần tương tác trước cuộc gọi của chúng ta.
                </div>
                <div className="font-label-caps text-[10px] text-slate-600 mt-1 ml-1">10:42 SA</div>
              </div>
            </div>
          </div>
          {/*  Chat Input Area  */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 z-10">
            <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition-all">
              <button className="p-2 text-slate-600 hover:text-[#0F766E] transition-colors rounded-2xl hover:bg-white shrink-0 mb-0.5">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm font-medium text-slate-800 py-2.5 max-h-32 min-h-[44px]" placeholder="Nhập tin nhắn của bạn..." rows="1" style={{ "fieldSizing": "content" }}></textarea>
              <button className="p-2 bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white rounded-2xl transition-colors shrink-0 mb-0.5 shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
          {/*  Floating AI Chatbox (Assistant)  */}
          <div className="absolute bottom-24 right-6 w-72 bg-white/90 backdrop-blur-[10px] border border-slate-200 rounded-[24px] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5 z-20 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0]/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0F766E] text-sm">smart_toy</span>
              </div>
              <h4 className="font-headline-xl text-sm font-semibold text-slate-800">Trợ lý FJMS</h4>
              <button className="ml-auto text-slate-600 hover:text-slate-800 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <p className="font-body-sm text-[13px] leading-relaxed text-slate-600 mb-4">
              Chào bạn! Dựa trên cuộc trò chuyện của bạn, Marcus đang tìm kiếm nguyên mẫu Figma. Bạn có muốn chia sẻ liên kết hồ sơ năng lực của mình không?
            </p>
            <button className="w-full bg-gradient-to-b from-[#475569] to-[#526171] hover:bg-[#0F766E] text-white font-body-sm text-sm font-semibold py-2 px-4 rounded-2xl transition-colors border border-transparent">
              Chia sẻ Hồ sơ
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
