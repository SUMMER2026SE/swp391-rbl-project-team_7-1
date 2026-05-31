import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="pt-24 pb-24 overflow-hidden relative bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* Soft Ambient Light Orbs - Luxury Style */}
      <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-sky-200/40 to-teal-100/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-teal-200/30 to-blue-200/30 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-slate-200/50 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Floating Mini Cards - ENLARGED & DETAILED */}
      <div className="absolute top-[10%] left-[5%] w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_30px_60px_rgba(15,118,110,0.15)] border border-white p-4 animate-[float_7s_ease-in-out_infinite] z-0 -rotate-6 hidden md:block group hover:rotate-0 transition-transform duration-500">
        <div className="h-32 rounded-2xl overflow-hidden mb-4 relative">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" alt="Web Dev" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="text-[11px] font-bold text-slate-700">4.9</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
             <span className="material-symbols-outlined text-[20px]">code</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-800">Web Dashboard</div>
            <div className="text-[11px] font-medium text-slate-500">React & Node.js</div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-[18%] right-[8%] w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_35px_70px_rgba(99,102,241,0.15)] border border-white p-4 animate-[float_8s_ease-in-out_infinite_reverse] z-0 rotate-12 hidden lg:block group hover:rotate-0 transition-transform duration-500">
        <div className="h-28 rounded-2xl overflow-hidden mb-4 relative">
          <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80" alt="Design" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="text-[11px] font-bold text-slate-700">5.0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
             <span className="material-symbols-outlined text-[20px]">palette</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-800">UI Redesign</div>
            <div className="text-[11px] font-medium text-slate-500">Figma Prototype</div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-[48%] left-[3%] w-60 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_25px_50px_rgba(14,165,233,0.12)] border border-white p-4 animate-[float_6s_ease-in-out_infinite_1s] z-0 rotate-3 hidden md:block group hover:rotate-0 transition-transform duration-500">
        <div className="h-28 rounded-2xl overflow-hidden mb-4 relative">
           <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" alt="Backend" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center text-sky-600 shadow-sm border border-sky-100">
             <span className="material-symbols-outlined text-[20px]">dns</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-800">API Service</div>
            <div className="text-[11px] font-medium text-slate-500">Python FastAPI</div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-[52%] right-[5%] w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_30px_60px_rgba(245,158,11,0.12)] border border-white p-4 animate-[float_9s_ease-in-out_infinite_2s] z-0 -rotate-12 hidden lg:block group hover:rotate-0 transition-transform duration-500">
        <div className="h-32 rounded-2xl overflow-hidden mb-4 relative">
           <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80" alt="Marketing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
           <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="text-[11px] font-bold text-slate-700">4.8</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
             <span className="material-symbols-outlined text-[20px]">campaign</span>
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-800">Digital Marketing</div>
            <div className="text-[11px] font-medium text-slate-500">SEO & Ads Strategy</div>
          </div>
        </div>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-16">
        
        {/* Hero Text */}
        <div className={`text-center space-y-8 max-w-4xl mx-auto transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#020617] font-extrabold tracking-tight leading-[1.1]">
            Elevate Your Business with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F766E] to-[#2DD4BF]">
              Elite Global Talent.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Connect with top-tier professionals. Execute visionary projects. Secure every transaction with our enterprise-grade VNPay escrow system.
          </p>
        </div>

        {/* Call to Action Buttons (Replaced Search) */}
        <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-200 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Link to="/freelancers" className="w-full sm:w-auto px-8 py-4 bg-[#0F766E] text-white rounded-2xl font-bold text-lg hover:bg-[#0D5E58] transition-all duration-300 shadow-[0_10px_30px_rgba(15,118,110,0.2)] hover:shadow-[0_10px_30px_rgba(15,118,110,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Browse Freelancers
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
          <Link to="/browse-projects" className="w-full sm:w-auto px-8 py-4 bg-white text-[#0F766E] rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all duration-300 border border-teal-100 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            Find Projects
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </Link>
        </div>

        {/* Categories / Tags */}
        <div className={`mt-16 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {['Web Development', 'UI/UX Design', 'Mobile Apps', 'Digital Marketing', 'Data Science', 'Blockchain'].map((tag) => (
            <span key={tag} className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:border-[#0F766E] hover:text-[#0F766E] hover:shadow-md transition-all cursor-pointer">
              {tag}
            </span>
          ))}
        </div>

        {/* Featured Section */}
        <div className={`mt-32 w-full transition-all duration-1000 delay-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#020617] tracking-tight">Featured Projects</h2>
              <p className="text-slate-500 mt-3 text-lg font-medium">Opportunities hand-picked for top professionals.</p>
            </div>
            <Link to="/browse-projects" className="inline-flex items-center gap-2 text-[#0F766E] font-bold hover:text-[#0D5E58] transition-colors group">
              View All Projects
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">east</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_25px_50px_rgba(15,118,110,0.12)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col">
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#0F766E] shadow-sm uppercase tracking-wider">
                  Web Dev
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-extrabold text-2xl text-[#020617] mb-3 line-clamp-1 group-hover:text-[#0F766E] transition-colors">FinTech Analytics</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Looking for a Senior React developer to build a comprehensive analytics dashboard with real-time data visualization and complex state management.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-[#020617]">TechCorp</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Budget</span>
                    <span className="font-extrabold text-lg text-[#0F766E]">$4k - $6k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_25px_50px_rgba(15,118,110,0.12)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col">
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" alt="Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wider">
                  UI/UX Design
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-extrabold text-2xl text-[#020617] mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">Luxury E-Commerce</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Need a modern, conversion-focused redesign for a luxury fashion mobile application targeting high-end clientele.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=44" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-[#020617]">LuxeBrand</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Budget</span>
                    <span className="font-extrabold text-lg text-indigo-600">$2k - $4k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_25px_50px_rgba(15,118,110,0.12)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer flex flex-col">
              <div className="relative h-56 rounded-[1.5rem] overflow-hidden mb-6">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" alt="Code" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-sky-600 shadow-sm uppercase tracking-wider">
                  Backend
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-extrabold text-2xl text-[#020617] mb-3 line-clamp-1 group-hover:text-sky-600 transition-colors">AI Engine API</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">Seeking a Python/FastAPI expert to architect and build a highly scalable recommendation microservice architecture.</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-bold text-[#020617]">StartupX</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Budget</span>
                    <span className="font-extrabold text-lg text-sky-600">$8k - $12k</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Global styles for floating animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />
    </main>
  );
}
