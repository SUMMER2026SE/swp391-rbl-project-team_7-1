import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Yêu cầu khôi phục mật khẩu thất bại.');
      }

      setSubmitted(true);
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
                  Protecting Your Credentials.
                </h1>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim/90 leading-relaxed">
                  We employ rigorous, industry-standard cryptographic practices to ensure your digital workspace and account data remain completely secure.
                </p>
              </div>
            </div>

            <div className="space-y-md mt-16">
              <div className="flex items-start gap-md bg-white/5 backdrop-blur-md p-lg rounded-2xl border border-white/10 shadow-lg">
                <div className="bg-secondary/20 p-sm rounded-xl text-secondary-fixed flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    key
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">End-to-End Encryption</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim/80">
                    Passwords are safely salted and hashed using bcrypt before stored, keeping them anonymous to everyone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-md bg-white/5 backdrop-blur-md p-lg rounded-2xl border border-white/10 shadow-lg">
                <div className="bg-secondary/20 p-sm rounded-xl text-secondary-fixed flex-shrink-0 mt-1 flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    support_agent
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">Need Assistance?</h3>
                  <p className="font-body-md text-body-md text-primary-fixed-dim/80">
                    Our platform support team and AI chatbot are available 24/7 to help you recover your credentials securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Reset Form */}
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

            {!submitted ? (
              <>
                <div className="mb-lg text-center lg:text-left">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Forgot password?</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    No worries! Enter your email below and we'll send you reset instructions.
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

                <form onSubmit={handleSubmit} className="space-y-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-body-lg">mail</span>
                      </div>
                      <input
                        className="block w-full pl-xl pr-sm py-sm bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface placeholder-outline transition-colors outline-none"
                        id="email"
                        name="email"
                        placeholder="example@gmail.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-sm">
                    <button
                      className="w-full flex justify-center py-sm px-md border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Reset Instructions'}
                    </button>
                  </div>
                </form>

              </>
            ) : (
              <div className="text-center py-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-lg text-primary">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mark_email_read
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Check your email</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
                  We've sent a password reset link to <br />
                  <span className="font-semibold text-on-surface">{email}</span>. <br />
                  Please follow the instructions in the email to set a new password.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-block"
                >
                  Resend email link
                </button>
              </div>
            )}

            <div className="mt-xl text-center border-t border-outline-variant/30 pt-lg">
              <Link className="inline-flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/login">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to login
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
