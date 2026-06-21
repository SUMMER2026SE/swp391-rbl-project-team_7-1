import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/userService';


/* ─── helpers ─── */
const initials = (n = '') => n.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : '—';
const fmtVND = (v) => {
  if (!v) return '';
  const n = parseInt(v);
  if (isNaN(n)) return v;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.0', '')} triệu đ`;
  return `${n.toLocaleString('vi-VN')} đ`;
};

const SKILLS = [
  'React','Vue.js','Angular','Next.js','Node.js','Express','Django','Laravel','PHP',
  'Python','Java','C#','TypeScript','JavaScript','HTML/CSS','Tailwind CSS','PostgreSQL',
  'MySQL','MongoDB','Firebase','AWS','Docker','Git','Figma','Thiết kế UI/UX',
  'Thiết kế Đồ họa','Flutter','React Native','WordPress','SEO','Viết nội dung',
  'Phân tích Dữ liệu','Machine Learning','DevOps','Kotlin','Swift','Dịch thuật',
  'Kế toán','Marketing Kỹ thuật số','Quản lý Dự án',
];

const AVAIL = [
  { v:'AVAILABLE',   label:'Sẵn sàng nhận việc',  dot:'bg-emerald-500', pill:'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { v:'BUSY',        label:'Đang có dự án',         dot:'bg-amber-500',   pill:'bg-amber-50 text-amber-700 border-amber-200'   },
  { v:'UNAVAILABLE', label:'Không nhận thêm việc', dot:'bg-slate-400',   pill:'bg-slate-100 text-slate-500 border-slate-200'  },
];
const EXP = [
  { v:'ENTRY',        label:'Mới vào nghề',    sub:'0 – 1 năm' },
  { v:'INTERMEDIATE', label:'Trung cấp',        sub:'1 – 3 năm' },
  { v:'EXPERT',       label:'Chuyên gia',       sub:'3+ năm' },
];

const JOB_CATEGORIES = [
  'Lập trình Web','Ứng dụng Di động','Thiết kế UI/UX','Khoa học Dữ liệu',
  'AI & Machine Learning','An ninh Mạng','Thiết kế Đồ họa','Dựng phim & Chỉnh video',
  'Nhiếp ảnh','Hoạt hình & 3D','Âm nhạc & Âm thanh','Viết nội dung',
  'Dịch thuật','Copywriting','SEO Content','Marketing Kỹ thuật số',
  'SEO & SEM','Mạng xã hội','Tư vấn Kinh doanh','Kế toán',
  'Dịch vụ Pháp lý','Tư vấn Thuế','Trợ lý Ảo','Nhập liệu',
  'Hỗ trợ Khách hàng','Gia sư Online',
];

/* ─── small atoms ─── */
function Field({ label, required, note, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-semibold text-[#334155]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {note && <p className="text-[11px] text-[#94A3B8]">{note}</p>}
    </div>
  );
}

function Input({ icon, prefix, type = 'text', value, onChange, placeholder, readOnly, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPwd = type === 'password';
  return (
    <div className="relative group">
      {icon && <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8] group-focus-within:text-[#0F766E] transition-colors pointer-events-none">{icon}</span>}
      {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8] pointer-events-none">{prefix}</span>}
      <input
        type={isPwd && show ? 'text' : type}
        value={value} onChange={onChange} placeholder={placeholder}
        readOnly={readOnly} autoComplete={autoComplete}
        className={`w-full ${icon ? 'pl-10' : prefix ? 'pl-8' : 'pl-3.5'} ${isPwd ? 'pr-10' : 'pr-3.5'} py-2.5 rounded-xl text-sm border transition-all
          ${readOnly ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            : 'bg-white border-[#E2E8F0] text-[#334155] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1]'}`}
      />
      {isPwd && (
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
          <span className="material-symbols-outlined text-[18px]">{show ? 'visibility_off' : 'visibility'}</span>
        </button>
      )}
    </div>
  );
}

function PwdStrength({ p }) {
  if (!p) return null;
  const c = [p.length >= 8, /[A-Z]/.test(p), /[a-z]/.test(p), /\d/.test(p), /[@$!%*?&#]/.test(p)];
  const s = c.filter(Boolean).length;
  const bar = ['', 'bg-red-400', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const lbl = ['', 'Yếu', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= s ? bar[s] : 'bg-[#E2E8F0]'}`} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {['8+ ký tự','Chữ hoa','Chữ thường','Số','Ký tự đặc biệt'].map((l,i) => (
            <span key={l} className={`text-[10px] px-1.5 py-0.5 rounded font-medium
              ${c[i] ? 'bg-emerald-50 text-emerald-600' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>{l}</span>
          ))}
        </div>
        {s > 0 && <span className={`text-[11px] font-bold ${s >= 4 ? 'text-emerald-600' : s >= 3 ? 'text-amber-500' : 'text-red-500'}`}>{lbl[s]}</span>}
      </div>
    </div>
  );
}

function Toast({ type, msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium mb-5
      ${type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
      <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 shrink-0">
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

/* ─── completion score ─── */
function calcCompletion(p, extras, isFL) {
  if (isFL) {
    const fields = [
      !!p?.full_name, !!p?.email, !!p?.phone, !!p?.bio, !!p?.avatar_url,
      !!extras?.title, !!extras?.hourlyRate, extras?.skills?.length > 0,
      !!extras?.portfolio,
    ];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  } else {
    const fields = [
      !!p?.full_name, !!p?.email, !!p?.phone, !!p?.bio, !!p?.avatar_url,
      !!extras?.companyName, !!extras?.industry, !!extras?.companySize,
    ];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  }
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function Profile() {
  const token = (() => { const r = localStorage.getItem('token'); return r && r !== 'null' && r !== 'undefined' ? r : null; })();

  /* state */
  const [profile, setProfile] = useState(null);
  const [extras, setExtras]   = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('overview');
  const [saving, setSaving]   = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [alert, setAlert]     = useState({ type: '', msg: '' });

  /* portfolios state */
  const [portfolios, setPortfolios] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showPortModal, setShowPortModal] = useState(false);
  const [editingPort, setEditingPort] = useState(null);
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portUrl, setPortUrl] = useState('');
  const [portImage, setPortImage] = useState('');

  /* edit - basic */
  const [eName, setEName]       = useState('');
  const [ePhone, setEPhone]     = useState('');
  const [eBio, setEBio]         = useState('');
  const [eAvatar, setEAvatar]   = useState('');
  const [aPreview, setAPreview] = useState('');

  /* edit - freelancer professional */
  const [eTitle, setETitle]     = useState('');
  const [eRate, setERate]       = useState('');
  const [eAvail, setEAvail]     = useState('AVAILABLE');
  const [eExp, setEExp]         = useState('INTERMEDIATE');
  const [eSkills, setESkills]   = useState([]);
  const [ePortfolio, setEPortfolio] = useState('');
  const [eLinkedIn, setELinkedIn]   = useState('');
  const [eGitHub, setEGitHub]       = useState('');
  const [skillQ, setSkillQ]         = useState('');

  /* edit - employer company info */
  const [eCompanyName, setECompanyName]   = useState('');
  const [eIndustry, setEIndustry]         = useState('');
  const [eCompanySize, setECompanySize]   = useState('');
  const [eWebsite, setEWebsite]           = useState('');
  const [eCompanyDesc, setECompanyDesc]   = useState('');
  const [eLocation, setELocation]         = useState('');

  /* security */
  const [oldPwd, setOldPwd]     = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [conPwd, setConPwd]     = useState('');

  /* delete */
  const [showDel, setShowDel]   = useState(false);
  const [delPwd, setDelPwd]     = useState('');
  const [delText, setDelText]   = useState('');

  const fileRef = useRef();
  
  const { id } = useParams();
  const currentUser = (() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();
  const currentUserId = currentUser?.userId || currentUser?.id;
  const isPublicView = !!id && Number(id) !== Number(currentUserId);

  // We want to allow the user to manage both profiles regardless of their default role
  const isFL = true;
  const isEM = true;
  const activeRole = profile?.role_default || JSON.parse(localStorage.getItem('user') || '{}')?.roleDefault || 'FREELANCER';

  /* ── fetch ── */
  const load = async () => {
    setLoading(true);
    try {
      const data = isPublicView 
        ? await userService.getPublicProfile(id)
        : await userService.getProfile();
      if (data && data.user) {
        const u = data.user;
        setProfile(u);
        setEName(u.full_name || ''); setEPhone(u.phone || '');
        setEBio(u.bio || ''); setEAvatar(u.avatar_url || ''); setAPreview(u.avatar_url || '');
        let ex = {};
        try { ex = u.bio_extras ? JSON.parse(u.bio_extras) : {}; } catch {}
        setExtras(ex);
        // Freelancer fields
        setETitle(ex.title || ''); setERate(ex.hourlyRate || '');
        setEAvail(ex.availability || 'AVAILABLE'); setEExp(ex.experience || 'INTERMEDIATE');
        setESkills(ex.skills || []);
        setEPortfolio(ex.portfolio || ''); setELinkedIn(ex.linkedin || ''); setEGitHub(ex.github || '');
        // Employer fields
        setECompanyName(ex.companyName || '');
        setEIndustry(ex.industry || '');
        setECompanySize(ex.companySize || '');
        setEWebsite(ex.website || '');
        setECompanyDesc(ex.companyDesc || '');
        setELocation(ex.location || '');
      } else {
        setAlert({ type: 'error', msg: data.message || 'Lỗi tải hồ sơ.' });
      }
      
      const portRes = isPublicView
        ? await userService.getFreelancerPortfolios(id)
        : await userService.getPortfolios();
      if (portRes && portRes.success) {
        setPortfolios(portRes.portfolios);
      }

      const targetId = isPublicView ? id : currentUserId;
      if (targetId) {
        try {
          const reviewsRes = await userService.getFreelancerReviews(targetId);
          if (reviewsRes && reviewsRes.success) {
            setReviews(reviewsRes.reviews);
          }
        } catch (err) {
          console.error('Error fetching freelancer reviews:', err);
        }
      }
    } catch (err) { setAlert({ type:'error', msg:'Lỗi kết nối máy chủ.' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (token || isPublicView) load(); else setLoading(false); }, [id]);

  /* ── avatar ── */
  const onFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2*1024*1024) { setAlert({ type:'error', msg:'Ảnh phải nhỏ hơn 2 MB.' }); return; }
    const r = new FileReader();
    r.onload = ev => { setAPreview(ev.target.result); setEAvatar(ev.target.result); };
    r.readAsDataURL(f);
  };

  /* ── skills ── */
  const addSkill = sk => {
    const s = sk.trim();
    if (s && !eSkills.includes(s) && eSkills.length < 15) setESkills(p => [...p, s]);
    setSkillQ('');
  };

  /* ── save ── */
  const save = async e => {
    e.preventDefault(); setAlert({ type:'', msg:'' });
    if (!eName.trim()) { setAlert({ type:'error', msg:'Họ và tên không được để trống.' }); return; }
    setSaving(true);
    const ex = { 
      title:eTitle, hourlyRate:eRate, availability:eAvail, experience:eExp, skills:eSkills, portfolio:ePortfolio, linkedin:eLinkedIn, github:eGitHub,
      companyName:eCompanyName, industry:eIndustry, companySize:eCompanySize, website:eWebsite, companyDesc:eCompanyDesc, location:eLocation 
    };
    try {
      const data = await userService.updateProfile({ fullName:eName.trim(), phone:ePhone||null, bio:eBio||null,
          avatarUrl: eAvatar||null, bioExtras: JSON.stringify(ex) });
      setAlert({ type:'success', msg:'Cập nhật hồ sơ thành công!' });
      if (data.user) { setProfile(prev => ({ ...prev, ...data.user })); setExtras(ex);
        const s = localStorage.getItem('user');
        if (s) {
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(s), fullName:data.user.full_name, avatarUrl:data.user.avatar_url }));
          window.dispatchEvent(new Event('profileUpdated'));
        }
      }
    } catch (err) { setAlert({ type:'error', msg: err.response?.data?.message || 'Cập nhật thất bại.' }); }
    finally { setSaving(false); }
  };

  /* ── change password ── */
  const changePwd = async e => {
    e.preventDefault(); setAlert({ type:'', msg:'' });
    if (newPwd !== conPwd) { setAlert({ type:'error', msg:'Mật khẩu xác nhận không khớp.' }); return; }
    
    if (newPwd === oldPwd) {
      setAlert({ type:'error', msg:'Mật khẩu mới trùng với mật khẩu cũ.' });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPwd)) {
      setAlert({ type:'error', msg:'Mật khẩu phải có ít nhất 8 ký tự, bao gồm: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.' });
      return;
    }

    setSavingPwd(true);
    try {
      await userService.changePassword(oldPwd, newPwd);
      setAlert({ type:'success', msg:'Đổi mật khẩu thành công!' }); setOldPwd(''); setNewPwd(''); setConPwd('');
    } catch (err) { setAlert({ type:'error', msg: err.response?.data?.message || 'Đổi mật khẩu thất bại.' }); }
    finally { setSavingPwd(false); }
  };

  /* ── delete ── */
  const doDelete = async () => {
    if (delText !== 'XÓA TÀI KHOẢN') { setAlert({ type:'error', msg:'Vui lòng nhập đúng cụm xác nhận.' }); return; }
    setDeleting(true);
    try {
      await userService.deleteAccount(delPwd);
      localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login';
    } catch (err) { setAlert({ type:'error', msg: err.response?.data?.message || 'Xóa tài khoản thất bại.' }); setShowDel(false); }
    finally { setDeleting(false); }
  };

  /* ── portfolios CRUD handlers ── */
  const handleOpenPortModal = (port = null) => {
    if (port) {
      setEditingPort(port);
      setPortTitle(port.title);
      setPortDesc(port.description || '');
      setPortUrl(port.project_url || '');
      setPortImage(port.image_url || '');
    } else {
      setEditingPort(null);
      setPortTitle('');
      setPortDesc('');
      setPortUrl('');
      setPortImage('');
    }
    setShowPortModal(true);
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', msg: '' });
    try {
      const pData = { title: portTitle, description: portDesc, projectUrl: portUrl, imageUrl: portImage };
      let res;
      if (editingPort) {
        res = await userService.updatePortfolio(editingPort.portfolio_id, pData);
      } else {
        res = await userService.addPortfolio(pData);
      }
      if (res.success) {
        setAlert({ type: 'success', msg: editingPort ? 'Cập nhật dự án thành công!' : 'Thêm dự án portfolio thành công!' });
        setShowPortModal(false);
        const portRes = await userService.getPortfolios();
        if (portRes.success) {
          setPortfolios(portRes.portfolios);
        }
      }
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Lưu portfolio thất bại.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (portId) => {
    if (!window.confirm('Bạn có chắc muốn xóa dự án portfolio này?')) return;
    setSaving(true);
    setAlert({ type: '', msg: '' });
    try {
      const res = await userService.deletePortfolio(portId);
      if (res.success) {
        setAlert({ type: 'success', msg: 'Xóa dự án portfolio thành công!' });
        const portRes = await userService.getPortfolios();
        if (portRes.success) {
          setPortfolios(portRes.portfolios);
        }
      }
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Xóa portfolio thất bại.' });
    } finally {
      setSaving(false);
    }
  };

  const goTab = t => { setTab(t); setAlert({ type:'', msg:'' }); };
  const avail = AVAIL.find(a => a.v === eAvail) || AVAIL[0];
  const pct = calcCompletion(profile, { ...extras, title:eTitle, hourlyRate:eRate, skills:eSkills, portfolio:ePortfolio, companyName:eCompanyName, industry:eIndustry, companySize:eCompanySize }, isFL);

  /* ── loading ── */
  if (loading) return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#94A3B8] font-medium">Đang tải hồ sơ…</p>
      </div>
    </main>
  );

  const avatarSrc = aPreview || profile?.avatar_url;

  /* ════════════════════════════════════
     TABS META
  ════════════════════════════════════ */
  const TABS = isPublicView
    ? [ { id:'overview',     icon:'person',        label:'Tổng quan' } ]
    : [
        { id:'overview',     icon:'person',        label:'Tổng quan' },
        { id:'edit',         icon:'edit',          label:'Chỉnh sửa hồ sơ' },
        ...(isFL ? [{ id:'professional', icon:'work', label:'Kỹ năng & Dịch vụ' }] : []),
        ...(isEM ? [{ id:'company',      icon:'business', label:'Thông tin công ty' }] : []),
        { id:'security',     icon:'shield',        label:'Bảo mật' },
        { id:'danger',       icon:'delete_forever',label:'Tài khoản', danger:true },
      ];

  return (
    <>
    <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        {/* ─── Page header ─── */}
        <div className="mb-6">
          <h1 className="font-headline-2xl text-headline-2xl text-[#334155]">
            {isPublicView ? `Hồ sơ của ${profile?.full_name || ''}` : 'Hồ sơ của tôi'}
          </h1>
          <p className="font-body-base text-body-base text-[#475569] mt-1">
            {isPublicView ? 'Xem thông tin chi tiết, kỹ năng và kinh nghiệm của freelancer.' : 'Quản lý hồ sơ công khai, kỹ năng và cài đặt tài khoản.'}
          </p>
        </div>

        {/* ─── Main grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* LEFT SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-8">

            {/* Profile card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
              {/* Cover */}
              <div className="h-20 bg-gradient-to-r from-[#0F766E] to-[#0891B2] relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.5'%3E%3Ccircle cx='4' cy='4' r='1.5'/%3E%3C/g%3E%3C/svg%3E\")" }} />
              </div>

              <div className="px-5 pb-5">
                <div className="-mt-9 mb-3 flex items-end justify-between">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#0D9488]">
                      {avatarSrc
                        ? <img src={avatarSrc} alt={profile?.full_name} className="w-full h-full object-cover" />
                        : <span className="w-full h-full flex items-center justify-center text-lg font-bold text-white">{initials(profile?.full_name)}</span>
                      }
                    </div>
                    {activeRole === 'FREELANCER' && <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${avail.dot}`} title={avail.label} />}
                  </div>
                  {profile?.is_email_verified && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Đã xác thực
                    </div>
                  )}
                </div>

                <h2 className="font-bold text-[#334155] text-[15px] leading-tight">{profile?.full_name}</h2>
                {activeRole === 'FREELANCER' && eTitle && <p className="text-[13px] text-[#0F766E] font-semibold mt-0.5">{eTitle}</p>}
                {activeRole === 'EMPLOYER' && eCompanyName && <p className="text-[13px] text-[#0F766E] font-semibold mt-0.5">{eCompanyName}</p>}
                <p className="text-xs text-[#94A3B8] mt-0.5">{profile?.email}</p>
                {activeRole === 'FREELANCER' && (
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    <span className="material-symbols-outlined text-[15px] fill-amber-500">star</span>
                    <span className="text-xs font-bold text-slate-700">
                      {profile?.rating_average ? Number(profile.rating_average).toFixed(1) : '0.0'}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({profile?.total_reviews || 0} đánh giá)
                    </span>
                  </div>
                )}

                {activeRole === 'FREELANCER' && (
                  <div className="mt-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${avail.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />{avail.label}
                    </span>
                  </div>
                )}

                {activeRole === 'FREELANCER' && eRate && (
                  <div className="mt-3 flex items-center gap-2 text-[#334155]">
                    <span className="material-symbols-outlined text-[16px] text-[#0F766E]">payments</span>
                    <span className="text-sm font-bold">{parseInt(eRate).toLocaleString('vi-VN')}<span className="font-normal text-[#94A3B8] text-xs"> đ/giờ</span></span>
                  </div>
                )}

                {activeRole === 'EMPLOYER' && eLocation && (
                  <div className="mt-3 flex items-center gap-2 text-[#94A3B8] text-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span>{eLocation}</span>
                  </div>
                )}
              </div>

              {/* Profile completion */}
              {!isPublicView && (
                <div className="px-5 pb-5 border-t border-[#F1F5F9] pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wide">Độ hoàn thiện hồ sơ</span>
                    <span className={`text-[11px] font-bold ${pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                      style={{ width:`${pct}%` }} />
                  </div>
                  {pct < 100 && (
                    <p className="text-[11px] text-[#94A3B8] mt-1.5">
                      {pct < 50 ? 'Thêm thông tin để thu hút khách hàng.' : pct < 80 ? 'Gần xong rồi — hãy thêm kỹ năng!' : 'Hồ sơ tốt! Hãy thêm link portfolio.'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stats card (Freelancer) */}
            {activeRole === 'FREELANCER' && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569] mb-3">Thống kê</p>
                <div className="space-y-3">
                  {[
                    { icon:'star', label:'Điểm đánh giá',    value: profile?.rating_average ? `${Number(profile.rating_average).toFixed(1)} / 5.0` : 'Chưa có',      color:'text-amber-500' },
                    { icon:'rate_review', label:'Lượt đánh giá',    value: profile?.total_reviews ? `${profile.total_reviews} lượt` : '0 lượt',      color:'text-[#0F766E]' },
                    { icon:'schedule', label:'Thời gian phản hồi', value:'< 1 giờ', color:'text-blue-500' },
                    { icon:'calendar_today', label:'Thành viên từ', value: fmtDate(profile?.created_at), color:'text-[#475569]' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[16px] ${s.color}`}>{s.icon}</span>
                        <span className="text-[13px] text-[#475569]">{s.label}</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#334155]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company info (Employer) */}
            {activeRole === 'EMPLOYER' && (eCompanyName || eIndustry) && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569] mb-3">Thông tin công ty</p>
                <div className="space-y-2">
                  {eCompanyName && (
                    <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">business</span>{eCompanyName}
                    </div>
                  )}
                  {eIndustry && (
                    <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">category</span>{eIndustry}
                    </div>
                  )}
                  {eCompanySize && (
                    <div className="flex items-center gap-2 text-[13px] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">groups</span>{eCompanySize} nhân viên
                    </div>
                  )}
                  {eWebsite && (
                    <a href={eWebsite} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[13px] text-[#0F766E] hover:underline">
                      <span className="material-symbols-outlined text-[16px]">language</span>Website công ty
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {isFL && eSkills.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569]">Kỹ năng</p>
                  {!isPublicView && (
                    <button onClick={() => goTab('professional')} className="text-[11px] text-[#0F766E] font-semibold hover:underline">Sửa</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {eSkills.map(s => (
                    <span key={s} className="text-[12px] bg-[#F8FAFC] text-[#475569] px-2.5 py-1 rounded-lg border border-[#E2E8F0] font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(ePortfolio || eLinkedIn || eGitHub || profile?.phone) && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569] mb-3">Liên kết & Liên hệ</p>
                <div className="space-y-2.5">
                  {profile?.phone && (
                    <div className="flex items-center gap-2.5 text-[13px] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">phone</span>{profile.phone}
                    </div>
                  )}
                  {ePortfolio && <a href={ePortfolio} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#0F766E] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">language</span>Website Portfolio
                  </a>}
                  {eLinkedIn && <a href={eLinkedIn} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#0077B5] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">contacts</span>LinkedIn
                  </a>}
                  {eGitHub && <a href={eGitHub} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#334155] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">code</span>GitHub
                  </a>}
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-2">
              {TABS.map(t => (
                <button key={t.id} onClick={() => goTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-left
                    ${tab === t.id
                      ? t.danger ? 'bg-red-50 text-red-600' : 'bg-[#0F766E]/10 text-[#0F766E]'
                      : t.danger ? 'text-red-400 hover:bg-red-50 hover:text-red-500' : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#334155]'
                    }`}>
                  <span className={`material-symbols-outlined text-[18px] ${tab === t.id ? (t.danger ? 'text-red-500' : 'text-[#0F766E]') : t.danger ? 'text-red-400' : 'text-[#94A3B8]'}`}>{t.icon}</span>
                  {t.label}
                  {tab === t.id && <span className={`ml-auto w-1.5 h-1.5 rounded-full ${t.danger ? 'bg-red-500' : 'bg-[#0F766E]'}`} />}
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="min-w-0">
            <Toast type={alert.type} msg={alert.msg} onClose={() => setAlert({ type:'', msg:'' })} />

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div className="space-y-4">
                {/* About */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#334155]">Giới thiệu</h3>
                    {!isPublicView && (
                      <button onClick={() => goTab('edit')}
                        className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>Sửa
                      </button>
                    )}
                  </div>
                  {profile?.bio
                    ? <p className="text-[14px] text-[#475569] leading-relaxed">{profile.bio}</p>
                    : <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">description</span>
                        <p className="text-sm text-[#94A3B8] mb-3">Chưa có thông tin giới thiệu.</p>
                        {!isPublicView && (
                          <button onClick={() => goTab('edit')}
                            className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                            + Thêm giới thiệu chuyên nghiệp
                          </button>
                        )}
                      </div>
                  }
                </div>

                {/* Personal details */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon:'badge',    label:'Họ và tên',       val: profile?.full_name },
                      { icon:'mail',     label:'Địa chỉ Email',   val: profile?.email },
                      { icon:'phone',    label:'Số điện thoại',   val: profile?.phone || 'Chưa cung cấp' },
                      { icon:'manage_accounts', label:'Vai trò', val: profile?.role_default === 'FREELANCER' ? 'Freelancer' : profile?.role_default === 'EMPLOYER' ? 'Nhà tuyển dụng' : profile?.role_default },
                      { icon:'verified', label:'Trạng thái Email', val: profile?.is_email_verified ? 'Đã xác thực ✓' : 'Chưa xác thực' },
                      { icon:'schedule', label:'Thành viên từ',   val: fmtDate(profile?.created_at) },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                        <span className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[15px] text-[#0F766E]">{item.icon}</span>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{item.label}</p>
                          <p className="text-[13px] font-semibold text-[#334155] mt-0.5 truncate">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Freelancer professional info */}
                {activeRole === 'FREELANCER' && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Thông tin nghề nghiệp</h3>
                      {!isPublicView && (
                        <button onClick={() => goTab('professional')}
                          className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit</span>Sửa
                        </button>
                      )}
                    </div>
                    {(eTitle || eRate || eExp) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {eTitle && <div className="sm:col-span-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Chức danh</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{eTitle}</p>
                        </div>}
                        {eRate && <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Giá theo giờ</p>
                          <p className="text-[13px] font-bold text-[#0F766E]">{parseInt(eRate).toLocaleString('vi-VN')} đ/giờ</p>
                        </div>}
                        {eExp && <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Kinh nghiệm</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{EXP.find(e => e.v === eExp)?.label}</p>
                        </div>}
                        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Tình trạng</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{avail.label}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">work</span>
                        <p className="text-sm text-[#94A3B8] mb-3">Chưa có thông tin nghề nghiệp.</p>
                        {!isPublicView && (
                          <button onClick={() => goTab('professional')}
                            className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                            + Đặt giá theo giờ & kỹ năng
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Employer company overview */}
                {activeRole === 'EMPLOYER' && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Thông tin công ty</h3>
                      {!isPublicView && (
                        <button onClick={() => goTab('company')}
                          className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit</span>Sửa
                        </button>
                      )}
                    </div>
                    {eCompanyName ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label:'Tên công ty', val: eCompanyName, icon:'business' },
                          { label:'Ngành nghề', val: eIndustry || 'Chưa cập nhật', icon:'category' },
                          { label:'Quy mô', val: eCompanySize ? `${eCompanySize} nhân viên` : 'Chưa cập nhật', icon:'groups' },
                          { label:'Địa điểm', val: eLocation || 'Chưa cập nhật', icon:'location_on' },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                            <span className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="material-symbols-outlined text-[15px] text-[#0F766E]">{item.icon}</span>
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">{item.label}</p>
                              <p className="text-[13px] font-semibold text-[#334155] mt-0.5 truncate">{item.val}</p>
                            </div>
                          </div>
                        ))}
                        {eCompanyDesc && (
                          <div className="sm:col-span-2 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Mô tả công ty</p>
                            <p className="text-[13px] text-[#475569] leading-relaxed">{eCompanyDesc}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">business</span>
                        <p className="text-sm text-[#94A3B8] mb-3">Chưa có thông tin công ty.</p>
                        {!isPublicView && (
                          <button onClick={() => goTab('company')}
                            className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                            + Thêm thông tin công ty
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Skills overview */}
                {activeRole === 'FREELANCER' && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Kỹ năng <span className="text-[#94A3B8] font-normal text-sm">({eSkills.length}/15)</span></h3>
                      {!isPublicView && (
                        <button onClick={() => goTab('professional')}
                          className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit</span>Sửa
                        </button>
                      )}
                    </div>
                    {eSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {eSkills.map(s => (
                          <span key={s} className="text-[13px] bg-teal-50 text-[#0F766E] px-3 py-1.5 rounded-lg border border-teal-100 font-medium">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">psychology</span>
                        <p className="text-sm text-[#94A3B8] mb-3">Chưa có kỹ năng nào.</p>
                        {!isPublicView && (
                          <button onClick={() => goTab('professional')}
                            className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                            + Thêm kỹ năng của bạn
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Portfolios overview */}
                {activeRole === 'FREELANCER' && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Dự án Portfolio <span className="text-[#94A3B8] font-normal text-sm">({portfolios.length})</span></h3>
                      <button onClick={() => goTab('professional')}
                        className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>Quản lý
                      </button>
                    </div>
                    {portfolios.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {portfolios.map(p => (
                          <div key={p.portfolio_id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col hover:shadow-sm transition-all">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover" />
                            ) : (
                              <div className="w-full h-32 bg-slate-200 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl">image</span>
                              </div>
                            )}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{p.title}</h4>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.description}</p>
                              </div>
                              {p.project_url && (
                                <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#0F766E] mt-3 hover:underline inline-flex items-center gap-0.5">
                                  Xem dự án <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">folder_special</span>
                        <p className="text-sm text-[#94A3B8] mb-3">Chưa có dự án portfolio nào.</p>
                        <button onClick={() => goTab('professional')}
                          className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                          + Thêm dự án portfolio
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews List */}
                {activeRole === 'FREELANCER' && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <h3 className="font-bold text-[#334155] mb-4">
                      Đánh giá từ khách hàng ({reviews.length})
                    </h3>
                    {reviews.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {reviews.map((rev) => (
                          <div key={rev.review_id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#0F766E] flex items-center justify-center font-bold text-sm border border-slate-200">
                                  {rev.reviewer_avatar ? (
                                    <img src={rev.reviewer_avatar} alt={rev.reviewer_name} className="w-full h-full object-cover rounded-xl" />
                                  ) : (
                                    initials(rev.reviewer_name)
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{rev.reviewer_name}</h4>
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span 
                                        key={star} 
                                        className={`material-symbols-outlined text-[14px] ${
                                          star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                        }`}
                                      >
                                        star
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-slate-400">
                                {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2 pl-12 italic">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">rate_review</span>
                        <p className="text-sm text-[#94A3B8]">Chưa có đánh giá nào từ khách hàng.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── EDIT PROFILE ── */}
            {tab === 'edit' && (
              <form onSubmit={save} className="space-y-4">
                {/* Avatar */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-4">Ảnh đại diện</h3>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F766E] to-[#0D9488] flex-shrink-0 shadow-md">
                      {aPreview
                        ? <img src={aPreview} alt="avatar" className="w-full h-full object-cover" />
                        : <span className="w-full h-full flex items-center justify-center text-xl font-bold text-white">{initials(eName)}</span>
                      }
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => fileRef.current?.click()}
                          className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#475569] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-teal-50 transition-all">
                          <span className="material-symbols-outlined text-[16px]">upload</span>Tải ảnh lên
                        </button>
                        {aPreview && (
                          <button type="button" onClick={() => { setAPreview(''); setEAvatar(''); }}
                            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all">
                            <span className="material-symbols-outlined text-[16px]">delete</span>Xóa
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8]">JPG, PNG hoặc WebP · tối đa 2 MB · khuyến nghị 400×400 px</p>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                    <Field label="Hoặc dán đường dẫn ảnh" note="Liên kết trực tiếp đến ảnh trực tuyến.">
                      <Input icon="link" type="url" value={eAvatar.startsWith('data:') ? '' : eAvatar}
                        onChange={e => { setEAvatar(e.target.value); setAPreview(e.target.value); }}
                        placeholder="https://example.com/photo.jpg" />
                    </Field>
                  </div>
                </div>

                {/* Basic info */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Họ và tên" required>
                      <Input icon="badge" value={eName} onChange={e => setEName(e.target.value)} placeholder="Nguyễn Văn An" />
                    </Field>
                    <Field label="Số điện thoại" note="Dùng để xác minh tài khoản.">
                      <Input icon="phone" type="tel" value={ePhone} onChange={e => setEPhone(e.target.value)} placeholder="0912345678" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Địa chỉ Email" note="Email không thể thay đổi sau khi đăng ký.">
                        <Input icon="mail" value={profile?.email || ''} readOnly />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Giới thiệu bản thân" note="Viết một đoạn giới thiệu ngắn — đây là thứ đầu tiên khách hàng nhìn thấy.">
                        <div className="relative">
                          <textarea value={eBio} onChange={e => setEBio(e.target.value)} maxLength={600} rows={5}
                            placeholder="Mô tả nền tảng, chuyên môn và điều gì làm bạn nổi bật…"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] resize-none focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all" />
                          <span className="absolute bottom-3 right-3 text-xs text-[#94A3B8]">{eBio.length}/600</span>
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60">
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu…</> : <><span className="material-symbols-outlined text-[17px]">save</span>Lưu thay đổi</>}
                  </button>
                  <button type="button" onClick={() => { setEName(profile?.full_name||''); setEPhone(profile?.phone||''); setEBio(profile?.bio||''); setEAvatar(profile?.avatar_url||''); setAPreview(profile?.avatar_url||''); setAlert({type:'',msg:''}); }}
                    className="px-5 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all">
                    Hủy thay đổi
                  </button>
                </div>
              </form>
            )}

            {/* ── PROFESSIONAL (Freelancer only) ── */}
            {tab === 'professional' && isFL && (
              <form onSubmit={save} className="space-y-4">
                {/* Title, Rate, Experience */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Thông tin nghề nghiệp</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Thông tin này hiển thị trên hồ sơ công khai và trong kết quả tìm kiếm.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Chức danh chuyên nghiệp" required note='Ví dụ: "Lập trình viên Full-Stack · React · Node.js"'>
                        <Input icon="title" value={eTitle} onChange={e => setETitle(e.target.value)}
                          placeholder="Lập trình viên Full-Stack · React & Node.js" />
                      </Field>
                    </div>
                    <Field label="Giá theo giờ (VNĐ)" note="Mức giá tiêu chuẩn theo giờ. Khách hàng sẽ thấy trên hồ sơ của bạn.">
                      <Input prefix="đ" type="number" value={eRate} onChange={e => setERate(e.target.value)} placeholder="150000" />
                    </Field>
                    <Field label="Cấp độ kinh nghiệm">
                      <select value={eExp} onChange={e => setEExp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all">
                        {EXP.map(o => <option key={o.v} value={o.v}>{o.label} — {o.sub}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Tình trạng sẵn sàng</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Hiển thị trên hồ sơ để khách hàng biết bạn có thể nhận việc mới không.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {AVAIL.map(opt => (
                      <button key={opt.v} type="button" onClick={() => setEAvail(opt.v)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                          ${eAvail === opt.v ? 'border-[#0F766E] bg-teal-50' : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'}`}>
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${opt.dot}`} />
                        <span className={`text-[13px] font-semibold ${eAvail === opt.v ? 'text-[#0F766E]' : 'text-[#475569]'}`}>{opt.label}</span>
                        {eAvail === opt.v && <span className="ml-auto material-symbols-outlined text-[16px] text-[#0F766E]">check_circle</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-[#334155]">Kỹ năng</h3>
                    <span className="text-[12px] text-[#94A3B8] font-medium">{eSkills.length}/15 đã thêm</span>
                  </div>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Thêm tối đa 15 kỹ năng. Giúp khách hàng tìm thấy bạn trong tìm kiếm.</p>

                  {eSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                      {eSkills.map(s => (
                        <span key={s} className="flex items-center gap-1 bg-teal-50 text-[#0F766E] text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-teal-200">
                          {s}
                          <button type="button" onClick={() => setESkills(p => p.filter(x => x !== s))}
                            className="ml-1 text-teal-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[13px]">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1 group">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-[#94A3B8] group-focus-within:text-[#0F766E] transition-colors pointer-events-none">search</span>
                      <input type="text" value={skillQ} onChange={e => setSkillQ(e.target.value)}
                        onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); addSkill(skillQ); } }}
                        placeholder="Nhập kỹ năng và nhấn Enter…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all" />
                    </div>
                    <button type="button" onClick={() => addSkill(skillQ)}
                      className="px-4 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] transition-all shrink-0">
                      Thêm
                    </button>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8] mb-2">Kỹ năng phổ biến</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILLS.filter(s => !eSkills.includes(s)).map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)}
                          className="text-[12px] bg-white text-[#475569] px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-teal-50 transition-all font-medium">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Portfolio & Liên kết mạng xã hội</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Chia sẻ công việc và kết nối với khách hàng trên các nền tảng khác.</p>
                  <div className="space-y-4">
                    <Field label="Website Portfolio" note="Website cá nhân, Behance, Dribbble, v.v.">
                      <Input icon="language" type="url" value={ePortfolio} onChange={e => setEPortfolio(e.target.value)} placeholder="https://yourportfolio.com" />
                    </Field>
                    <Field label="Hồ sơ LinkedIn">
                      <Input icon="contacts" type="url" value={eLinkedIn} onChange={e => setELinkedIn(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                    </Field>
                    <Field label="Hồ sơ GitHub">
                      <Input icon="code" type="url" value={eGitHub} onChange={e => setEGitHub(e.target.value)} placeholder="https://github.com/yourusername" />
                    </Field>
                  </div>
                </div>

                {/* Portfolios list in professional tab */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-[#334155] mb-1">Dự án Portfolio</h3>
                      <p className="text-[13px] text-[#94A3B8]">Thêm các sản phẩm nổi bật của bạn để thu hút nhà tuyển dụng.</p>
                    </div>
                    <button type="button" onClick={() => handleOpenPortModal()} className="px-4 py-2 bg-[#0F766E] text-white text-xs font-bold rounded-xl hover:bg-[#0D5E58] transition-all border-none cursor-pointer">
                      + Thêm dự án
                    </button>
                  </div>

                  {portfolios.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {portfolios.map(p => (
                        <div key={p.portfolio_id} className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col hover:shadow-sm transition-all relative">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover" />
                          ) : (
                            <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined text-3xl">image</span>
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{p.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                              {p.project_url ? (
                                <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-0.5">
                                  Liên kết <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>
                              ) : <span />}
                              <div className="flex gap-2">
                                <button type="button" onClick={() => handleOpenPortModal(p)} className="p-1 text-slate-500 hover:text-[#0F766E] bg-transparent border-none cursor-pointer">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button type="button" onClick={() => handleDeletePortfolio(p.portfolio_id)} className="p-1 text-slate-400 hover:text-red-500 bg-transparent border-none cursor-pointer">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                      <span className="material-symbols-outlined text-[36px] text-slate-400 mb-2">folder</span>
                      <p className="text-xs text-slate-500">Chưa có dự án portfolio nào được thêm.</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60">
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu…</> : <><span className="material-symbols-outlined text-[17px]">save</span>Lưu tất cả</>}
                  </button>
                </div>
              </form>
            )}

            {/* ── COMPANY (Employer only) ── */}
            {tab === 'company' && isEM && (
              <form onSubmit={save} className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Thông tin công ty</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Thông tin này hiển thị trên các dự án bạn đăng và giúp freelancer hiểu về công ty.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Tên công ty" required>
                        <Input icon="business" value={eCompanyName} onChange={e => setECompanyName(e.target.value)} placeholder="Công ty TNHH ABC" />
                      </Field>
                    </div>
                    <Field label="Ngành nghề">
                      <select value={eIndustry} onChange={e => setEIndustry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all">
                        <option value="">Chọn ngành nghề</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Quy mô công ty">
                      <select value={eCompanySize} onChange={e => setECompanySize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all">
                        <option value="">Chọn quy mô</option>
                        <option value="1-10">1 – 10 nhân viên</option>
                        <option value="11-50">11 – 50 nhân viên</option>
                        <option value="51-200">51 – 200 nhân viên</option>
                        <option value="201-500">201 – 500 nhân viên</option>
                        <option value="500+">Trên 500 nhân viên</option>
                      </select>
                    </Field>
                    <Field label="Địa điểm" note="Tỉnh/thành phố hoặc địa chỉ công ty.">
                      <Input icon="location_on" value={eLocation} onChange={e => setELocation(e.target.value)} placeholder="Hà Nội, Việt Nam" />
                    </Field>
                    <Field label="Website công ty">
                      <Input icon="language" type="url" value={eWebsite} onChange={e => setEWebsite(e.target.value)} placeholder="https://company.com" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Mô tả công ty" note="Giới thiệu ngắn gọn về công ty, lĩnh vực hoạt động và văn hóa doanh nghiệp.">
                        <div className="relative">
                          <textarea value={eCompanyDesc} onChange={e => setECompanyDesc(e.target.value)} maxLength={500} rows={4}
                            placeholder="Công ty chúng tôi chuyên về…"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] resize-none focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all" />
                          <span className="absolute bottom-3 right-3 text-xs text-[#94A3B8]">{eCompanyDesc.length}/500</span>
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60">
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang lưu…</> : <><span className="material-symbols-outlined text-[17px]">save</span>Lưu thông tin công ty</>}
                  </button>
                  <button type="button" onClick={() => { setECompanyName(extras?.companyName||''); setEIndustry(extras?.industry||''); setECompanySize(extras?.companySize||''); setEWebsite(extras?.website||''); setECompanyDesc(extras?.companyDesc||''); setELocation(extras?.location||''); setAlert({type:'',msg:''}); }}
                    className="px-5 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all">
                    Hủy thay đổi
                  </button>
                </div>
              </form>
            )}

            {/* ── SECURITY ── */}
            {tab === 'security' && (
              <div className="space-y-4">
                <form onSubmit={changePwd}>
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <h3 className="font-bold text-[#334155] mb-1">Đổi mật khẩu</h3>
                    <p className="text-[13px] text-[#94A3B8] mb-5">Chọn mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
                    <div className="max-w-sm space-y-4">
                      <Field label="Mật khẩu hiện tại" required>
                        <Input icon="lock" type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Nhập mật khẩu hiện tại" autoComplete="current-password" />
                      </Field>
                      <div className="h-px bg-[#F1F5F9]" />
                      <div>
                        <Field label="Mật khẩu mới" required>
                          <Input icon="lock_open" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Nhập mật khẩu mới" autoComplete="new-password" />
                        </Field>
                        <PwdStrength p={newPwd} />
                      </div>
                      <div>
                        <Field label="Xác nhận mật khẩu mới" required>
                          <Input icon="lock_reset" type="password" value={conPwd} onChange={e => setConPwd(e.target.value)} placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" />
                        </Field>
                        {conPwd && (
                          <p className={`mt-1.5 text-xs flex items-center gap-1 ${newPwd===conPwd ? 'text-emerald-600' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-[13px]">{newPwd===conPwd ? 'check_circle' : 'error'}</span>
                            {newPwd===conPwd ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                          </p>
                        )}
                      </div>
                      <button type="submit" disabled={savingPwd}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] transition-all disabled:opacity-60">
                        {savingPwd ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang cập nhật…</> : <><span className="material-symbols-outlined text-[17px]">check_circle</span>Cập nhật mật khẩu</>}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Session */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Phiên đăng nhập</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Đăng xuất khỏi thiết bị này.</p>
                  <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all">
                    <span className="material-symbols-outlined text-[17px]">logout</span>Đăng xuất
                  </button>
                </div>
              </div>
            )}

            {/* ── DANGER ── */}
            {tab === 'danger' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-red-200 shadow-[0_2px_12px_rgba(15,23,42,0.015)] overflow-hidden">
                  <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-red-500">warning</span>
                    <div>
                      <h3 className="font-bold text-red-800 text-[14px]">Khu vực nguy hiểm</h3>
                      <p className="text-[12px] text-red-600">Các hành động tại đây không thể hoàn tác.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#334155] text-[14px] mb-1">Xóa tài khoản</h4>
                        <p className="text-[13px] text-[#475569] mb-3">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan bao gồm:</p>
                        <ul className="space-y-1.5 mb-4">
                          {['Thông tin hồ sơ và portfolio','Lịch sử giao dịch & thanh toán','Tất cả dự án và đề xuất đang hoạt động','Tin nhắn và tệp đính kèm'].map(i => (
                            <li key={i} className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{i}
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => { setShowDel(true); setDelPwd(''); setDelText(''); setAlert({type:'',msg:''}); }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-[13px] font-bold rounded-xl hover:bg-red-600 transition-all">
                          <span className="material-symbols-outlined text-[16px]">delete_forever</span>Xóa tài khoản của tôi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

    {/* ── Delete Modal ── */}
    {showDel && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden"
          style={{ animation:'fadeScale .2s ease' }}>
          <div className="px-6 py-5 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px] text-red-500">warning</span>
              </div>
              <div>
                <h3 className="font-bold text-[#334155]">Xóa tài khoản</h3>
                <p className="text-xs text-[#94A3B8]">Hành động này không thể hoàn tác</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Toast type={alert.type} msg={alert.msg} onClose={() => setAlert({type:'',msg:''})} />
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">
                Gõ <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">XÓA TÀI KHOẢN</span> để xác nhận
              </label>
              <input value={delText} onChange={e => setDelText(e.target.value)} placeholder="XÓA TÀI KHOẢN"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-mono text-[#334155] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Mật khẩu hiện tại</label>
              <Input icon="lock" type="password" value={delPwd} onChange={e => setDelPwd(e.target.value)} placeholder="Nhập mật khẩu của bạn" />
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => setShowDel(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-all">
              Hủy
            </button>
            <button onClick={doDelete} disabled={deleting || delText!=='XÓA TÀI KHOẢN' || !delPwd}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {deleting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xóa…</> : <><span className="material-symbols-outlined text-[16px]">delete_forever</span>Xóa tài khoản</>}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Portfolio Add/Edit Modal ── */}
    {showPortModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation:'fadeScale .2s ease' }}>
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">
              {editingPort ? 'Chỉnh sửa dự án' : 'Thêm dự án Portfolio'}
            </h3>
            <button onClick={() => setShowPortModal(false)} className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <form onSubmit={handleSavePortfolio}>
            <div className="p-6 space-y-4">
              <Field label="Tiêu đề dự án" required>
                <Input icon="title" value={portTitle} onChange={e => setPortTitle(e.target.value)} placeholder="Ví dụ: Thiết kế App Tài chính" />
              </Field>
              <Field label="Mô tả dự án">
                <textarea value={portDesc} onChange={e => setPortDesc(e.target.value)} rows="4" placeholder="Mô tả chi tiết về sản phẩm, công nghệ sử dụng, vai trò của bạn..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] transition-all resize-none" />
              </Field>
              <Field label="Đường dẫn dự án (Website, GitHub...)">
                <Input icon="link" type="url" value={portUrl} onChange={e => setPortUrl(e.target.value)} placeholder="https://..." />
              </Field>
              <Field label="Đường dẫn ảnh mô tả (Hình ảnh sản phẩm)">
                <Input icon="image" type="url" value={portImage} onChange={e => setPortImage(e.target.value)} placeholder="https://example.com/mockup.png" />
              </Field>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button type="button" onClick={() => setShowPortModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Hủy
              </button>
              <button type="submit" disabled={saving || !portTitle.trim()} className="flex-1 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0D5E58] transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer border-none">
                {saving ? 'Đang lưu...' : 'Lưu dự án'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <style>{`
      @keyframes fadeScale { from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)} }
    `}</style>
    </>
  );
}
