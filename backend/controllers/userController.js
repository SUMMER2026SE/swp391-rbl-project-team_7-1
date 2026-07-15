import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../config/db.js';
import { getUserById, fetchAllUsers, updateUserStatusById, approveContractById, getDashboardStats, fetchUsersWithFilters } from '../services/userService.js';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    
    // 1. Fetch user from users table
    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT user_id, full_name, email, phone, role_default, avatar_url, bio, company_name, website_url, address, created_at, is_email_verified FROM users WHERE user_id = @userId`);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = userResult.recordset[0];

    // 2. Fetch freelancer profile from freelancer_profiles
    const flResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT headline, experience_years, hourly_rate, availability_status, portfolio_summary, cv_url, cv_ai_evaluation FROM freelancer_profiles WHERE freelancer_id = @userId`);
    
    const fl = flResult.recordset[0] || {};

    // 3. Fetch freelancer skills
    const skillsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT s.skill_name 
        FROM freelancer_skills fs
        JOIN skills s ON fs.skill_id = s.skill_id
        WHERE fs.freelancer_id = @userId
      `);
    const skills = skillsResult.recordset.map(r => r.skill_name);

    // 4. Construct bio_extras compatibility object for frontend
    const bioExtrasObj = {
      title: fl.headline || '',
      hourlyRate: fl.hourly_rate !== undefined ? fl.hourly_rate.toString() : '',
      availability: fl.availability_status || 'AVAILABLE',
      experience: fl.experience_years !== undefined ? 
        (fl.experience_years <= 1 ? 'ENTRY' : fl.experience_years <= 3 ? 'INTERMEDIATE' : 'EXPERT') : 'INTERMEDIATE',
      skills: skills,
      portfolio: fl.portfolio_summary || '',
      linkedin: '', 
      github: '',
      companyName: user.company_name || '',
      industry: '',
      companySize: '',
      website: user.website_url || '',
      companyDesc: user.bio || '',
      location: user.address || ''
    };

    user.bio_extras = JSON.stringify(bioExtrasObj);
    user.cv_url = fl.cv_url || null;
    user.cv_ai_evaluation = fl.cv_ai_evaluation || null;

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, bio, avatarUrl, bioExtras } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: 'Tên không được để trống.' });
    }

    const pool = await poolPromise;

    // 1. Extract and map bioExtras to actual users table fields
    let companyName = null;
    let websiteUrl = null;
    let address = null;
    let finalBio = bio || null;

    if (bioExtras) {
      try {
        const ex = JSON.parse(bioExtras);
        companyName = ex.companyName || null;
        websiteUrl = ex.website || null;
        address = ex.location || null;
        if (ex.companyDesc) {
          finalBio = ex.companyDesc;
        }
      } catch (err) {
        console.error('Error parsing bioExtras:', err);
      }
    }

    // Update users table
    const request = pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phone', sql.VarChar, phone || null)
      .input('bio', sql.NVarChar, finalBio)
      .input('avatarUrl', sql.VarChar(sql.MAX), avatarUrl || null)
      .input('companyName', sql.NVarChar, companyName)
      .input('websiteUrl', sql.NVarChar, websiteUrl)
      .input('address', sql.NVarChar, address)
      .input('userId', sql.Int, userId);

    await request.query(`
      UPDATE users 
      SET full_name = @fullName, 
          phone = @phone, 
          bio = @bio, 
          avatar_url = @avatarUrl,
          company_name = @companyName,
          website_url = @websiteUrl,
          address = @address
      WHERE user_id = @userId
    `);

    // 2. Update freelancer_profiles table
    if (bioExtras) {
      try {
        const ex = JSON.parse(bioExtras);
        const headline = ex.title || null;
        const hourlyRate = ex.hourlyRate ? parseFloat(ex.hourlyRate) : 0;
        const availability = ex.availability || 'AVAILABLE';
        const portfolio = ex.portfolio || null;
        
        let experienceYears = 2; // Default to intermediate
        if (ex.experience === 'ENTRY') experienceYears = 1;
        if (ex.experience === 'EXPERT') experienceYears = 5;

        // Upsert into freelancer_profiles
        await pool.request()
          .input('freelancerId', sql.Int, userId)
          .input('headline', sql.NVarChar, headline)
          .input('experienceYears', sql.Int, experienceYears)
          .input('hourlyRate', sql.Decimal(12, 2), hourlyRate)
          .input('availabilityStatus', sql.VarChar, availability)
          .input('portfolioSummary', sql.NVarChar, portfolio)
          .query(`
            IF EXISTS (SELECT 1 FROM freelancer_profiles WHERE freelancer_id = @freelancerId)
            BEGIN
              UPDATE freelancer_profiles 
              SET headline = @headline,
                  experience_years = @experienceYears,
                  hourly_rate = @hourlyRate,
                  availability_status = @availabilityStatus,
                  portfolio_summary = @portfolioSummary,
                  updated_at = SYSUTCDATETIME()
              WHERE freelancer_id = @freelancerId;
            END
            ELSE
            BEGIN
              INSERT INTO freelancer_profiles (freelancer_id, headline, experience_years, hourly_rate, availability_status, portfolio_summary, rating_average, total_reviews, created_at)
              VALUES (@freelancerId, @headline, @experienceYears, @hourlyRate, @availabilityStatus, @portfolioSummary, 0.00, 0, SYSUTCDATETIME());
            END
          `);

        // 3. Update skills in freelancer_skills
        if (Array.isArray(ex.skills)) {
          // Clear old skills
          await pool.request()
            .input('freelancerId', sql.Int, userId)
            .query(`DELETE FROM freelancer_skills WHERE freelancer_id = @freelancerId`);

          // Insert new skills
          for (const skillName of ex.skills) {
            // First check if skill exists in skills table, if not insert it
            let skillIdResult = await pool.request()
              .input('skillName', sql.NVarChar, skillName)
              .query(`SELECT skill_id FROM skills WHERE skill_name = @skillName`);
            
            let skillId;
            if (skillIdResult.recordset.length === 0) {
              const insertResult = await pool.request()
                .input('skillName', sql.NVarChar, skillName)
                .query(`INSERT INTO skills (skill_name, created_at) VALUES (@skillName, SYSUTCDATETIME()); SELECT SCOPE_IDENTITY() AS skill_id;`);
              skillId = insertResult.recordset[0].skill_id;
            } else {
              skillId = skillIdResult.recordset[0].skill_id;
            }

            // Insert connection into freelancer_skills
            await pool.request()
              .input('freelancerId', sql.Int, userId)
              .input('skillId', sql.Int, skillId)
              .query(`
                IF NOT EXISTS (SELECT 1 FROM freelancer_skills WHERE freelancer_id = @freelancerId AND skill_id = @skillId)
                BEGIN
                  INSERT INTO freelancer_skills (freelancer_id, skill_id, skill_level, created_at)
                  VALUES (@freelancerId, @skillId, 'INTERMEDIATE', SYSUTCDATETIME());
                END
              `);
          }
        }
      } catch (err) {
        console.error('Error updating profile extras:', err);
      }
    }

    // 4. Fetch updated user to return to frontend
    const updatedUserResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT user_id, full_name, email, phone, role_default, avatar_url, bio, company_name, website_url, address, created_at, is_email_verified FROM users WHERE user_id = @userId`);
    
    const updatedUser = updatedUserResult.recordset[0];
    
    const updatedFlResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT headline, experience_years, hourly_rate, availability_status, portfolio_summary FROM freelancer_profiles WHERE freelancer_id = @userId`);
    const updatedFl = updatedFlResult.recordset[0] || {};

    const updatedSkillsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT s.skill_name 
        FROM freelancer_skills fs
        JOIN skills s ON fs.skill_id = s.skill_id
        WHERE fs.freelancer_id = @userId
      `);
    const updatedSkills = updatedSkillsResult.recordset.map(r => r.skill_name);

    const updatedBioExtrasObj = {
      title: updatedFl.headline || '',
      hourlyRate: updatedFl.hourly_rate !== undefined ? updatedFl.hourly_rate.toString() : '',
      availability: updatedFl.availability_status || 'AVAILABLE',
      experience: updatedFl.experience_years !== undefined ? 
        (updatedFl.experience_years <= 1 ? 'ENTRY' : updatedFl.experience_years <= 3 ? 'INTERMEDIATE' : 'EXPERT') : 'INTERMEDIATE',
      skills: updatedSkills,
      portfolio: updatedFl.portfolio_summary || '',
      linkedin: '', 
      github: '',
      companyName: updatedUser.company_name || '',
      industry: '',
      companySize: '',
      website: updatedUser.website_url || '',
      companyDesc: updatedUser.bio || '',
      location: updatedUser.address || ''
    };

    updatedUser.bio_extras = JSON.stringify(updatedBioExtrasObj);

    res.json({ message: 'Cập nhật thông tin thành công!', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile.' });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.' 
      });
    }

    const pool = await poolPromise;
    
    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT password_hash FROM users WHERE user_id = @userId');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = userResult.recordset[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    await pool.request()
      .input('passwordHash', sql.VarChar, newPasswordHash)
      .input('userId', sql.Int, userId)
      .query(`UPDATE users SET password_hash = @passwordHash WHERE user_id = @userId`);

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu để xác nhận xóa tài khoản.' });
    }

    const pool = await poolPromise;

    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT password_hash, role_default FROM users WHERE user_id = @userId');

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = userResult.recordset[0];

    if (user.role_default === 'ADMIN') {
      return res.status(403).json({ message: 'Tài khoản Admin không thể bị xóa.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
    }

    // Soft-delete: set status to DELETED
    await pool.request()
      .input('userId', sql.Int, userId)
      .query(`UPDATE users SET status = 'DELETED', refresh_token = NULL WHERE user_id = @userId`);

    res.json({ message: 'Tài khoản đã được xóa thành công.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tài khoản.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy dữ liệu dashboard.'
    });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 25 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.max(parseInt(limit, 10) || 25, 1);
    const offset = (pageNum - 1) * lim;

    const result = await fetchUsersWithFilters({ search, role, status, limit: lim, offset });
    const totalPages = Math.max(Math.ceil(result.total / lim), 1);

    res.json({
      success: true,
      data: {
        users: result.users,
        total: result.total,
        page: pageNum,
        limit: lim,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
  }
};

const emitForceLogoutEvent = (req, userId) => {
  const io = req.app.get('socketio');
  const activeUsers = req.app.get('activeUsers');
  if (!io || !activeUsers) return;

  const userSession = activeUsers.get(Number(userId));
  if (userSession && userSession.socketId) {
    io.to(userSession.socketId).emit('force_logout', {
      message: 'Tài khoản của bạn đã bị khóa bởi quản trị viên.'
    });

    const socket = io.sockets.sockets.get(userSession.socketId);
    if (socket) {
      socket.disconnect(true);
    }

    activeUsers.set(Number(userId), { socketId: null, lastSeen: new Date() });
  }
};

export const updateAdminUserStatus = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { status } = req.body;

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Id người dùng không hợp lệ.' });
    }

    const allowedStatuses = ['ACTIVE', 'SUSPENDED', 'BANNED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    if (req.user.id === userId) {
      return res.status(403).json({ message: 'Không thể thay đổi trạng thái của chính bạn.' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    if (user.role_default === 'ADMIN') {
      return res.status(403).json({ message: 'Không thể thay đổi trạng thái của tài khoản Admin.' });
    }

    await updateUserStatusById(userId, status);
    if (status === 'BANNED') {
      emitForceLogoutEvent(req, userId);
    }

    res.json({ message: 'Cập nhật trạng thái người dùng thành công.' });
  } catch (error) {
    console.error('Error updating admin user status:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái người dùng.' });
  }
};

export const banUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Id người dùng không hợp lệ.' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    if (user.role_default === 'ADMIN') {
      return res.status(403).json({ message: 'Không thể cấm tài khoản Admin.' });
    }

    if (user.status === 'BANNED') {
      return res.status(400).json({ message: 'Người dùng đã bị cấm trước đó.' });
    }

    await updateUserStatusById(userId, 'BANNED');
    emitForceLogoutEvent(req, userId);
    res.json({ message: 'Người dùng đã được cấm thành công.' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Lỗi server khi cấm người dùng.' });
  }
};

export const approveContract = async (req, res) => {
  try {
    const contractId = parseInt(req.params.id, 10);
    if (Number.isNaN(contractId)) {
      return res.status(400).json({ message: 'Contract id không hợp lệ.' });
    }

    const userRole = req.user.role || req.user.roleDefault;
    if (userRole !== 'EMPLOYER' && userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Chỉ Employer hoặc Admin mới có quyền phê duyệt hợp đồng.' });
    }

    const contract = await approveContractById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng hợp lệ để phê duyệt.' });
    }

    return res.json({ success: true, message: 'Hợp đồng đã được phê duyệt.', contract });
  } catch (error) {
    console.error('Error approving contract:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi phê duyệt hợp đồng.' });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Id người dùng không hợp lệ.' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    if (user.status !== 'BANNED') {
      return res.status(400).json({ message: 'Người dùng không ở trạng thái bị cấm.' });
    }

    await updateUserStatusById(userId, 'ACTIVE');
    res.json({ message: 'Người dùng đã được mở cấm thành công.' });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ message: 'Lỗi server khi mở cấm người dùng.' });
  }
};

