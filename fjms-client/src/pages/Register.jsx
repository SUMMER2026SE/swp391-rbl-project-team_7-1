import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
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
      alert(data.message || 'Đăng ký tài khoản thành công! Mã OTP đã được gửi đến email của bạn.');
      navigate('/verify-email');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex antialiased w-full">
      
      {/* Left Conceptual Graphic Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-surface-variant overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDh9tsJLP7eOBvjn2HqVM8OFY-6_AjQ5dzSKJiPajVRdr0hwbWC05799a95zdPwODy469rKYYIP_rciQjwq-82Vv-ANh0G_geCQ4BfjAQSA5z938wvVFAjwhsSIwTXMXIxccTeaw8dUESbfv1pBsiYR0lUvjdxf9z3zOvssIIY8iG7WZMEpkhVK0fsrV1CvHoze3NKRlF0vPYk1VWnCW0jfzkvBV21yTQB-k50C3eW7yEBar_JIh2wFdQdbaub4yZO13J6ob-27ethK')"
          }}
          data-alt="A striking conceptual photography shot of a highly organized office space"
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]"></div>
        <div className="relative z-10 p-xl flex flex-col justify-between h-full w-full">
          <Link className="font-headline-md text-headline-md font-bold text-on-surface hover:opacity-85 transition-opacity" to="/">
            FJMS
          </Link>
          <div className="max-w-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Join the premier marketplace for top-tier talent.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Elevate your career by connecting with serious enterprise opportunities in a frictionless, high-trust environment.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-margin-mobile sm:px-lg md:px-xl py-xl overflow-y-auto">
        <div className="w-full max-w-[440px] mx-auto">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-xl font-headline-md text-headline-md font-bold text-primary">
            <Link className="text-primary" to="/">
              FJMS
            </Link>
          </div>

          <div className="mb-xl">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Create your account</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your details to register.</p>
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
            
            {/* Full Name */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors placeholder:text-outline outline-none"
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
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors placeholder:text-outline outline-none"
                id="email"
                name="email"
                placeholder="@gmail.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="phone">
                Phone
              </label>
              <input
                className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors placeholder:text-outline outline-none"
                id="phone"
                name="phone"
                placeholder=""
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Passwords Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors placeholder:text-outline outline-none"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md transition-colors placeholder:text-outline outline-none"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Notice Alert */}
            <div className="mt-lg p-md bg-surface-container rounded-lg border border-surface-container-high flex gap-md items-start">
              <span className="material-symbols-outlined text-primary mt-[2px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Your account will start as Freelancer. You can switch to Employer later.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-sm">
              <button
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-primary-container hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

          </form>


          <div className="mt-xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{' '}
              <Link className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" to="/login">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
