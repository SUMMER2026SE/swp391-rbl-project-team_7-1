import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('view'); // 'view', 'edit', 'security'
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
    if (!token) {
      setUserProfile({
        full_name: 'Alex Nguyen',
        email: 'alex.nguyen@example.com',
        phone: '0987654321',
        role_default: 'FREELANCER',
        created_at: new Date('2024-01-15').toISOString(),
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoDfcb0ULIPAGFpFTGtxwLfbOB2oUqhUHF7jRLM04_2mQn41242YVyt0ooenMnEya06i1YgpOXU9R4PmQIlSr4JQXZWNC2kJ1Sf1pctYioZKS-Y_QjNfHzRKDH8Zw6N2I6vLk7b7YX4cmdNdgRygC0Ry3iVzCd_g-u6MQ99D7gUDuoua5m6LDVko-U3PIUVhPLVsJNauxWn2rBwRgfo1VnCItIQtaNLFp6o0Tv18-Da0ZBA5ZDbjbrcVV_ATaFKfPTqYrB0f0uFaA'
      });
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setUserProfile(data.user);
        setEditName(data.user.full_name);
        setEditPhone(data.user.phone || '');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ fullName: editName, phone: editPhone })
      });
      
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message);
        fetchProfile(); // Refresh data
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg('Lỗi cập nhật profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg(data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg('Lỗi đổi mật khẩu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">Loading...</div>;
  }

  const goBackDashboard = () => {
    const rawToken = localStorage.getItem('token');
    const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
    if (!token) {
      navigate('/browse-projects');
      return;
    }
    const userRole = userProfile?.role_default || 'FREELANCER';
    if (userRole === 'EMPLOYER') navigate('/employer-dashboard');
    else navigate('/freelancer-dashboard');
  };

  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;

  return (
    <div className="bg-[#F8FAFC] text-on-surface min-h-screen font-body-md">
      
      {/* Header - only if logged in */}
      {token && (
        <header className="bg-surface-container-lowest border-b border-outline-variant h-16 flex items-center px-lg">
          <div className="max-w-container-max mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-md">
              <button onClick={goBackDashboard} className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-label-md">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back to Dashboard
              </button>
            </div>
            <div className="font-headline-sm text-primary font-bold">FJMS Profile</div>
          </div>
        </header>
      )}

      <main className={`max-w-3xl mx-auto py-xl px-gutter ${!token ? 'pt-28 md:pt-32' : ''}`}>
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            {!token ? 'Freelancer Profile' : 'Account Settings'}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            {!token ? 'Public portfolio details and verified professional status.' : 'Manage your profile details and security preferences.'}
          </p>
        </div>

        {/* Tabs - only if logged in */}
        {token && (
          <div className="flex gap-md border-b border-outline-variant mb-xl">
            <button 
              className={`pb-2 font-label-md px-sm transition-colors border-b-2 ${activeTab === 'view' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => {setActiveTab('view'); setErrorMsg(''); setSuccessMsg('');}}
            >
              Overview
            </button>
            <button 
              className={`pb-2 font-label-md px-sm transition-colors border-b-2 ${activeTab === 'edit' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => {setActiveTab('edit'); setErrorMsg(''); setSuccessMsg('');}}
            >
              Edit Profile
            </button>
            <button 
              className={`pb-2 font-label-md px-sm transition-colors border-b-2 ${activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => {setActiveTab('security'); setErrorMsg(''); setSuccessMsg('');}}
            >
              Security
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg text-body-sm flex items-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-md p-md bg-tertiary-container text-on-tertiary-container rounded-lg text-body-sm flex items-center gap-sm">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Content: View */}
        {activeTab === 'view' && userProfile && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_2px_12px_rgba(15,23,42,0.015)] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-lg mb-xl">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 text-headline-lg font-bold text-[#1E293B]">
                {userProfile.avatarUrl ? (
                  <img alt={userProfile.full_name} className="w-full h-full object-cover rounded-full" src={userProfile.avatarUrl} />
                ) : (
                  userProfile.full_name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="font-headline-xl text-headline-xl text-slate-800 font-bold">{userProfile.full_name}</h2>
                <div className="font-label-sm uppercase tracking-wider text-[#1E293B] mt-1.5 bg-slate-50 w-fit px-3 py-0.5 rounded-full border border-slate-200 font-semibold">{userProfile.role_default}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg border-t border-slate-100 pt-6">
              <div>
                <p className="font-label-sm text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-body-lg text-slate-700 font-medium">{userProfile.email}</p>
              </div>
              <div>
                <p className="font-label-sm text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="font-body-lg text-slate-700 font-medium">{userProfile.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="font-label-sm text-slate-400 uppercase tracking-wider mb-1">Account Status</p>
                <p className="font-body-lg text-slate-700 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] font-fill-1 text-slate-600">verified</span> Verified Professional
                </p>
              </div>
              <div>
                <p className="font-label-sm text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
                <p className="font-body-lg text-slate-700 font-medium">{new Date(userProfile.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            
            {!token ? (
              <div className="mt-xl pt-lg border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="font-body-sm text-slate-500 font-medium">You are viewing this verified portfolio profile as a Guest.</span>
                <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-body-sm text-body-sm font-bold rounded-xl hover:shadow-md transition-all active:scale-[0.98]">
                  Login to Hire Freelancer
                </Link>
              </div>
            ) : (
              <div className="mt-xl pt-lg border-t border-slate-100">
                <button onClick={handleLogout} className="flex items-center gap-2 font-label-md text-error hover:text-error/80 transition-colors font-semibold">
                  <span className="material-symbols-outlined">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Edit */}
        {activeTab === 'edit' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-md">Update Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-md max-w-md">
              <div>
                <label className="block font-label-md text-on-surface mb-xs">Full Name</label>
                <input
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface mb-xs">Phone Number</label>
                <input
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
              <div className="pt-sm">
                <button type="submit" className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content: Security */}
        {activeTab === 'security' && (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-md">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-md max-w-md">
              <div>
                <label className="block font-label-md text-on-surface mb-xs">Current Password</label>
                <input
                  type="password"
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface mb-xs">New Password</label>
                <input
                  type="password"
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-on-surface-variant mt-1">Must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.</p>
              </div>
              <div>
                <label className="block font-label-md text-on-surface mb-xs">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-md py-[10px] rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-sm">
                <button type="submit" className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
