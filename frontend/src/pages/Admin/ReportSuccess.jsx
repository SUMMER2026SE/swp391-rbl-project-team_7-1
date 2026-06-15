import React from 'react';

export default function AdminReportSuccess() {
  return (
    <div>
{/*  Mock Background Content (Blurred)  */}
<div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden filter blur-md pointer-events-none opacity-50 bg-surface-container-low">
<div className="h-16 border-b border-outline-variant flex justify-between items-center px-gutter">
<div className="h-6 w-48 bg-surface-variant rounded"></div>
<div className="flex space-x-4">
<div className="h-8 w-8 bg-surface-variant rounded-full"></div>
<div className="h-8 w-8 bg-surface-variant rounded-full"></div>
</div>
</div>
<div className="max-w-container-max mx-auto px-gutter py-8 space-y-6">
<div className="h-10 w-64 bg-surface-variant rounded"></div>
<div className="grid grid-cols-3 gap-6">
<div className="h-32 bg-surface-container-highest rounded-lg"></div>
<div className="h-32 bg-surface-container-highest rounded-lg"></div>
<div className="h-32 bg-surface-container-highest rounded-lg"></div>
</div>
<div className="h-64 bg-surface-container-highest rounded-lg mt-8"></div>
</div>
</div>
{/*  Modal Overlay Backdrop  */}
<div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4">
{/*  Success Modal Card  */}
<div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.015)] border border-outline-variant w-full max-w-md overflow-hidden transform transition-all translate-y-0 scale-100 opacity-100 relative">
{/*  Close Button (Optional, but good UX)  */}
<button aria-label="Close modal" className="absolute top-4 right-4 text-[#475569] hover:text-[#0F766E] transition-colors focus:outline-none">
<span className="material-symbols-outlined text-2xl" data-icon="close">close</span>
</button>
<div className="p-8 flex flex-col items-center text-center">
{/*  Success Icon  */}
<div className="w-16 h-16 bg-[#0F766E]/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-[#0F766E]/5">
<span className="material-symbols-outlined text-[#0F766E] text-4xl" data-icon="check_circle" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>check_circle</span>
</div>
{/*  Text Content  */}
<h2 className="font-headline-2xl text-headline-2xl text-[#0F766E] mb-2">Report Ready for Download</h2>
<p className="font-body-base text-body-base text-[#475569] mb-8">Your report has been successfully generated and is ready to be saved to your device.</p>
{/*  File Details  */}
<div className="bg-surface-container-low rounded-lg p-4 w-full flex items-center space-x-4 mb-8 border border-outline-variant/50">
<div className="bg-surface-container-highest p-2 rounded">
<span className="material-symbols-outlined text-[#0F766E]" data-icon="description">description</span>
</div>
<div className="text-left flex-1 min-w-0">
<p className="font-body-base text-body-base font-semibold text-on-surface truncate">Q3_Financial_Summary_2023.csv</p>
<p className="font-body-sm text-body-sm text-[#475569]">1.2 MB</p>
</div>
</div>
{/*  Actions  */}
<div className="flex flex-col sm:flex-row w-full gap-4">
<button className="flex-1 bg-gradient-to-r from-[#475569] to-[#526171] hover:from-[#0F766E] hover:to-[#0F766E] text-white font-body-base text-body-base font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2">
<span className="material-symbols-outlined text-[20px]" data-icon="download">download</span>
<span>Download Now</span>
</button>
<button className="flex-1 bg-white hover:bg-surface-container-low text-[#475569] border border-outline-variant font-body-base text-body-base font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-outline-variant focus:ring-offset-2">
                        Go to Report History
                    </button>
</div>
</div>
</div>
</div>
</div>
  );
}
