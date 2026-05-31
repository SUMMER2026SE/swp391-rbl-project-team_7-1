import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Retrieve the email address from localStorage
  const email = localStorage.getItem('pendingVerificationEmail') || 'your-email@example.com';

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle OTP digit changes
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keydown (Backspace back-focus)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste events
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus last pasted element
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  // Resend code logic
  const handleResend = async () => {
    if (!canResend) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gửi lại mã OTP thất bại.');
      }

      setOtp(['', '', '', '', '', '']);
      setTimeLeft(59);
      setCanResend(false);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      setToastMsg('Mã OTP mới đã được gửi thành công về email của bạn!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit validation
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
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Xác thực tài khoản thất bại.');
      }

      setToastMsg('Tài khoản đã được xác thực thành công! Đang chuyển hướng...');
      // Clean up localStorage
      localStorage.removeItem('pendingVerificationEmail');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format countdown timer
  const formatTime = (time) => {
    const seconds = time.toString().padStart(2, '0');
    return `00:${seconds}`;
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-lg antialiased text-on-surface bg-[#F8FAFC] w-full relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1E293B] text-white px-6 py-4 rounded-2xl shadow-xl border border-slate-700/50 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-400">check_circle</span>
          <span className="font-body-base font-semibold">{toastMsg}</span>
        </div>
      )}
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-xl">
          <Link className="font-headline-xl text-headline-xl text-primary hover:opacity-85 transition-opacity" to="/">
            FJMS
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg md:p-[32px] shadow-sm relative overflow-hidden group">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          
          <div className="text-center mb-lg">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-md">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mark_email_read
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Verify your email</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We've sent a 6-digit verification code to <br />
              <span className="font-semibold text-on-surface">{email}</span>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-md p-md bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-[20px] text-on-error-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleVerify}>
            
            {/* OTP Inputs */}
            <div className="flex justify-center gap-xs sm:gap-sm mb-lg" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  aria-label={`Digit ${index + 1}`}
                  autoFocus={index === 0}
                  className="w-12 h-14 text-center text-[24px] font-semibold border border-outline-variant rounded-lg bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                  maxLength={1}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* Action Button */}
            <button
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-[14px] rounded-lg hover:bg-primary-container transition-colors duration-200 shadow-sm hover:shadow-md mb-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>


          </form>

          {/* Resend Logic */}
          <div className="text-center mt-md">
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-xs">
              Didn't receive the code?
            </p>
            <div className="flex items-center justify-center gap-xs">
              <button
                className="font-label-md text-label-md text-primary hover:text-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                disabled={!canResend}
                onClick={handleResend}
                type="button"
              >
                Resend code
              </button>
              
              {!canResend && (
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  in <span className="font-semibold text-on-surface">{formatTime(timeLeft)}</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-lg text-center">
            <Link className="inline-flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/login">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to login
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
