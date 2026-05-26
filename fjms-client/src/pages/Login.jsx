import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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
          alert(data.message || 'Tài khoản chưa được xác thực email. Đang chuyển hướng đến trang xác nhận OTP.');
          navigate('/verify-email');
          return;
        }
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      // Save user session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('Đăng nhập thành công!');

      // Role-based routing
      const userRole = data.user.roleDefault;
      if (userRole === 'ADMIN') {
        navigate('/employer/dashboard'); // Fallback to employer dashboard for demo admins
      } else if (userRole === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center w-full">
      <div className="w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Side: Brand & Trust (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-between py-xl px-xl lg:w-1/2 left-panel-bg">
          <div className="ambient-glow"></div>
          <div className="relative z-10 h-full flex flex-col justify-between max-w-xl mx-auto w-full">
            <div>
              <Link className="font-headline-md text-headline-md font-bold text-on-primary inline-flex items-center gap-sm" to="/">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  assured_workload
                </span>
                FJMS
              </Link>
              
              <div className="mt-32 max-w-lg">
                <h1 className="font-headline-xl text-headline-xl text-on-primary mb-lg tracking-tight">
                  Secure. Professional. Reliable.
                </h1>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim/90 leading-relaxed">
                  Connect with top-tier talent and enterprise opportunities in a high-trust environment built for serious professionals.
                </p>
              </div>
            </div>

            <div className="space-y-md mt-16">
              <div className="flex items-start gap-md bg-white/5 backdrop-blur-md p-lg rounded-2xl border border-white/10 shadow-lg">
                <div className="bg-secondary/20 p-sm rounded-xl text-secondary-fixed flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shield
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">Escrow Protection</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim/80">
                    Funds are held securely until project milestones are approved by both parties.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-md bg-white/5 backdrop-blur-md p-lg rounded-2xl border border-white/10 shadow-lg">
                <div className="bg-secondary/20 p-sm rounded-xl text-secondary-fixed flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">Verified Experts</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim/80">
                    Every professional undergoes a rigorous identity, background, and skill vetting process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex items-center justify-center py-xl px-gutter lg:px-xl lg:w-1/2 bg-surface-bright h-full min-h-screen w-full">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
            
            {/* Mobile Logo (Visible only on mobile) */}
            <div className="lg:hidden mb-xl text-center">
              <Link className="font-headline-md text-headline-md font-bold text-primary inline-flex items-center gap-sm" to="/">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  assured_workload
                </span>
                FJMS
              </Link>
            </div>

            <div className="mb-lg text-center lg:text-left">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome back</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Log in to your account to continue.</p>
            </div>

            {errorMsg && (
              <div className="mb-md p-md bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-sm flex items-center gap-sm">
                <span className="material-symbols-outlined text-[20px] text-on-error-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  error
                </span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                  Email or Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-body-lg">person</span>
                  </div>
                  <input
                    className="block w-full pl-xl pr-sm py-sm bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder-outline transition-colors outline-none"
                    id="email"
                    name="email"
                    placeholder="Enter your email or phone"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-xs">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                    Password
                  </label>
                  <Link className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-body-lg">lock</span>
                  </div>
                  <input
                    className="block w-full pl-xl pr-xl py-sm bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder-outline transition-colors outline-none"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-body-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface cursor-pointer"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="ml-sm block font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember-me">
                  Remember me
                </label>
              </div>

              <div className="pt-sm">
                <button
                  className="w-full flex justify-center py-sm px-md border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>


            <div className="mt-lg text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account? 
                <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors ml-xs" to="/register">
                  Register
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
