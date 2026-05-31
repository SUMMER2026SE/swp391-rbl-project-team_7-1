import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký bằng Google thất bại.');
      }

      // Save user session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToastMsg('Đăng nhập bằng Google thành công!');

      setTimeout(() => {
        // Role-based routing
        const userRole = data.user.roleDefault;
        if (userRole === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (userRole === 'EMPLOYER') {
          navigate('/employer-dashboard');
        } else {
          navigate('/freelancer-dashboard');
        }
      }, 1200);

    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Regex: ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg("Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (ví dụ: @, $, !, %, *, ?, &, #).");
      return;
    }

    // Phone validation: Vietnamese mobile number
    const phoneRegex = /^(0|84|\+84)[35789][0-9]{8}$/;
    if (phone && !phoneRegex.test(phone)) {
      setErrorMsg("Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại Việt Nam (ví dụ: 0912345678).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role: 'FREELANCER' // Default role for registration
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký tài khoản thất bại.');
      }

      // Store pending verification email in localStorage
      localStorage.setItem('pendingVerificationEmail', email);
      setToastMsg(data.message || 'Đăng ký tài khoản thành công! Đang chuyển hướng đến trang OTP...');
      setTimeout(() => {
        navigate('/verify-email');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#F8FAFC] p-6 antialiased relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1E293B] text-white px-6 py-4 rounded-2xl shadow-xl border border-slate-700/50 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-400">check_circle</span>
          <span className="font-body-base font-semibold">{toastMsg}</span>
        </div>
      )}
      <main className="w-full max-w-[440px] mx-auto">
        {/*  Register Card  */}
        <div className="rounded-xl p-8 w-full relative overflow-hidden bg-white" style={{ "border": "1px solid #E2E8F0", "boxShadow": "0 2px 12px rgba(15,23,42,0.015)" }}>
          
          {/*  Header  */}
          <div className="text-center mb-8">
            <Link className="font-headline-2xl text-headline-2xl font-bold tracking-tight mb-2 inline-block text-[#1E293B]" to="/">
              FJMS
            </Link>
            <p className="font-body-sm text-body-sm text-slate-500" style={{ "color": "#1E293B", "opacity": "0.8" }}>
              Create your account
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-4 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#475569] mt-0.5" style={{ "fontVariationSettings": "'FILL' 1" }}>
              info
            </span>
            <p className="font-body-sm text-body-sm text-[#475569]">
              Your account will start as Freelancer. You can switch to Employer after login.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-100 rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-red-600">
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="fullName" style={{ "color": "#1E293B" }}>
                Full Name
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="fullName"
                name="fullName"
                placeholder="e.g Nguyen Van A"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="email" style={{ "color": "#1E293B" }}>
                Email
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="phone" style={{ "color": "#1E293B" }}>
                Phone Number
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="password" style={{ "color": "#1E293B" }}>
                Password
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="confirmPassword" style={{ "color": "#1E293B" }}>
                Confirm Password
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full text-white font-body-base text-body-base py-3 px-4 rounded-lg transition-all duration-200 mt-2 font-medium bg-gradient-to-r from-[#1E293B] to-[#334155] hover:shadow-[0_0_15px_rgba(15,118,110,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="font-body-sm text-body-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setErrorMsg('Đăng ký bằng Google thất bại.');
              }}
              useOneTap
            />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-body-sm text-body-sm text-slate-500" style={{ "color": "#1E293B", "opacity": "0.8" }}>
              Already have an account? 
              <Link className="font-medium ml-1 transition-colors hover:text-[#0D5E58]" to="/login" style={{ "color": "#0F766E" }}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
