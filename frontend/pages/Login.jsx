import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        throw new Error(data.message || 'Đăng nhập Google thất bại.');
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
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // If account is not verified, redirect to verification page
        if (data.isEmailVerified === false) {
          localStorage.setItem('pendingVerificationEmail', email);
          setToastMsg('Tài khoản chưa được xác thực email. Đang chuyển hướng đến trang xác nhận OTP...');
          setTimeout(() => {
            navigate('/verify-email');
          }, 1500);
          return;
        }
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      // Save user session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToastMsg('Đăng nhập thành công!');

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

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#F8FAFC] p-6 antialiased relative">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1E293B] text-white px-6 py-4 rounded-2xl shadow-xl border border-slate-700/50 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-400">check_circle</span>
          <span className="font-body-base font-semibold">{toastMsg}</span>
        </div>
      )}
      <main className="w-full max-w-[440px] mx-auto">
        {/*  Login Card  */}
        <div className="rounded-xl p-8 w-full relative overflow-hidden bg-white" style={{ "border": "1px solid #E2E8F0", "boxShadow": "0 2px 12px rgba(15,23,42,0.015)" }}>
          
          {/*  Header  */}
          <div className="text-center mb-8">
            <Link className="font-headline-2xl text-headline-2xl font-bold tracking-tight mb-2 inline-block text-[#1E293B]" to="/">
              FJMS
            </Link>
            <p className="font-body-sm text-body-sm text-slate-500" style={{ "color": "#1E293B", "opacity": "0.8" }}>
              Welcome back. Please enter your details.
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
            {/* Email/Phone Input */}
            <div>
              <label className="block font-body-sm text-body-sm font-medium text-slate-700 mb-1.5" htmlFor="email" style={{ "color": "#1E293B" }}>
                Email or Phone
              </label>
              <input
                className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors bg-white outline-none"
                id="email"
                name="email"
                placeholder="Enter your email or phone"
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-body-sm text-body-sm font-medium text-slate-700" htmlFor="password" style={{ "color": "#1E293B" }}>
                  Password
                </label>
                <Link className="font-body-sm text-body-sm hover:text-[#0D5E58] transition-colors font-medium" to="/forgot-password" style={{ "color": "#0F766E" }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 font-body-base text-body-base text-slate-900 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-colors pr-12 bg-white outline-none"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 text-[#0F766E] focus:ring-[#0F766E] border-slate-300 rounded cursor-pointer"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="ml-2 block font-body-sm text-body-sm text-slate-500 cursor-pointer select-none" htmlFor="remember-me">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full text-white font-body-base text-body-base py-3 px-4 rounded-lg transition-all duration-200 mt-2 font-medium bg-gradient-to-r from-[#1E293B] to-[#334155] hover:shadow-[0_0_15px_rgba(15,118,110,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
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
                setErrorMsg('Đăng nhập bằng Google thất bại.');
              }}
              useOneTap
            />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-body-sm text-body-sm text-slate-500" style={{ "color": "#1E293B", "opacity": "0.8" }}>
              Don't have an account? 
              <Link className="font-medium ml-1 transition-colors hover:text-[#0D5E58]" to="/register" style={{ "color": "#0F766E" }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
