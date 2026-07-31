import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export default function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('FREELANCER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Inline Validation States
  const [errors, setErrors] = useState({ fullname: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({ fullname: false, email: false, phone: false, password: false, confirmPassword: false });

  const validateField = (field, value) => {
    let error = '';
    if (field === 'fullname') {
      if (!value.trim()) error = 'Họ và tên không được để trống.';
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = 'Email không được để trống.';
      else if (!emailRegex.test(value)) error = 'Email không đúng định dạng.';
    } else if (field === 'phone') {
      const phoneRegex = /^(0|84|\+84)[35789][0-9]{8}$/;
      if (!value.trim()) error = 'Số điện thoại không được để trống.';
      else if (!phoneRegex.test(value)) error = 'Số điện thoại Việt Nam không hợp lệ (ví dụ: 0912345678).';
    } else if (field === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!value) error = 'Mật khẩu không được để trống.';
      else if (!passwordRegex.test(value)) error = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.';
      
      if (confirmPassword && value !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
      } else if (confirmPassword && value === confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else if (field === 'confirmPassword') {
      if (!value) error = 'Vui lòng xác nhận mật khẩu.';
      else if (value !== password) error = 'Mật khẩu xác nhận không khớp.';
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

    // Trigger touched for all fields to show errors if they exist
    setTouched({ fullname: true, email: true, phone: true, password: true, confirmPassword: true });
    
    // Validate all fields
    validateField('fullname', fullname);
    validateField('email', email);
    validateField('phone', phone);
    validateField('password', password);
    validateField('confirmPassword', confirmPassword);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|84|\+84)[35789][0-9]{8}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!fullname.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!emailRegex.test(email) || !phoneRegex.test(phone) || !passwordRegex.test(password)) {
      setErrorMsg('Vui lòng sửa các trường thông tin bị lỗi.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ fullName: fullname, email, phone, password, role });
      setToastMsg('Đăng ký thành công! Vui lòng kiểm tra email của bạn.');
      localStorage.setItem('pendingVerificationEmail', email);

      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Đăng ký thất bại.');
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
        
        {/* Left Side: Branding Panel (Luxury Dark Teal) */}
        <div className="md:w-[45%] bg-gradient-to-br from-[#0F766E] via-[#0D5E58] to-[#042F2E] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden z-20 hidden md:flex border-r border-white/10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
          
          <div className="absolute top-1/4 right-[-20%] w-64 h-64 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 left-[-20%] w-48 h-48 border border-white/5 rounded-full"></div>

          <div className="text-center z-10">
            <Link to="/">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300 border border-white/10 cursor-pointer">
                <span className="material-symbols-outlined text-5xl text-white">group_add</span>
              </div>
            </Link>
            
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Tham gia FJMS Ngay</h2>
            <p className="text-teal-50 text-sm leading-relaxed max-w-[260px] mx-auto font-medium opacity-80">
              Tạo tài khoản để kết nối với khách hàng hàng đầu, khám phá các dự án thú vị và đưa sự nghiệp freelance của bạn lên một tầm cao mới.
            </p>
          </div>
          
          <div className="absolute bottom-8 w-full flex justify-center gap-6 text-teal-100/70">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Chất lượng</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[20px]">public</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">Toàn cầu</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-[55%] bg-white/60 p-10 md:p-14 flex flex-col justify-center relative z-10">
          <div className="md:hidden text-center mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#0F766E]/10 rounded-2xl flex items-center justify-center text-[#0F766E]">
              <span className="material-symbols-outlined text-3xl">group_add</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Tạo tài khoản</h2>
            <p className="text-slate-500 mt-2 text-sm">Nhập thông tin bên dưới để bắt đầu.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fullname Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="fullname">
                Họ và tên
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium ${
                    touched.fullname && errors.fullname 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500' 
                      : 'border-slate-100/50 focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                  }`}
                  id="fullname"
                  name="fullname"
                  placeholder="Họ và tên"
                  required
                  type="text"
                  value={fullname}
                  onChange={(e) => handleFieldChange('fullname', e.target.value, setFullname)}
                  onBlur={(e) => handleBlur('fullname', e.target.value)}
                />
              </div>
              {touched.fullname && errors.fullname && (
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.fullname}</p>
              )}
            </div>

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
                  placeholder="Địa chỉ email"
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

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="phone">
                Số điện thoại
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <input
                  className={`w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium ${
                    touched.phone && errors.phone 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500' 
                      : 'border-slate-100/50 focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                  }`}
                  id="phone"
                  name="phone"
                  placeholder="Phone (VD: 0912345678)"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value, setPhone)}
                  onBlur={(e) => handleBlur('phone', e.target.value)}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                Mật khẩu
              </label>
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
                  placeholder="Mật khẩu"
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
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1 leading-relaxed">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0F766E] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className={`w-full bg-slate-50 border rounded-xl pl-12 pr-12 py-3.5 text-slate-800 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium ${
                    touched.confirmPassword && errors.confirmPassword 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-100 focus:border-red-500' 
                      : 'border-slate-100/50 focus:border-slate-200 focus:ring-4 focus:ring-slate-100'
                  }`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                  onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-600 text-xs font-medium mt-1.5 ml-1 leading-relaxed">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              className="w-full text-white py-3.5 px-4 rounded-xl transition-all duration-300 font-bold bg-[#0F766E] hover:bg-[#0D5E58] hover:shadow-lg hover:shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 border-none cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Hoặc đăng ký với</span>
            <div className="flex-1 h-px border-t border-dashed border-slate-200"></div>
          </div>

          <div className="flex justify-center w-full mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMsg('Đăng ký bằng Google thất bại.')}
              useOneTap
            />
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-slate-500 font-medium">
              Đã có tài khoản? 
              <Link className="font-semibold text-[#0F766E] hover:underline ml-1.5" to="/login">
                Đăng nhập
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
