import React from 'react';

export default function ArticleVNPayEscrow() {
  return (
    <main className="pt-28 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
{/*  Breadcrumbs  */}
<nav aria-label="Breadcrumb" className="mb-8">
<ol className="flex items-center space-x-2 text-body-sm text-on-surface-variant">
<li>
<a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-[18px]">home</span> Support Hub
                    </a>
</li>
<li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
<li><a className="hover:text-primary transition-colors" href="#">Payments &amp; Billing</a></li>
<li><span className="material-symbols-outlined text-[16px]">chevron_right</span></li>
<li aria-current="page" className="text-on-surface font-semibold">How does VNPay Escrow work?</li>
</ol>
</nav>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Main Content Area  */}
<article className="lg:col-span-8 elite-card border rounded-xl p-6 md:p-8">
<header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
<h1 className="font-headline-2xl text-headline-2xl text-charcoal mb-4">How does VNPay Escrow work?</h1>
<div className="flex items-center gap-4 text-body-sm text-muted-slate">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">update</span> Last updated: 2 days ago</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">visibility</span> 1,245 views</span>
</div>
</header>
<div className="prose prose-slate max-w-none font-body-base text-body-base text-on-surface leading-relaxed space-y-6">
<p className="text-lg text-muted-slate">
                        VNPay Escrow is a secure payment system designed to protect both clients and freelancers during fixed-price contracts. It ensures that funds are available before work begins and are only released when the work is approved.
                    </p>
<h2 className="font-headline-xl text-headline-xl text-on-surface mt-8 mb-4">The Escrow Process</h2>
<div className="space-y-6">
{/*  Step 1  */}
<div className="flex gap-4">
<div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center font-bold text-primary">1</div>
<div>
<h3 className="font-semibold text-lg mb-2">Funding the Milestone</h3>
<p className="text-muted-slate">Before a freelancer begins work on a fixed-price contract, the client must deposit the agreed-upon funds into the VNPay Escrow account for that specific milestone.</p>
</div>
</div>
{/*  Step 2  */}
<div className="flex gap-4">
<div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center font-bold text-primary">2</div>
<div>
<h3 className="font-semibold text-lg mb-2">Work &amp; Submission</h3>
<p className="mb-4 text-muted-slate">The freelancer completes the work and submits it for review through the platform. This action triggers a notification to the client.</p>
<div className="bg-surface-container rounded-lg border border-outline-variant p-2 overflow-hidden mb-4 shadow-sm">
<div className="aspect-video w-full bg-surface-dim rounded flex items-center justify-center relative text-muted-slate">
<div className="absolute inset-0 bg-cover bg-center" data-alt="A clean, modern user interface dashboard showing a 'Submit Work' button and milestone tracking. The interface is light, airy, and uses professional corporate design language with subtle green accents." style={{ "backgroundImage": "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-H1tVRxMWABXGZQIV_Rejddho6BRJAmS9jALTmES4tq1nnJszzQGdRg_7fEBXQ8V_RB4DrzxQIhwcoa_5H5hQjrJPakN8lh6VIPy22he8Rl0bCn78L-MCwFVXtAdg0ipuSf7pHW48ijwaz1ssQBwojype2lsDIyQn8sMgxkNnpNRqgly9IGDHLrUuJfygq2Z_pTObYl4NSY76SRnMzK8Q5c0N3KtCwlLQCRsZsk3lv8NFuRJTNJpF2LYHEh4HZ-ZLHK9P9EwG068')" }}></div>
</div>
<p className="text-center text-body-sm mt-2 italic text-muted-slate">Screenshot: Submitting work for a milestone.</p>
</div>
</div>
</div>
{/*  Step 3  */}
<div className="flex gap-4">
<div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center font-bold text-primary">3</div>
<div>
<h3 className="font-semibold text-lg mb-2">Review &amp; Approval</h3>
<p className="text-muted-slate">The client has 14 days to review the submitted work. They can either approve the milestone, which releases the funds to the freelancer, or request revisions.</p>
<div className="bg-surface-container-low border-l-4 border-tertiary-container p-4 mt-3 rounded-r">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-tertiary-container mt-1">info</span>
<p className="text-body-sm m-0 text-muted-slate">If the client takes no action within 14 days, the funds are automatically released to the freelancer's account.</p>
</div>
</div>
</div>
</div>
</div>
<h2 className="font-headline-xl text-headline-xl text-on-surface mt-10 mb-4">Dispute Resolution</h2>
<p className="text-muted-slate">
                        In the rare event that a client and freelancer cannot agree on the work submitted, either party can initiate a dispute. Our dedicated Trust &amp; Safety team will step in to mediate the situation based on the original contract terms and communications on the platform.
                    </p>
</div>
{/*  Feedback Widget  */}
<div className="mt-12 pt-8 border-t border-outline-variant text-center">
<h3 className="font-semibold text-on-surface mb-4">Was this article helpful?</h3>
<div className="flex justify-center gap-4">
<button className="flex items-center gap-2 px-6 py-2 rounded-full border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors text-muted-slate">
<span className="material-symbols-outlined">thumb_up</span> Yes
                        </button>
<button className="flex items-center gap-2 px-6 py-2 rounded-full border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors text-muted-slate">
<span className="material-symbols-outlined">thumb_down</span> No
                        </button>
</div>
</div>
</article>
{/*  Sidebar  */}
<aside className="lg:col-span-4 space-y-6">
{/*  Related Articles Bento Box  */}
<div className="elite-card border rounded-xl p-6">
<h3 className="font-headline-xl text-headline-xl text-on-surface mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">article</span> Related Articles
                    </h3>
<ul className="space-y-4">
<li>
<a className="group block" href="#">
<h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors text-body-base mb-1">How to setup your payment methods</h4>
<p className="text-body-sm text-on-surface-variant line-clamp-2">Learn how to add bank accounts, credit cards, or PayPal to send or receive funds securely.</p>
</a>
</li>
<li className="pt-4 border-t border-outline-variant">
<a className="group block" href="#">
<h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors text-body-base mb-1">Understanding Fixed-Price Contracts</h4>
<p className="text-body-sm text-on-surface-variant line-clamp-2">A deep dive into how fixed-price contracts differ from hourly contracts and when to use them.</p>
</a>
</li>
<li className="pt-4 border-t border-outline-variant">
<a className="group block" href="#">
<h4 className="font-semibold text-on-surface group-hover:text-primary transition-colors text-body-base mb-1">Filing a Dispute</h4>
<p className="text-body-sm text-on-surface-variant line-clamp-2">Step-by-step guide on what to do if you encounter issues with a milestone delivery or payment.</p>
</a>
</li>
</ul>
</div>
{/*  Contact Support CTA  */}
<div className="bg-emerald-deep text-white rounded-xl p-6 shadow-sm relative overflow-hidden group">
<div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
<h3 className="font-headline-xl text-headline-xl mb-2 relative z-10">Still need help?</h3>
<p className="text-body-sm mb-6 relative z-10 opacity-90">Our Trust &amp; Safety team is available 24/7 to assist you with any escrow or payment issues.</p>
<button className="w-full bg-white text-[#22C55E] font-semibold py-2 px-4 rounded hover:bg-surface-container-low transition-colors shadow-sm relative z-10">
                        Contact Support
                    </button>
</div>
</aside>
</div>
</main>
  );
}
