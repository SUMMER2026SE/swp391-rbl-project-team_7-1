import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="pt-24 pb-20 overflow-hidden">
{/*  Hero Section  */}
<section className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
{/*  Text Content  */}
<div className="lg:w-1/2 z-10 space-y-8">
<div className="inline-flex items-center space-x-2 bg-[#F1F5F9] px-4 py-1.5 rounded-full">
<span className="material-symbols-outlined text-primary text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>security</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Secured by VNPay Escrow</span>
</div>
<h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-[#1E293B] font-bold leading-tight">
                    Find Freelancers.<br/>
                    Post Projects.<br/>
<span className="text-[#0F766E]">Work Securely.</span>
</h1>
<p className="font-body-base text-body-base text-on-surface-variant max-w-lg leading-relaxed text-lg">
                    The premium marketplace for top-tier talent and enterprise clients. Experience seamless bidding, guaranteed payments via VNPay Escrow, and intelligent matchmaking powered by our AI Chatbox.
                </p>
<div className="flex flex-col sm:flex-row gap-4 pt-4">
<Link className="bg-gradient-to-r from-[#1E293B] to-[#334155] font-body-base text-body-base font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(15,118,110,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-center active:scale-95 flex items-center justify-center gap-2 text-white" to="/browse-projects">
                        Browse Projects
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
</Link>
<Link className="bg-white border border-[#E2E8F0] text-[#1E293B] font-body-base text-body-base font-semibold py-4 px-8 rounded-full text-center active:scale-95 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" to="/browse-projects">
                        Find Freelancers
                    </Link>
</div>
<div className="flex items-center gap-6 pt-6 border-t border-outline-variant/30">
<div className="flex -space-x-3">
<img alt="User" className="w-10 h-10 rounded-full border-2 border-surface object-cover" data-alt="A professional headshot of a smiling woman in a bright, modern office setting. High key lighting, clean corporate aesthetic, representing a verified premium freelancer." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfTNBxZnwM7Df5KnDTfBIUWOtqYvLd_9t-870mWl2huCJabJFbnRLmjFH0hWzR43dq4hzsa5WSrUakCIC8FYw7QfvzNNeyVzDNA3SHYXz_DIQyVn3Q8gFRXjb4FFPGs79vgvuzo62zb_PH7fAuB6gZDnuQCYT_EG1g_erg7aqtk89PN4MR53B1y5C84d3e43RZb8qQK_rQXCxCFV5xCILXDti4jDNo7PQaE4Xj-0esPp94THdVJyQwkAhrKrkdYuT3u69rdQ4Fito"/>
<img alt="User" className="w-10 h-10 rounded-full border-2 border-surface object-cover" data-alt="A professional headshot of a confident man in a bright, modern office setting. High key lighting, clean corporate aesthetic, representing a verified enterprise client." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfFsF-a2_2CaqSthAAtULSndIzKiTwI1kzzwYbEgN2Qm4dPImRG0zgX_4yrsEkgrEbOVrLdMaAckCi4CIrsquE2L1Qrydb_hiMRiHaAO8pvM3hyiIMXS4llKS7IXV5J1Gl1ZhF8tc1jbELtbhXffbe3VuNO7W-p0rXhzWHuTG2yj9sv_K7fGHAYzSLYUZa0YyIqEVwOmhFd8bvxEcjhnmP6dUugvehTrNwgk1o0BQTBSlDLhxV1UwiZcMxZXiKnNQqOid5a-ZBjQM"/>
<img alt="User" className="w-10 h-10 rounded-full border-2 border-surface object-cover" data-alt="A professional headshot of a young woman with glasses in a bright studio. High key lighting, clean corporate aesthetic, representing a verified premium freelancer." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcNhBB9StmPbqbXRFLhUYl0sxpP9FXnfkmXOidb6VxhVhcdxnUoZSUrbevI4uapfPA_lXfWjSwmltt_yIN_jedWxPpn1QgKLzYLG9u0N4q0jYdTjwlYeeIRV1IDDuKcEs7Q1x40_emdB7hPlLk9cIUY40-1vPtYuP1CubLkU0iQHunTmbqcuuyhPVbxVrLnjyImDrtc-4M0irdMeMQQAbruoDNfIRHkXL9DD6qQ5tbH9DALFOoVVQl6LvFRMDiZtMtwXqa4HQc5K8"/>
</div>
<div className="flex flex-col">
<div className="flex items-center text-primary-container">
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Trusted by 10,000+ professionals</span>
</div>
</div>
</div>
{/*  Visual Graphic / Floating Cards  */}
<div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center">
{/*  Abstract Background Elements  */}
{/*  Main Mockup Image  */}
<div className="relative w-full max-w-md h-full rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.015)] bg-white border border-[#E2E8F0] z-10">
<img alt="Workspace" className="w-full h-full object-cover opacity-90" data-alt="A clean, minimalist desktop workspace featuring a laptop displaying code, a notebook, and a cup of coffee. The lighting is bright and natural, evoking a premium, productive remote work environment with a calm, professional aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzXb6lUu1byGJoeWx1GbfinL_GTOjJIdxsd89TL5m29wDfBuVK2yv8GVHTKtWxnyqkT3F2Vkljryx1TKxYXqc4PimY-hwH1zPjToppYP9GEEahLeI7_jNYJBCYcg0cURBO2c5bA0gMIXZK3lXq3n5PkKzIEnScyiruki022mVv9dUsN_nZje7jfCPY0Vlt33jFKaQ8fKYtw88TWHh4ijddPfPsedXiCqetyJnQHhHzbT0tvRDKknZf79GKwLOFfTDRz4r9ToyeiIs"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent flex items-end p-8">
<div className="text-white w-full">
<div className="flex items-center justify-between mb-2">
<span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Featured Project</span>
<span className="font-semibold">$5,000 - $8,000</span>
</div>
<h3 className="font-headline-xl text-headline-xl font-bold mb-1">Full-Stack FinTech Dashboard</h3>
<p className="text-sm opacity-90 mb-4">React, Node.js, Postgres • 3 months</p>
<button className="w-full bg-white text-on-surface font-semibold py-3 rounded-lg hover:bg-surface-container transition-colors">Bid Now</button>
</div>
</div>
</div>
{/*  Floating Card 1 (Freelancer Preview)  */}
<div className="absolute top-10 -left-10 w-64 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-4 float-1 z-20 flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-300">
<img alt="Freelancer" className="w-12 h-12 rounded-full object-cover" data-alt="A professional headshot of a female software engineer smiling confidently. High key lighting, clean modern aesthetic, conveying trust and expertise." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsDUottDPnpRICiVqYReGGtEAfg2ool9Nb9ZQrivT7TEmGgPA0MOlNVfjJPzM1Id1c6ED37aer_n7G4JRscJXydUqPxCnQ-jCK3JBlUe0GmznJKiRn9LrgptSI3G3mXLEIe7birXEf6MLbLRMnJcgdUCOwafb8Dm5XmU4z6KfhhODStjLVCPnH5VN_rrmNirm7LVOmiIESGlA64rZ9yDx_NVIBiykKvNPnvenB9zeEaJ5Uk4YLA6f_LfkfBqZdYhM9WDSaggyyuks"/>
<div>
<h4 className="font-semibold text-sm text-on-surface">Sarah Jenkins</h4>
<p className="text-xs text-on-surface-variant mb-1">Senior UX Designer</p>
<div className="flex items-center gap-1 text-xs">
<span className="material-symbols-outlined text-primary-container text-[14px]" style={{ "fontVariationSettings": "'FILL' 1" }}>star</span>
<span className="font-semibold">4.9</span>
<span className="text-on-surface-variant">(124 jobs)</span>
</div>
</div>
</div>
{/*  Floating Card 2 (Payment Security)  */}
<div className="absolute bottom-20 -right-8 w-56 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-4 float-2 z-20 hover:-translate-y-0.5 transition-all duration-300">
<div className="flex items-center gap-3 mb-2">
<div className="inline-flex items-center space-x-2 bg-[#F1F5F9] px-4 py-1.5 rounded-full">
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
</div>
<h4 className="font-semibold text-sm text-on-surface">Payment Secured</h4>
</div>
<p className="text-xs text-on-surface-variant">Funds held safely in VNPay Escrow until milestone approval.</p>
</div>
</div>
</section>
</main>
  );
}
