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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

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
        // If token is invalid or expired
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
    return <div className="min-h-screen flex items-center justify-center bg-surface">Loading...</div>;
  }

  const goBackDashboard = () => {
    const userRole = userProfile?.role_default || 'FREELANCER';
    if (userRole === 'EMPLOYER') navigate('/employer/dashboard');
    else navigate('/freelancer/dashboard');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body-md">
      
      {/* Header */}
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

      <main className="max-w-3xl mx-auto py-xl px-gutter">
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Account Settings</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Manage your profile details and security preferences.</p>
        </div>

        {/* Tabs */}
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
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center gap-lg mb-xl">
              <div className="w-24 h-24 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant text-headline-lg text-primary">
                {userProfile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-headline-md text-on-surface">{userProfile.full_name}</h2>
                <div className="font-label-sm uppercase tracking-wider text-primary mt-1 bg-primary/10 w-fit px-2 py-0.5 rounded-full">{userProfile.role_default}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              <div>
                <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Email Address</p>
                <p className="font-body-lg text-on-surface">{userProfile.email}</p>
              </div>
              <div>
                <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Phone Number</p>
                <p className="font-body-lg text-on-surface">{userProfile.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Account Status</p>
                <p className="font-body-lg text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">verified</span> Verified
                </p>
              </div>
              <div>
                <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Joined Date</p>
                <p className="font-body-lg text-on-surface">{new Date(userProfile.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            
            <div className="mt-xl pt-lg border-t border-outline-variant">
              <button onClick={handleLogout} className="flex items-center gap-2 font-label-md text-error hover:text-error/80 transition-colors">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            </div>
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
