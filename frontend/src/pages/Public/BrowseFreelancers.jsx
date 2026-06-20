import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const ALL_SKILLS = [
  'React', 'Node.js', 'UI/UX Design', 'Figma', 'HTML/CSS', 'TypeScript', 
  'JavaScript', 'Python', 'Java', 'SQL Server', 'Web Design', 'Content Writing'
];

export default function BrowseFreelancers() {
  const rawToken = localStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchWordFromUrl = queryParams.get('q') || '';

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchWord, setSearchWord] = useState(searchWordFromUrl);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('Newest First');

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/user/freelancers`);
        const data = await res.json();
        if (res.ok) {
          setFreelancers(data.freelancers || []);
        } else {
          setError(data.message || 'Lỗi tải danh sách freelancer.');
        }
      } catch (err) {
        setError('Lỗi kết nối máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, []);

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleClearFilters = () => {
    setSearchWord('');
    setMinRate('');
    setMaxRate('');
    setSelectedSkills([]);
    setSortBy('Newest First');
    navigate('/freelancers');
  };

  // Filter Logic
  const filteredFreelancers = freelancers.filter(fl => {
    // 1. Search Query
    if (searchWord) {
      const q = searchWord.toLowerCase();
      const matchSearch = 
        fl.fullName.toLowerCase().includes(q) ||
        fl.headline.toLowerCase().includes(q) ||
        fl.skills.some(s => s.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // 2. Hourly Rate Range
    if (minRate && fl.hourlyRate < parseFloat(minRate)) {
      return false;
    }
    if (maxRate && fl.hourlyRate > parseFloat(maxRate)) {
      return false;
    }

    // 3. Skills Filter (Match all selected skills)
    if (selectedSkills.length > 0 && !selectedSkills.every(s => fl.skills.includes(s))) {
      return false;
    }

    return true;
  });

  // Sort Logic
  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
    if (sortBy === 'Highest Rate') {
      return b.hourlyRate - a.hourlyRate;
    }
    if (sortBy === 'Lowest Rate') {
      return a.hourlyRate - b.hourlyRate;
    }
    // Default: Newest first (descending ID)
    return b.userId - a.userId;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col w-full">
      {/* Hero Banner */}
      <section className={`bg-gradient-to-br from-teal-50 via-white to-teal-50/50 border-b border-teal-100/50 py-16 px-6 md:px-12 w-full ${!token ? 'pt-[116px] md:pt-[124px]' : 'pt-12'}`}>
        <div className="max-w-[1440px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl text-teal-950 font-extrabold tracking-tight mb-4 animate-fade-in">
            Khám phá Freelancer hàng đầu
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl font-medium mx-auto md:mx-0">
            Tìm kiếm và kết nối với các chuyên gia tự do tài năng, uy tín cho dự án của bạn. Lọc theo chuyên môn, ngân sách và kỹ năng.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-[104px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl text-teal-950 font-bold">Bộ lọc</h2>
              <button 
                onClick={handleClearFilters}
                className="text-teal-700 text-sm font-semibold hover:underline"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Text Search */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Tìm kiếm</h3>
              <input 
                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                placeholder="Tên, từ khóa, kỹ năng..." 
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>

            {/* Hourly Rate Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-teal-950 mb-3">Giá giờ (đ/giờ)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="Tối thiểu" 
                    type="number"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                  />
                  <span className="text-slate-400">-</span>
                  <input 
                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-800 font-medium transition-all" 
                    placeholder="Tối đa" 
                    type="number"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Skill Tags */}
            <div>
              <h3 className="text-base font-semibold text-teal-950 mb-3">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <span 
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 select-none font-medium ${
                        active 
                          ? 'bg-teal-600 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Canvas */}
        <section className="flex-grow flex flex-col gap-6">
          
          {/* Header/Sort bar */}
          <div className="flex justify-between items-center bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <span className="text-sm text-slate-600 font-medium">
              Hiển thị <strong className="text-teal-900 font-bold">{sortedFreelancers.length}</strong> freelancer {searchWord ? `cho "${searchWord}"` : ''}
            </span>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <span className="text-sm text-slate-500 font-medium">Sắp xếp:</span>
              <select 
                className="text-sm border-none bg-transparent text-teal-900 font-bold focus:ring-0 cursor-pointer pl-1 pr-8 py-0 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest First">Mới nhất</option>
                <option value="Highest Rate">Giá cao nhất</option>
                <option value="Lowest Rate">Giá thấp nhất</option>
              </select>
            </div>
          </div>

          {/* Loading / Error States */}
          {loading && (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">Đang tải danh sách freelancer…</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl text-red-500 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-red-200 mb-4 block">error</span>
              <h4 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h4>
              <p className="text-sm max-w-sm mx-auto mb-6">{error}</p>
            </div>
          )}

          {/* Bento Grid Freelancers List */}
          {!loading && !error && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {sortedFreelancers.map(fl => {
                const experienceLabel = fl.experienceYears <= 1 ? 'Mới vào nghề' : fl.experienceYears <= 3 ? 'Trung cấp' : 'Chuyên gia';
                const avatarInitials = fl.fullName.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
                
                return (
                  <article 
                    key={fl.userId}
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-[0_8px_24px_rgba(15,118,110,0.06)] hover:-translate-y-1 transition-all duration-300 relative flex flex-col group overflow-hidden"
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {fl.avatarUrl ? (
                          <img src={fl.avatarUrl} alt={fl.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-white">{avatarInitials}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl text-teal-950 font-bold truncate group-hover:text-teal-700 transition-colors cursor-pointer" onClick={() => navigate(`/profile/${fl.userId}`)}>
                          {fl.fullName}
                        </h3>
                        <p className="text-sm font-semibold text-teal-700 truncate mt-0.5">
                          {fl.headline || 'Freelancer Tự Do'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">star</span> {fl.ratingAverage.toFixed(1)} ({fl.totalReviews} đánh giá)</span>
                          <span className="text-slate-300">•</span>
                          <span>{experienceLabel}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {fl.bio || 'Chưa có thông tin giới thiệu chi tiết.'}
                    </p>

                    {/* Stats & Rate */}
                    <div className="flex gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100/80">
                      <div className="flex-1">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Giá theo giờ</span>
                        <span className="text-base font-bold text-teal-700">
                          {fl.hourlyRate ? `${fl.hourlyRate.toLocaleString('vi-VN')} đ/giờ` : 'Thương lượng'}
                        </span>
                      </div>
                      <div className="w-px bg-slate-200"></div>
                      <div className="flex-1">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Địa điểm</span>
                        <span className="text-sm font-bold text-slate-800 truncate block max-w-[120px]">{fl.address || 'Việt Nam'}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {fl.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {fl.skills.slice(0, 5).map(skill => (
                          <span key={skill} className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-medium shadow-xs">
                            {skill}
                          </span>
                        ))}
                        {fl.skills.length > 5 && (
                          <span className="bg-slate-50 text-slate-500 text-xs px-2.5 py-1 rounded-lg border border-slate-200/60 font-semibold">
                            +{fl.skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Details Action */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => navigate(`/profile/${fl.userId}`)}
                        className="w-full bg-teal-50 border border-teal-100 hover:bg-teal-100 hover:border-teal-200 text-teal-900 text-sm font-bold py-2.5 rounded-xl transition-all duration-200 text-center"
                      >
                        Xem hồ sơ chi tiết
                      </button>
                    </div>
                  </article>
                );
              })}

              {sortedFreelancers.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-2xl text-slate-500 shadow-sm">
                  <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">search_off</span>
                  <h4 className="text-xl text-slate-800 font-bold mb-2">Không tìm thấy freelancer nào</h4>
                  <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm của bạn.</p>
                  <button 
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
