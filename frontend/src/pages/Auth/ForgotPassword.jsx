import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);

      setToastMsg('Mã xác thực đã được gửi đến email của bạn!');
      setTimeout(() => {
        setStep(2);
        setToastMsg('');
      }, 1500);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email, otp, newPassword);

      setToastMsg('Mật khẩu đã được thay đổi thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-[#E0F2FE] to-white p-4 sm:p-6 antialiased relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] rounded-full border-[1px] border-sky-300 absolute"></div>
        <div className="w-[900px] h-[900px] rounded-full border-[1px] border-sky-300 absolute"></div>
        <div className="w-[1200px] h-[1200px] rounded-full border-[1px] border-sky-200 absolute"></div>
      </div>
      
      {/* Soft Cloud-like Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-100/60 rounded-full blur-[120px] pointer-events-none"></div>

      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white text-[#0F766E] px-6 py-4 rounded-2xl shadow-xl border border-sky-100 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Split-Screen Container */}
      <main className="w-full max-w-5xl z-10 flex flex-col md:flex-row bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[600px] border border-white/50 relative">
        
        {/* Left Side: Branding Panel (Luxury Dark Teal) */}
        <div className="md:w-[45%] bg-gradient-to-br from-[#0F766E] via-[#0D5E58] to-[#042F2E] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden z-20 hidden md:flex border-r border-white/10">
          
          {/* Glassmorphism Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl"></div>
          
          <div className="absolute top-1/4 right-[-20%] w-64 h-64 border border-white/10 rounded-full"></div>
          <div className="absolute bottom-1/4 left-[-20%] w-48 h-48 border border-white/10 rounded-full"></div>

          <div className="text-center z-10">
            <Link to="/">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300 border border-white/20 cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-white">lock_reset</span>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Khôi phục Mật khẩu</h2>
            
            <p className="text-teal-50 text-sm leading-relaxed max-w-[260px] mx-auto font-medium opacity-90">
              Đừng lo lắng, việc quên mật khẩu là bình thường. Chúng tôi sẽ giúp bạn truy cập lại tài khoản một cách an toàn.
            </p>
          </div>
          
          {/* Bottom Trust Indicators */}
          <div className="absolute bottom-8 w-full flex justify-center gap-6 text-teal-100/80">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Bảo vệ</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">sync_lock</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Mã hóa</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[55%] bg-white/60 p-10 md:p-14 flex flex-col justify-center relative z-10 overflow-hidden">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden text-center mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#0F766E]/10 rounded-2xl flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-3xl">lock_reset</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              {step === 1 ? 'Quên mật khẩu?' : 'Tạo mật khẩu mới'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {step === 1 ? 'Nhập địa chỉ email của bạn để nhận mã OTP.' : 'Nhập mã OTP được gửi tới email và mật khẩu mới của bạn.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="relative min-h-[300px]">
            {/* Step 1: Send OTP Form */}
            <form onSubmit={handleSendEmail} className={`space-y-4 absolute inset-0 w-full transition-all duration-500 ease-in-out ${step === 1 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                  Địa chỉ Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all hover:bg-white placeholder:text-slate-400"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="w-full text-white py-3.5 px-4 rounded-xl transition-all duration-300 mt-4 font-bold bg-[#0F766E] hover:bg-[#0D5E58] hover:shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>

            {/* Step 2: Reset Password Form */}
            <form onSubmit={handleResetPassword} className={`space-y-4 absolute inset-0 w-full transition-all duration-500 ease-in-out ${step === 2 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="otp">
                  Mã OTP
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">pin</span>
                  </div>
                  <input
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all hover:bg-white placeholder:text-slate-400 font-mono tracking-widest"
                    id="otp"
                    maxLength="6"
                    name="otp"
                    placeholder="123456"
                    required
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="newPassword">
                  Mật khẩu mới
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                  <input
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-12 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all hover:bg-white placeholder:text-slate-400"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                  <input
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all hover:bg-white placeholder:text-slate-400"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="w-full text-white py-3.5 px-4 rounded-xl transition-all duration-300 font-bold bg-[#0F766E] hover:bg-[#0D5E58] hover:shadow-[0_8px_20px_rgba(15,118,110,0.25)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang cập nhật...' : 'Lưu mật khẩu'}
              </button>
              
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-[#0F766E] transition-colors hover:underline"
                >
                  Cần mã khác? Gửi lại
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <Link className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F766E] transition-colors group" to="/login">
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Quay lại đăng nhập
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
