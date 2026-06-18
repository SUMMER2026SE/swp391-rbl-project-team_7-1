import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../config/db.js';
import { getUserById, fetchAllUsers, updateUserStatusById, approveContractById, getDashboardStats, fetchUsersWithFilters } from '../services/userService.js';

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
      .query(`SELECT headline, experience_years, hourly_rate, availability_status, portfolio_summary FROM freelancer_profiles WHERE freelancer_id = @userId`);
    
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
      .input('avatarUrl', sql.VarChar, avatarUrl || null)
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
