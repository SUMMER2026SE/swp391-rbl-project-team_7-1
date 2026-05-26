import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Projects from './pages/Projects';
import FreelancerDashboard from './pages/FreelancerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function LandingPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      
      {/* Navigation */}
      <nav className="bg-surface-container-lowest fixed w-full top-0 z-50 transition-all duration-300 border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-xl">
            <Link className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-2" to="/">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                widgets
              </span>
              FJMS
            </Link>
            
            <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:border-primary transition-colors w-64">
              <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
              <input
                className="bg-transparent border-none outline-none w-full font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:ring-0 p-0"
                placeholder="Search projects or experts..."
                type="text"
              />
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-lg">
            <Link className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md transition-colors duration-200 hover:text-primary" to="/projects">
              Marketplace
            </Link>
            <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/login">
              Proposals
            </Link>
            <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/login">
              Messages
            </Link>
            <Link className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors duration-200" to="/">
              Resources
            </Link>
          </div>

          <div className="flex items-center gap-md">
            <Link className="hidden md:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200" to="/login">
              Login
            </Link>
            <Link className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:bg-primary-container transition-colors duration-200 shadow-sm active:scale-95 active:opacity-80 inline-flex items-center justify-center" to="/register">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-xl">
        
        {/* Hero Section */}
        <section className="relative w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-xl md:py-[80px] overflow-hidden rounded-3xl mt-md bg-surface-container-low">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-colors-primary-container)_0%,_transparent_40%)]"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-xl items-center">
            
            <div className="flex flex-col gap-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container/10 border border-tertiary/20 w-fit">
                <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                <span className="font-label-sm text-label-sm text-tertiary">Premium Talent Network</span>
              </div>
              
              <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-on-surface">
                Find the Perfect Expert for Your <span className="text-primary">Next Big Project</span>
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Connect with top-tier freelance professionals. Secure payments, guaranteed quality, and seamless project management—all in one high-end marketplace.
              </p>
              
              <div className="flex flex-wrap gap-md mt-sm">
                <Link className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-xl hover:bg-primary-container transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 group cursor-pointer" to="/projects">
                  Find Work
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link className="bg-surface-container-lowest text-primary border border-outline-variant font-label-md text-label-md px-8 py-3 rounded-xl hover:border-primary hover:bg-surface-container-lowest/50 transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer" to="/register">
                  Hire Freelancer
                </Link>
              </div>
            </div>

            {/* Right graphic space */}
            <div className="hidden lg:block relative h-[500px] w-full rounded-2xl overflow-hidden border border-outline-variant/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-high to-surface-container-lowest"></div>
              <img
                alt="Professional workspace"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVgbhF5Y6oTtWd9wglOXWQgHYckUuNe786FnQIRvuu4itQgS_cSt4mONU1Fe-8EveqIcyE6L92NPzyRF_Q-sGVckTdp7wczVtUg8gkN9ppAaZsmLMlTSqjfz187Dnz4qpxwY92XZ8mAWi0ZWHs77bZs7xtSdeKqxYu4gvbUuNSoAa3RT8Ept4L4pFroJw-TmoEK7leEfzvhgKVpLnw3BynaX40DCYspulHGxwHEBMfy-Tmn9AwZU7JfOXADngPFUzJPVzGyKnLEWZ9"
              />
              <div className="absolute bottom-lg right-lg glass-card p-lg rounded-xl max-w-xs shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">AR</div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Alex Rivers</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">UI/UX Architect</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-sm text-label-sm">5.0 (124 reviews)</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Stats Section */}
        <section className="py-xl px-margin-mobile md:px-gutter max-w-container-max mx-auto border-b border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
            <div className="flex flex-col items-center justify-center text-center py-sm md:py-0">
              <div className="font-headline-lg text-headline-lg text-primary mb-1">50k+</div>
              <div className="font-body-md text-body-md text-on-surface-variant">Verified Experts</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center py-sm md:py-0">
              <div className="font-headline-lg text-headline-lg text-primary mb-1">50 tỷ+</div>
              <div className="font-body-md text-body-md text-on-surface-variant">Đã Trả Cho Freelancer</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center py-sm md:py-0">
              <div className="font-headline-lg text-headline-lg text-primary mb-1">99%</div>
              <div className="font-body-md text-body-md text-on-surface-variant">Project Success Rate</div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-xl px-margin-mobile md:px-gutter max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Explore Categories</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Discover top talent across specialized domains.</p>
            </div>
            <Link className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container transition-colors" to="/register">
              View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            <Link className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-sm transition-all duration-300 flex flex-col items-start gap-md" to="/register">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">code</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Web Dev</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">1,240 Experts</div>
              </div>
            </Link>

            <Link className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-sm transition-all duration-300 flex flex-col items-start gap-md" to="/register">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">design_services</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">UI/UX Design</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">850 Experts</div>
              </div>
            </Link>

            <Link className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-sm transition-all duration-300 flex flex-col items-start gap-md" to="/register">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">AI Services</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">420 Experts</div>
              </div>
            </Link>

            <Link className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg hover:border-primary hover:shadow-sm transition-all duration-300 flex flex-col items-start gap-md" to="/register">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">Data Science</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">610 Experts</div>
              </div>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-xl bg-surface mt-xl border-y border-outline-variant/30">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="text-center mb-xl max-w-2xl mx-auto">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Built for Serious Professional Engagements</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">We provide the infrastructure required for high-stakes projects, ensuring security and clarity at every step.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-lg">
              <div className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[80px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">VNPay Escrow Protection</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Funds are securely held in escrow via VNPay until project milestones are formally approved, protecting both parties.</p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[80px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
                  <span className="material-symbols-outlined text-[20px]">file_present</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Protected Work Submission</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">A structured pipeline ensures deliverables are tracked, versioned, and protected against unauthorized use.</p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-lg border border-outline-variant shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[80px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-md">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">AI-ChatBox Support</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">AI chatbot that provides instant user support for all system-related issues.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full border-t border-outline-variant">
        <div className="w-full py-xl px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-headline-sm text-headline-sm text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>widgets</span>
              FJMS
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              © {new Date().getFullYear()} FJMS. All rights reserved.
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-lg">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Privacy Policy</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Terms of Service</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Support</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Contact Us</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        {/* Placeholder for other routes */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">404 - Page Under Construction</h2>
            <p className="mb-4">This route will be implemented soon in the next development phase.</p>
            <Link to="/" className="text-primary font-semibold hover:underline">Go back home</Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
