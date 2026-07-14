import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toastMsg, setToastMsg] = useState('');

  // Inline Validation States
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateField = (field, value) => {
    let error = '';
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email không được để trống.';
      else if (!emailRegex.test(value)) error = 'Email không đúng định dạng.';
    } else if (field === 'password') {
      if (!value) error = 'Mật khẩu không được để trống.';
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await authService.loginWithGoogle(credentialResponse.credential);
      login(data.user, data.token);
      setToastMsg('Đăng nhập bằng Google thành công!');

      setTimeout(() => {
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
      setErrorMsg(err.response?.data?.message || err.message || 'Đăng nhập Google thất bại.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Trigger touched for validations
    setTouched({ email: true, password: true });
    validateField('email', email);
    validateField('password', password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMsg('Email không đúng định dạng.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email, password);
      login(data.user, data.token);
      setToastMsg('Đăng nhập thành công!');

      setTimeout(() => {
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
      setErrorMsg(err.response?.data?.message || err.message || 'Đăng nhập thất bại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-[#E0F2FE] to-[#F0F9FF] p-4 sm:p-6 antialiased relative overflow-hidden font-sans">
      
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-[600px] h-[600px] rounded-full border-[1px] border-white/60 absolute"></div>
        <div className="w-[900px] h-[900px] rounded-full border-[1px] border-white/60 absolute"></div>
        <div className="w-[1200px] h-[1200px] rounded-full border-[1px] border-white/60 absolute"></div>
      </div>
      
      {/* Soft Cloud-like Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/80 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/60 rounded-full blur-[120px] pointer-events-none"></div>

      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white text-slate-800 px-6 py-4 rounded-2xl shadow-xl border border-slate-100 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-[24px] text-green-500">check_circle</span>
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Split-Screen Container */}
      <main className="w-full max-w-5xl z-10 flex flex-col md:flex-row bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden min-h-[600px] border border-white/50 relative">
        
        {/* Left Side: Branding Panel */}
        <div className="md:w-[45%] bg-gradient-to-br from-[#0F766E] via-[#0D5E58] to-[#042F2E] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden z-20 hidden md:flex border-r border-white/10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
          
          <div className="absolute top-1/4 right-[-20%] w-64 h-64 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 left-[-20%] w-48 h-48 border border-white/5 rounded-full"></div>

          <div className="text-center z-10">
            <Link to="/">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300 border border-white/10 cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-white">fingerprint</span>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Chào Mừng Trở Lại</h2>
            <p className="text-teal-50 text-sm leading-relaxed max-w-[260px] mx-auto font-medium opacity-80">
              Đăng nhập để cập nhật tiến độ công việc, trao đổi với đối tác và thực hiện các giao dịch ký quỹ an toàn.
            </p>
          </div>
          
          <div className="absolute bottom-8 w-full flex justify-center gap-6 text-teal-100/70">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Bảo mật</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">speed</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Nhanh chóng</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[55%] bg-white/60 p-10 md:p-14 flex flex-col justify-center relative z-10">
          <div className="md:hidden text-center mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#0F766E]/10 rounded-2xl flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-3xl">fingerprint</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Đăng nhập vào tài khoản</h2>
            <p className="text-slate-500 mt-2 text-sm">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Địa chỉ Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium ${
                    touched.email && errors.email 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500' 
                      : 'border-slate-100/50 focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                  }`}
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                  Mật khẩu
                </label>
                <Link className="text-xs font-semibold text-[#0F766E] hover:underline" to="/forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className={`w-full bg-slate-50 border rounded-xl pl-12 pr-12 py-3.5 text-slate-800 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500' 
                      : 'border-slate-100/50 focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                  }`}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E] transition-all cursor-pointer"
                />
                <span className="text-xs text-slate-600 group-hover:text-slate-800 font-medium select-none">Duy trì đăng nhập</span>
              </label>
            </div>

            <button
              className="w-full text-white py-3.5 px-4 rounded-xl transition-all duration-300 font-bold bg-[#0F766E] hover:bg-[#0D5E58] hover:shadow-lg hover:shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 border-none cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Hoặc đăng nhập với</span>
            <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
          </div>

          <div className="flex justify-center w-full mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Đăng nhập bằng Google thất bại.')}
              useOneTap
            />
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-500 font-medium">
              Chưa có tài khoản? 
              <Link className="font-semibold text-[#0F766E] hover:underline ml-1.5" to="/register">
                Đăng ký ngay
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
