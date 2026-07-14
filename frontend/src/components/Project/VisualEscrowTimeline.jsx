import React from 'react';
import { CheckCircle2, ShieldCheck, CreditCard, UploadCloud, Banknote } from 'lucide-react';

export default function VisualEscrowTimeline({ contract, hasSubmissions }) {
  // Determine the current step based on contract status and submissions
  let currentStep = 1;
  
  // Assuming contract status goes: DRAFT/PENDING -> FUNDED -> COMPLETED (or RELEASED)
  if (contract?.status === 'COMPLETED' || contract?.status === 'RELEASED') {
    currentStep = 4;
  } else if (hasSubmissions) {
    currentStep = 3;
  } else if (contract?.status === 'FUNDED') {
    currentStep = 2;
  }

  const steps = [
    {
      id: 1,
      title: 'Chuyển khoản (VNPay)',
      description: 'Nhà tuyển dụng thanh toán',
      icon: <CreditCard size={20} />,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Ví Ký quỹ (Escrow)',
      description: 'Tiền khóa tạm thời an toàn',
      icon: <ShieldCheck size={20} />,
      color: 'amber'
    },
    {
      id: 3,
      title: 'Nộp bài làm',
      description: 'Freelancer bàn giao sản phẩm',
      icon: <UploadCloud size={20} />,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Mở khóa tiền',
      description: 'Tiền chuyển về ví Freelancer',
      icon: <Banknote size={20} />,
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[#0F766E] mt-0.5">account_balance_wallet</span>
        <h3 className="text-lg font-bold text-slate-800">Tiến trình dòng tiền Ký quỹ (Escrow)</h3>
      </div>
      
      <div className="relative flex flex-col md:flex-row justify-between w-full mt-8 mb-4">
        {/* Connecting Line background */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-slate-100 hidden md:block rounded-full z-0"></div>
        {/* Connecting Line active */}
        <div 
          className="absolute top-6 left-6 h-1 bg-[#0F766E] hidden md:block rounded-full z-0 transition-all duration-700 ease-in-out"
          style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1 mb-8 md:mb-0">
              {/* Mobile connecting line */}
              {index !== steps.length - 1 && (
                <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-slate-100 md:hidden z-0"></div>
              )}
              {index !== steps.length - 1 && currentStep > step.id && (
                <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-[#0F766E] md:hidden z-0 transition-all duration-700 ease-in-out"></div>
              )}

              <div 
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ease-in-out bg-white z-10
                  ${isCompleted ? `border-${step.color}-500 text-${step.color}-500 bg-${step.color}-50` : ''}
                  ${isCurrent ? 'border-[#0F766E] bg-[#0F766E] text-white ring-4 ring-teal-50 shadow-md scale-110' : ''}
                  ${isPending ? 'border-slate-200 text-slate-300' : ''}
                `}
              >
                {isCompleted ? <CheckCircle2 size={24} /> : step.icon}
              </div>
              
              <div className={`text-center mt-4 transition-all duration-300 ${isCurrent ? 'transform -translate-y-1' : ''}`}>
                <h4 className={`text-sm font-bold ${isCurrent ? 'text-slate-800' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {step.title}
                </h4>
                <p className={`text-xs mt-1 px-2 ${isCurrent ? 'text-[#0F766E] font-medium' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                  {step.description}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-teal-50 text-[#0F766E] text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse border border-teal-100">
                    Hiện tại
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
