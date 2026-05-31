import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:5000/api';

/* ─── helpers ─── */
const initials = (n = '') => n.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

const SKILLS = [
  'React','Vue.js','Angular','Next.js','Node.js','Express','Django','Laravel','PHP',
  'Python','Java','C#','TypeScript','JavaScript','HTML/CSS','Tailwind CSS','PostgreSQL',
  'MySQL','MongoDB','Firebase','AWS','Docker','Git','Figma','UI/UX Design',
  'Graphic Design','Flutter','React Native','WordPress','SEO','Content Writing',
  'Data Analysis','Machine Learning','DevOps','Kotlin','Swift',
];

const AVAIL = [
  { v:'AVAILABLE',   label:'Available for work',  dot:'bg-emerald-500', pill:'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { v:'BUSY',        label:'Actively working',     dot:'bg-amber-500',   pill:'bg-amber-50 text-amber-700 border-amber-200'   },
  { v:'UNAVAILABLE', label:'Not available',        dot:'bg-slate-400',   pill:'bg-slate-100 text-slate-500 border-slate-200'  },
];
const EXP = [
  { v:'ENTRY',        label:'Entry Level',    sub:'0 – 1 year' },
  { v:'INTERMEDIATE', label:'Intermediate',   sub:'1 – 3 years' },
  { v:'EXPERT',       label:'Expert',         sub:'3+ years' },
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
  const lbl = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= s ? bar[s] : 'bg-[#E2E8F0]'}`} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {['8+ chars','Uppercase','Lowercase','Number','Special'].map((l,i) => (
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
function calcCompletion(p, extras) {
  const fields = [
    !!p?.full_name, !!p?.email, !!p?.phone, !!p?.bio, !!p?.avatar_url,
    !!extras?.title, !!extras?.hourlyRate, extras?.skills?.length > 0,
    !!extras?.portfolio,
  ];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
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
  const [tab, setTab]         = useState('overview'); // overview | edit | professional | security | danger
  const [saving, setSaving]   = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [alert, setAlert]     = useState({ type: '', msg: '' });

  /* edit - basic */
  const [eName, setEName]       = useState('');
  const [ePhone, setEPhone]     = useState('');
  const [eBio, setEBio]         = useState('');
  const [eAvatar, setEAvatar]   = useState('');
  const [aPreview, setAPreview] = useState('');

  /* edit - professional */
  const [eTitle, setETitle]     = useState('');
  const [eRate, setERate]       = useState('');
  const [eAvail, setEAvail]     = useState('AVAILABLE');
  const [eExp, setEExp]         = useState('INTERMEDIATE');
  const [eSkills, setESkills]   = useState([]);
  const [ePortfolio, setEPortfolio] = useState('');
  const [eLinkedIn, setELinkedIn]   = useState('');
  const [eGitHub, setEGitHub]       = useState('');
  const [skillQ, setSkillQ]         = useState('');

  /* security */
  const [oldPwd, setOldPwd]     = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [conPwd, setConPwd]     = useState('');

  /* delete */
  const [showDel, setShowDel]   = useState(false);
  const [delPwd, setDelPwd]     = useState('');
  const [delText, setDelText]   = useState('');

  const fileRef = useRef();
  const isFL = profile?.role_default === 'FREELANCER';

  /* ── fetch ── */
  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        const u = data.user;
        setProfile(u);
        setEName(u.full_name || ''); setEPhone(u.phone || '');
        setEBio(u.bio || ''); setEAvatar(u.avatar_url || ''); setAPreview(u.avatar_url || '');
        let ex = {};
        try { ex = u.bio_extras ? JSON.parse(u.bio_extras) : {}; } catch {}
        setExtras(ex);
        setETitle(ex.title || ''); setERate(ex.hourlyRate || '');
        setEAvail(ex.availability || 'AVAILABLE'); setEExp(ex.experience || 'INTERMEDIATE');
        setESkills(ex.skills || []);
        setEPortfolio(ex.portfolio || ''); setELinkedIn(ex.linkedin || ''); setEGitHub(ex.github || '');
      }
    } catch { setAlert({ type:'error', msg:'Connection error.' }); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (token) load(); else setLoading(false); }, []);

  /* ── avatar ── */
  const onFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2*1024*1024) { setAlert({ type:'error', msg:'Image must be under 2 MB.' }); return; }
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
    if (!eName.trim()) { setAlert({ type:'error', msg:'Full name is required.' }); return; }
    setSaving(true);
    const ex = isFL ? { title:eTitle, hourlyRate:eRate, availability:eAvail, experience:eExp, skills:eSkills, portfolio:ePortfolio, linkedin:eLinkedIn, github:eGitHub } : {};
    try {
      const res  = await fetch(`${API}/user/profile`, {
        method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ fullName:eName.trim(), phone:ePhone||null, bio:eBio||null,
          avatarUrl: eAvatar||null, bioExtras: isFL ? JSON.stringify(ex) : null }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type:'success', msg:'Profile updated successfully!' });
        if (data.user) { setProfile(prev => ({ ...prev, ...data.user })); setExtras(ex);
          const s = localStorage.getItem('user');
          if (s) localStorage.setItem('user', JSON.stringify({ ...JSON.parse(s), fullName:data.user.full_name, avatarUrl:data.user.avatar_url }));
        }
      } else setAlert({ type:'error', msg: data.message || 'Update failed.' });
    } catch { setAlert({ type:'error', msg:'Connection error.' }); }
    finally { setSaving(false); }
  };

  /* ── change password ── */
  const changePwd = async e => {
    e.preventDefault(); setAlert({ type:'', msg:'' });
    if (newPwd !== conPwd) { setAlert({ type:'error', msg:'Passwords do not match.' }); return; }
    setSavingPwd(true);
    try {
      const res  = await fetch(`${API}/user/change-password`, {
        method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ oldPassword:oldPwd, newPassword:newPwd }),
      });
      const data = await res.json();
      if (res.ok) { setAlert({ type:'success', msg:'Password changed successfully!' }); setOldPwd(''); setNewPwd(''); setConPwd(''); }
      else setAlert({ type:'error', msg: data.message });
    } catch { setAlert({ type:'error', msg:'Connection error.' }); }
    finally { setSavingPwd(false); }
  };

  /* ── delete ── */
  const doDelete = async () => {
    if (delText !== 'DELETE ACCOUNT') { setAlert({ type:'error', msg:'Please type the exact confirmation phrase.' }); return; }
    setDeleting(true);
    try {
      const res  = await fetch(`${API}/user/account`, {
        method:'DELETE', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ password:delPwd }),
      });
      const data = await res.json();
      if (res.ok) { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; }
      else { setAlert({ type:'error', msg: data.message }); setShowDel(false); }
    } catch { setAlert({ type:'error', msg:'Connection error.' }); setShowDel(false); }
    finally { setDeleting(false); }
  };

  const goTab = t => { setTab(t); setAlert({ type:'', msg:'' }); };
  const avail = AVAIL.find(a => a.v === eAvail) || AVAIL[0];
  const pct = calcCompletion(profile, { ...extras, title:eTitle, hourlyRate:eRate, skills:eSkills, portfolio:ePortfolio });

  /* ── loading ── */
  if (loading) return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#94A3B8] font-medium">Loading profile…</p>
      </div>
    </main>
  );

  const avatarSrc = aPreview || profile?.avatar_url;

  /* ════════════════════════════════════
     TABS META
  ════════════════════════════════════ */
  const TABS = [
    { id:'overview',     icon:'person',        label:'Overview' },
    { id:'edit',         icon:'edit',          label:'Edit Profile' },
    ...(isFL ? [{ id:'professional', icon:'work', label:'Skills & Services' }] : []),
    { id:'security',     icon:'shield',        label:'Security' },
    { id:'danger',       icon:'delete_forever',label:'Account',     danger:true },
  ];

  return (
    <>
    <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-[1100px] mx-auto px-6 py-8">

        {/* ─── Page header ─── */}
        <div className="mb-6">
          <h1 className="font-headline-2xl text-headline-2xl text-[#334155]">My Profile</h1>
          <p className="font-body-base text-body-base text-[#475569] mt-1">Manage your public profile, skills, and account settings.</p>
        </div>

        {/* ─── Main grid: sidebar + content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ══════════════════════════════
              LEFT SIDEBAR
          ══════════════════════════════ */}
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
                    <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${avail.dot}`} title={avail.label} />
                  </div>
                  {profile?.is_email_verified && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                    </div>
                  )}
                </div>

                <h2 className="font-bold text-[#334155] text-[15px] leading-tight">{profile?.full_name}</h2>
                {eTitle && <p className="text-[13px] text-[#0F766E] font-semibold mt-0.5">{eTitle}</p>}
                <p className="text-xs text-[#94A3B8] mt-0.5">{profile?.email}</p>

                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${avail.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />{avail.label}
                  </span>
                </div>

                {isFL && eRate && (
                  <div className="mt-3 flex items-center gap-2 text-[#334155]">
                    <span className="material-symbols-outlined text-[16px] text-[#0F766E]">payments</span>
                    <span className="text-sm font-bold">${eRate}<span className="font-normal text-[#94A3B8] text-xs">/hr</span></span>
                  </div>
                )}
              </div>

              {/* Profile completion */}
              <div className="px-5 pb-5 border-t border-[#F1F5F9] pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wide">Profile Completion</span>
                  <span className={`text-[11px] font-bold ${pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                    style={{ width:`${pct}%` }} />
                </div>
                {pct < 100 && (
                  <p className="text-[11px] text-[#94A3B8] mt-1.5">
                    {pct < 50 ? 'Add more details to attract clients.' : pct < 80 ? 'Almost there — add your skills!' : 'Great profile! Add a portfolio link.'}
                  </p>
                )}
              </div>
            </div>

            {/* Stats card (Freelancer) */}
            {isFL && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569] mb-3">Stats</p>
                <div className="space-y-3">
                  {[
                    { icon:'star', label:'Job Success',    value:'—',      color:'text-amber-500' },
                    { icon:'work', label:'Projects Done',  value:'—',      color:'text-[#0F766E]' },
                    { icon:'schedule', label:'Avg Response', value:'< 1 hr', color:'text-blue-500' },
                    { icon:'calendar_today', label:'Member Since', value: fmtDate(profile?.created_at), color:'text-[#475569]' },
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

            {/* Skills */}
            {isFL && eSkills.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569]">Skills</p>
                  <button onClick={() => goTab('professional')} className="text-[11px] text-[#0F766E] font-semibold hover:underline">Edit</button>
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
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#475569] mb-3">Links & Contact</p>
                <div className="space-y-2.5">
                  {profile?.phone && (
                    <div className="flex items-center gap-2.5 text-[13px] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">phone</span>{profile.phone}
                    </div>
                  )}
                  {ePortfolio && <a href={ePortfolio} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#0F766E] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">language</span>Portfolio Website
                  </a>}
                  {eLinkedIn && <a href={eLinkedIn} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#0077B5] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">contacts</span>LinkedIn Profile
                  </a>}
                  {eGitHub && <a href={eGitHub} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[#334155] hover:underline">
                    <span className="material-symbols-outlined text-[16px]">code</span>GitHub Profile
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

          {/* ══════════════════════════════
              RIGHT CONTENT
          ══════════════════════════════ */}
          <div className="min-w-0">
            <Toast type={alert.type} msg={alert.msg} onClose={() => setAlert({ type:'', msg:'' })} />

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div className="space-y-4">
                {/* About */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#334155]">About</h3>
                    <button onClick={() => goTab('edit')}
                      className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">edit</span>Edit
                    </button>
                  </div>
                  {profile?.bio
                    ? <p className="text-[14px] text-[#475569] leading-relaxed">{profile.bio}</p>
                    : <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">description</span>
                        <p className="text-sm text-[#94A3B8] mb-3">No bio added yet.</p>
                        <button onClick={() => goTab('edit')}
                          className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                          + Add a professional summary
                        </button>
                      </div>
                  }
                </div>

                {/* Personal details */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon:'badge',    label:'Full Name',     val: profile?.full_name },
                      { icon:'mail',     label:'Email Address', val: profile?.email },
                      { icon:'phone',    label:'Phone Number',  val: profile?.phone || 'Not provided' },
                      { icon:'manage_accounts', label:'Account Role', val: profile?.role_default === 'FREELANCER' ? 'Freelancer' : profile?.role_default === 'EMPLOYER' ? 'Employer' : profile?.role_default },
                      { icon:'verified', label:'Email Status',  val: profile?.is_email_verified ? 'Verified ✓' : 'Not verified' },
                      { icon:'schedule', label:'Member Since',  val: fmtDate(profile?.created_at) },
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
                {isFL && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Professional Details</h3>
                      <button onClick={() => goTab('professional')}
                        className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>Edit
                      </button>
                    </div>
                    {(eTitle || eRate || eExp) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {eTitle && <div className="sm:col-span-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Professional Title</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{eTitle}</p>
                        </div>}
                        {eRate && <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Hourly Rate</p>
                          <p className="text-[13px] font-bold text-[#0F766E]">${eRate}/hr</p>
                        </div>}
                        {eExp && <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Experience</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{EXP.find(e => e.v === eExp)?.label}</p>
                        </div>}
                        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Availability</p>
                          <p className="text-[13px] font-semibold text-[#334155]">{avail.label}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="material-symbols-outlined text-[40px] text-[#CBD5E1] mb-2">work</span>
                        <p className="text-sm text-[#94A3B8] mb-3">No professional details added.</p>
                        <button onClick={() => goTab('professional')}
                          className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                          + Set hourly rate & skills
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills overview */}
                {isFL && (
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#334155]">Skills <span className="text-[#94A3B8] font-normal text-sm">({eSkills.length}/15)</span></h3>
                      <button onClick={() => goTab('professional')}
                        className="text-[12px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>Edit
                      </button>
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
                        <p className="text-sm text-[#94A3B8] mb-3">No skills added yet.</p>
                        <button onClick={() => goTab('professional')}
                          className="text-[13px] text-[#0F766E] font-semibold border border-[#0F766E]/30 px-4 py-1.5 rounded-lg hover:bg-teal-50">
                          + Add your skills
                        </button>
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
                  <h3 className="font-bold text-[#334155] mb-4">Profile Photo</h3>
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
                          <span className="material-symbols-outlined text-[16px]">upload</span>Upload Photo
                        </button>
                        {aPreview && (
                          <button type="button" onClick={() => { setAPreview(''); setEAvatar(''); }}
                            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all">
                            <span className="material-symbols-outlined text-[16px]">delete</span>Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8]">JPG, PNG or WebP · max 2 MB · recommended 400×400 px</p>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                    <Field label="Or paste an image URL" note="Direct link to an image hosted online.">
                      <Input icon="link" type="url" value={eAvatar.startsWith('data:') ? '' : eAvatar}
                        onChange={e => { setEAvatar(e.target.value); setAPreview(e.target.value); }}
                        placeholder="https://example.com/photo.jpg" />
                    </Field>
                  </div>
                </div>

                {/* Basic info */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <Input icon="badge" value={eName} onChange={e => setEName(e.target.value)} placeholder="John Smith" />
                    </Field>
                    <Field label="Phone Number" note="Used for account verification only.">
                      <Input icon="phone" type="tel" value={ePhone} onChange={e => setEPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Email Address" note="Email cannot be changed after registration.">
                        <Input icon="mail" value={profile?.email || ''} readOnly />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Professional Summary" note="Write a short introduction — this is the first thing clients see on your profile.">
                        <div className="relative">
                          <textarea value={eBio} onChange={e => setEBio(e.target.value)} maxLength={600} rows={5}
                            placeholder="Describe your background, expertise, and what makes you unique as a professional…"
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
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><span className="material-symbols-outlined text-[17px]">save</span>Save Changes</>}
                  </button>
                  <button type="button" onClick={() => { setEName(profile?.full_name||''); setEPhone(profile?.phone||''); setEBio(profile?.bio||''); setEAvatar(profile?.avatar_url||''); setAPreview(profile?.avatar_url||''); setAlert({type:'',msg:''}); }}
                    className="px-5 py-2.5 text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] rounded-xl transition-all">
                    Discard
                  </button>
                </div>
              </form>
            )}

            {/* ── PROFESSIONAL (Freelancer only) ── */}
            {tab === 'professional' && isFL && (
              <form onSubmit={save} className="space-y-4">
                {/* Title, Rate, Experience */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Professional Info</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">This information appears on your public profile and in search results.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Professional Title" required note='E.g. "Full-Stack Developer · React · Node.js" — shown below your name.'>
                        <Input icon="title" value={eTitle} onChange={e => setETitle(e.target.value)}
                          placeholder="Full-Stack Developer · React & Node.js" />
                      </Field>
                    </div>
                    <Field label="Hourly Rate (USD)" note="Set your standard hourly rate. Clients see this on your profile.">
                      <Input prefix="$" type="number" value={eRate} onChange={e => setERate(e.target.value)} placeholder="0.00" />
                    </Field>
                    <Field label="Experience Level">
                      <select value={eExp} onChange={e => setEExp(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all">
                        {EXP.map(o => <option key={o.v} value={o.v}>{o.label} — {o.sub}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Availability Status</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">This is shown on your profile so clients know if you're open to new projects.</p>
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
                    <h3 className="font-bold text-[#334155]">Skills</h3>
                    <span className="text-[12px] text-[#94A3B8] font-medium">{eSkills.length}/15 added</span>
                  </div>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Add up to 15 skills. These help clients find you in search.</p>

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
                        placeholder="Type a skill and press Enter…"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#334155] bg-white focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 hover:border-[#CBD5E1] transition-all" />
                    </div>
                    <button type="button" onClick={() => addSkill(skillQ)}
                      className="px-4 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] transition-all shrink-0">
                      Add
                    </button>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8] mb-2">Popular skills</p>
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
                  <h3 className="font-bold text-[#334155] mb-1">Portfolio & Social Links</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Share your work and connect with clients on other platforms.</p>
                  <div className="space-y-4">
                    <Field label="Portfolio Website" note="Your personal website, Behance, Dribbble, etc.">
                      <Input icon="language" type="url" value={ePortfolio} onChange={e => setEPortfolio(e.target.value)} placeholder="https://yourportfolio.com" />
                    </Field>
                    <Field label="LinkedIn Profile">
                      <Input icon="contacts" type="url" value={eLinkedIn} onChange={e => setELinkedIn(e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                    </Field>
                    <Field label="GitHub Profile">
                      <Input icon="code" type="url" value={eGitHub} onChange={e => setEGitHub(e.target.value)} placeholder="https://github.com/yourusername" />
                    </Field>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60">
                    {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><span className="material-symbols-outlined text-[17px]">save</span>Save All Changes</>}
                  </button>
                </div>
              </form>
            )}

            {/* ── SECURITY ── */}
            {tab === 'security' && (
              <div className="space-y-4">
                <form onSubmit={changePwd}>
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                    <h3 className="font-bold text-[#334155] mb-1">Change Password</h3>
                    <p className="text-[13px] text-[#94A3B8] mb-5">Choose a strong password to protect your account.</p>
                    <div className="max-w-sm space-y-4">
                      <Field label="Current Password" required>
                        <Input icon="lock" type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Enter current password" autoComplete="current-password" />
                      </Field>
                      <div className="h-px bg-[#F1F5F9]" />
                      <div>
                        <Field label="New Password" required>
                          <Input icon="lock_open" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Enter new password" autoComplete="new-password" />
                        </Field>
                        <PwdStrength p={newPwd} />
                      </div>
                      <div>
                        <Field label="Confirm New Password" required>
                          <Input icon="lock_reset" type="password" value={conPwd} onChange={e => setConPwd(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
                        </Field>
                        {conPwd && (
                          <p className={`mt-1.5 text-xs flex items-center gap-1 ${newPwd===conPwd ? 'text-emerald-600' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-[13px]">{newPwd===conPwd ? 'check_circle' : 'error'}</span>
                            {newPwd===conPwd ? 'Passwords match' : 'Passwords do not match'}
                          </p>
                        )}
                      </div>
                      <button type="submit" disabled={savingPwd}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0F766E] text-white text-sm font-bold rounded-xl hover:bg-[#0D5E58] transition-all disabled:opacity-60">
                        {savingPwd ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating…</> : <><span className="material-symbols-outlined text-[17px]">check_circle</span>Update Password</>}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Login sessions hint */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_12px_rgba(15,23,42,0.015)] p-6">
                  <h3 className="font-bold text-[#334155] mb-1">Active Session</h3>
                  <p className="text-[13px] text-[#94A3B8] mb-4">Sign out of your current session on this device.</p>
                  <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/login'; }}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all">
                    <span className="material-symbols-outlined text-[17px]">logout</span>Sign Out
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
                      <h3 className="font-bold text-red-800 text-[14px]">Danger Zone</h3>
                      <p className="text-[12px] text-red-600">Actions here are permanent and cannot be undone.</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#334155] text-[14px] mb-1">Delete Account</h4>
                        <p className="text-[13px] text-[#475569] mb-3">Permanently delete your account and all associated data including:</p>
                        <ul className="space-y-1.5 mb-4">
                          {['Profile information and portfolio','Transaction & payment history','All active projects and proposals','Messages and file attachments'].map(i => (
                            <li key={i} className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{i}
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => { setShowDel(true); setDelPwd(''); setDelText(''); setAlert({type:'',msg:''}); }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-[13px] font-bold rounded-xl hover:bg-red-600 transition-all">
                          <span className="material-symbols-outlined text-[16px]">delete_forever</span>Delete My Account
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
                <h3 className="font-bold text-[#334155]">Delete Account</h3>
                <p className="text-xs text-[#94A3B8]">This action cannot be undone</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Toast type={alert.type} msg={alert.msg} onClose={() => setAlert({type:'',msg:''})} />
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">
                Type <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">DELETE ACCOUNT</span> to confirm
              </label>
              <input value={delText} onChange={e => setDelText(e.target.value)} placeholder="DELETE ACCOUNT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-mono text-[#334155] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Current Password</label>
              <Input icon="lock" type="password" value={delPwd} onChange={e => setDelPwd(e.target.value)} placeholder="Enter your password" />
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={() => setShowDel(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-all">
              Cancel
            </button>
            <button onClick={doDelete} disabled={deleting || delText!=='DELETE ACCOUNT' || !delPwd}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {deleting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</> : <><span className="material-symbols-outlined text-[16px]">delete_forever</span>Delete Account</>}
            </button>
          </div>
        </div>
      </div>
    )}

    <style>{`
      @keyframes fadeScale { from{opacity:0;transform:scale(.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)} }
    `}</style>
    </>
  );
}