// --- PORTFOLIO CRUD CONTROLLERS ---

export const getMyPortfolios = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('freelancerId', sql.Int, freelancerId)
      .query('SELECT portfolio_id, title, description, project_url, image_url, created_at, updated_at FROM portfolios WHERE freelancer_id = @freelancerId ORDER BY created_at DESC');
    res.json({ success: true, portfolios: result.recordset });
  } catch (error) {
    console.error('Error in getMyPortfolios:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách portfolio.' });
  }
};

export const getFreelancerPortfolios = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    if (isNaN(parseInt(freelancerId, 10))) {
      return next();
    }
    const pool = await poolPromise;
    const result = await pool.request()
      .input('freelancerId', sql.Int, freelancerId)
      .query('SELECT portfolio_id, title, description, project_url, image_url, created_at, updated_at FROM portfolios WHERE freelancer_id = @freelancerId ORDER BY created_at DESC');
    res.json({ success: true, portfolios: result.recordset });
  } catch (error) {
    console.error('Error in getFreelancerPortfolios:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách portfolio công khai.' });
  }
};

export const addPortfolio = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { title, description, projectUrl, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Tiêu đề dự án không được để trống.' });
    }

    const pool = await poolPromise;
    await pool.request()
      .input('freelancerId', sql.Int, freelancerId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('projectUrl', sql.NVarChar, projectUrl || null)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        INSERT INTO portfolios (freelancer_id, title, description, project_url, image_url, created_at)
        VALUES (@freelancerId, @title, @description, @projectUrl, @imageUrl, SYSUTCDATETIME())
      `);

    res.status(201).json({ success: true, message: 'Thêm dự án portfolio thành công!' });
  } catch (error) {
    console.error('Error in addPortfolio:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm portfolio.' });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { portfolioId } = req.params;
    const { title, description, projectUrl, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Tiêu đề dự án không được để trống.' });
    }

    const pool = await poolPromise;

    // Verify ownership
    const checkResult = await pool.request()
      .input('portfolioId', sql.Int, portfolioId)
      .query('SELECT freelancer_id FROM portfolios WHERE portfolio_id = @portfolioId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án portfolio.' });
    }

    if (checkResult.recordset[0].freelancer_id !== freelancerId) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa dự án này.' });
    }

    await pool.request()
      .input('portfolioId', sql.Int, portfolioId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('projectUrl', sql.NVarChar, projectUrl || null)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        UPDATE portfolios 
        SET title = @title, 
            description = @description, 
            project_url = @projectUrl, 
            image_url = @imageUrl, 
            updated_at = SYSUTCDATETIME()
        WHERE portfolio_id = @portfolioId
      `);

    res.json({ success: true, message: 'Cập nhật portfolio thành công!' });
  } catch (error) {
    console.error('Error in updatePortfolio:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật portfolio.' });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { portfolioId } = req.params;
    const pool = await poolPromise;

    // Verify ownership
    const checkResult = await pool.request()
      .input('portfolioId', sql.Int, portfolioId)
      .query('SELECT freelancer_id FROM portfolios WHERE portfolio_id = @portfolioId');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án portfolio.' });
    }

    if (checkResult.recordset[0].freelancer_id !== freelancerId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa dự án này.' });
    }

    await pool.request()
      .input('portfolioId', sql.Int, portfolioId)
      .query('DELETE FROM portfolios WHERE portfolio_id = @portfolioId');

    res.json({ success: true, message: 'Xóa dự án portfolio thành công!' });
  } catch (error) {
    console.error('Error in deletePortfolio:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa portfolio.' });
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return next();
    }

    const pool = await poolPromise;
    
    // 1. Fetch user from users table
    const userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT user_id, full_name, email, phone, role_default, avatar_url, bio, company_name, website_url, address, created_at, is_email_verified FROM users WHERE user_id = @userId AND status = 'ACTIVE'`);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng hoặc tài khoản không hoạt động.' });
    }

    const user = userResult.recordset[0];

    // 2. Fetch freelancer profile from freelancer_profiles
    const flResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT headline, experience_years, hourly_rate, availability_status, portfolio_summary, rating_average, total_reviews, cv_url, cv_ai_evaluation FROM freelancer_profiles WHERE freelancer_id = @userId`);
    
    const fl = flResult.recordset[0] || {};

    // 3. Fetch freelancer skills
    const skillsResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT s.skill_name 
        FROM freelancer_skills fs
        JOIN skills s ON fs.skill_id = s.skill_id
        WHERE fs.freelancer_id = @userId
      `);
    const skills = skillsResult.recordset.map(r => r.skill_name);

    // 4. Construct bio_extras compatibility object for frontend
    const bioExtrasObj = {
      title: fl.headline || '',
      hourlyRate: fl.hourly_rate !== undefined ? fl.hourly_rate.toString() : '',
      availability: fl.availability_status || 'AVAILABLE',
      experience: fl.experience_years !== undefined ? 
        (fl.experience_years <= 1 ? 'ENTRY' : fl.experience_years <= 3 ? 'INTERMEDIATE' : 'EXPERT') : 'INTERMEDIATE',
      skills: skills,
      portfolio: fl.portfolio_summary || '',
      linkedin: '', 
      github: '',
      companyName: user.company_name || '',
      industry: '',
      companySize: '',
      website: user.website_url || '',
      companyDesc: user.bio || '',
      location: user.address || '',
      ratingAverage: fl.rating_average || 0.0,
      totalReviews: fl.total_reviews || 0
    };

    user.bio_extras = JSON.stringify(bioExtrasObj);
    user.rating_average = fl.rating_average || 0.0;
    user.total_reviews = fl.total_reviews || 0;
    user.cv_url = fl.cv_url || null;
    user.cv_ai_evaluation = fl.cv_ai_evaluation || null;

    res.json({ user });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile công khai.' });
  }
};

export const getAllFreelancers = async (req, res) => {
  try {
    const pool = await poolPromise;
    
    // Fetch all active freelancers
    const freelancersResult = await pool.request()
      .query(`
        SELECT u.user_id, u.full_name, u.email, u.phone, u.avatar_url, u.bio, u.address, u.created_at,
               fp.headline, fp.experience_years, fp.hourly_rate, fp.availability_status, fp.portfolio_summary,
               fp.rating_average, fp.total_reviews
        FROM users u
        LEFT JOIN freelancer_profiles fp ON u.user_id = fp.freelancer_id
        WHERE u.role_default = 'FREELANCER' AND u.status = 'ACTIVE'
      `);

    const freelancers = freelancersResult.recordset;

    // Fetch all freelancer skills
    const skillsResult = await pool.request()
      .query(`
        SELECT fs.freelancer_id, s.skill_name
        FROM freelancer_skills fs
        JOIN skills s ON fs.skill_id = s.skill_id
      `);

    const skillsMap = {};
    skillsResult.recordset.forEach(row => {
      if (!skillsMap[row.freelancer_id]) {
        skillsMap[row.freelancer_id] = [];
      }
      skillsMap[row.freelancer_id].push(row.skill_name);
    });

    // Attach skills to each freelancer
    const data = freelancers.map(fl => ({
      userId: fl.user_id,
      fullName: fl.full_name,
      email: fl.email,
      phone: fl.phone,
      avatarUrl: fl.avatar_url,
      bio: fl.bio,
      address: fl.address,
      createdAt: fl.created_at,
      headline: fl.headline || '',
      experienceYears: fl.experience_years || 0,
      hourlyRate: fl.hourly_rate || 0,
      availabilityStatus: fl.availability_status || 'AVAILABLE',
      portfolioSummary: fl.portfolio_summary || '',
      ratingAverage: fl.rating_average || 0.0,
      totalReviews: fl.total_reviews || 0,
      skills: skillsMap[fl.user_id] || []
    }));

    res.json({ freelancers: data });
  } catch (error) {
    console.error('Error fetching all freelancers:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách freelancer.' });
  }
};

export const getFreelancerReviews = async (req, res, next) => {
  try {
    const { freelancerId } = req.params;
    if (isNaN(parseInt(freelancerId, 10))) {
      return next();
    }
    const pool = await poolPromise;

    const result = await pool.request()
      .input('freelancerId', sql.Int, freelancerId)
      .query(`
        SELECT r.*, u.full_name as reviewer_name, u.avatar_url as reviewer_avatar
        FROM reviews r
        JOIN users u ON r.from_user_id = u.user_id
        WHERE r.to_user_id = @freelancerId
        ORDER BY r.created_at DESC
      `);

    res.json({ success: true, reviews: result.recordset });
  } catch (error) {
    console.error('Error in getFreelancerReviews:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách đánh giá.' });
  }
};

export const uploadCV = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file CV (PDF).' });
    }

    const cvUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const filePath = req.file.path;

    // Response quickly
    res.json({
      success: true,
      message: 'CV đã tải lên thành công. Hệ thống đang phân tích CV bằng AI...',
      cvUrl
    });

    // Run AI analysis in the background
    setTimeout(async () => {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const parsedPdf = await pdfParse(dataBuffer);
        const cvText = parsedPdf.text || '';

        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          console.error('Gemini API Key is not set.');
          return;
        }

        // Call Gemini to analyze CV generally
        const systemInstruction = "Bạn là trợ lý AI phân tích CV của hệ thống FJMS. Hãy phân tích nội dung CV của freelancer và trả về kết quả dưới dạng JSON có các key sau: matchScore (điểm từ 0-100 đánh giá chất lượng hồ sơ chung), quickSummary (tóm tắt tối đa 2 câu về freelancer), strengths (mảng chứa tối đa 3 điểm mạnh nhất của họ), gaps (mảng chứa tối đa 3 mặt hạn chế hoặc điểm cần cải thiện của họ). Chỉ trả về đúng chuỗi JSON hợp lệ, không chứa khối code hay ký tự định dạng khác.";
        const userPrompt = `Dưới đây là nội dung CV của freelancer:\n\n${cvText.substring(0, 8000)}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.5, responseMimeType: "application/json" }
          })
        });

        let aiResultStr = '';
        if (response.ok) {
          const resData = await response.json();
          aiResultStr = resData.candidates[0]?.content?.parts[0]?.text?.trim() || '';
        }

        const pool = await poolPromise;
        await pool.request()
          .input('freelancerId', sql.Int, userId)
          .input('cvUrl', sql.VarChar, cvUrl)
          .input('cvAiEvaluation', sql.NVarChar, aiResultStr)
          .query(`
            IF EXISTS (SELECT 1 FROM freelancer_profiles WHERE freelancer_id = @freelancerId)
            BEGIN
              UPDATE freelancer_profiles 
              SET cv_url = @cvUrl, cv_ai_evaluation = @cvAiEvaluation, updated_at = GETDATE()
              WHERE freelancer_id = @freelancerId;
            END
            ELSE
            BEGIN
              INSERT INTO freelancer_profiles (freelancer_id, availability_status, rating_average, total_reviews, cv_url, cv_ai_evaluation, created_at)
              VALUES (@freelancerId, 'AVAILABLE', 0.00, 0, @cvUrl, @cvAiEvaluation, GETDATE());
            END
          `);
        console.log(`[AI CV] Done analyzing general profile CV for freelancer_id = ${userId}`);
      } catch (err) {
        console.error('Error analyzing CV in background:', err);
      }
    }, 0);

  } catch (error) {
    console.error('Error in uploadCV:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải lên CV.' });
  }
};

