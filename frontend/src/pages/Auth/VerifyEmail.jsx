import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem('pendingVerificationEmail') || 'your-email@example.com';

  useEffect(() => {
    if (timeLeft <= 0) {
      const timeoutId = setTimeout(() => setCanResend(true), 0);
      return () => clearTimeout(timeoutId);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setErrorMsg('');
    setLoading(true);

    try {
      await authService.resendOtp(email);

      setOtp(['', '', '', '', '', '']);
      setTimeLeft(59);
      setCanResend(false);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      setToastMsg('Mã xác thực mới đã được gửi thành công về email của bạn!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Gửi lại mã xác thực thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Vui lòng điền đầy đủ mã xác thực gồm 6 chữ số.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyEmail(email, code);

      setToastMsg('Tài khoản đã được xác thực thành công!');
      localStorage.removeItem('pendingVerificationEmail');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Xác thực tài khoản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const seconds = time.toString().padStart(2, '0');
    return `00:${seconds}`;
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
                <span className="material-symbols-outlined text-5xl text-white">mark_email_read</span>
              </div>
            </Link>

            <h2 className="text-3xl font-bold mb-4 tracking-tight">Xác thực Email</h2>

            <p className="text-teal-50 text-sm leading-relaxed max-w-[260px] mx-auto font-medium opacity-90">
              Chỉ còn một bước nữa! Vui lòng xác thực địa chỉ email để đảm bảo tính an mật cho tài khoản của bạn.
            </p>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="absolute bottom-8 w-full flex justify-center gap-6 text-teal-100/80">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Đã xác thực</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">security</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Bảo mật</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[55%] bg-white/60 p-10 md:p-14 flex flex-col justify-center relative z-10">

          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden text-center mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#0F766E]/10 rounded-2xl flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Kiểm tra hộp thư</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Chúng tôi đã gửi mã xác thực 6 chữ số đến <span className="font-semibold text-[#0F766E] break-all">{email}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-slate-50/50 border border-slate-200 rounded-xl text-xl font-bold text-slate-800 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all hover:bg-white"
                  type="text"
                  name="otp"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            <button
              className="w-full text-white py-3.5 px-4 rounded-xl transition-all duration-300 font-bold bg-[#0F766E] hover:bg-[#0D5E58] hover:shadow-lg hover:shadow-[#0F766E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Xác thực Email'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
            <p className="text-slate-500 mb-3">
              Bạn chưa nhận được mã?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || loading}
              className="font-semibold text-[#0F766E] hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed transition-colors"
            >
              {canResend ? 'Gửi lại Mã' : `Có thể gửi lại sau 00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
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
