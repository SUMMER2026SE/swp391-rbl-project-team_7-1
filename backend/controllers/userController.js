import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    
    // Try to fetch bio_extras (might not exist in older schema)
    let query = `SELECT user_id, full_name, email, phone, role_default, avatar_url, bio, created_at, is_email_verified`;
    try {
      // Test if bio_extras column exists
      await pool.request().input('userId', sql.Int, userId).query(`SELECT TOP 0 bio_extras FROM Users WHERE user_id = @userId`);
      query += `, bio_extras`;
    } catch { /* column doesn't exist, skip */ }
    query += ` FROM Users WHERE user_id = @userId`;

    const result = await pool.request().input('userId', sql.Int, userId).query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.json({ user: result.recordset[0] });
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

    let updateQuery = `UPDATE Users SET full_name = @fullName, phone = @phone`;
    const request = pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phone', sql.VarChar, phone || null)
      .input('userId', sql.Int, userId);

    if (bio !== undefined) {
      updateQuery += `, bio = @bio`;
      request.input('bio', sql.NVarChar, bio || null);
    }
    if (avatarUrl !== undefined) {
      updateQuery += `, avatar_url = @avatarUrl`;
      request.input('avatarUrl', sql.NVarChar(sql.MAX), avatarUrl || null);
    }
    // Try to update bio_extras if column exists
    if (bioExtras !== undefined) {
      try {
        await pool.request().input('userId', sql.Int, userId).query(`SELECT TOP 0 bio_extras FROM Users WHERE user_id = @userId`);
        updateQuery += `, bio_extras = @bioExtras`;
        request.input('bioExtras', sql.NVarChar(sql.MAX), bioExtras || null);
      } catch { /* column doesn't exist, skip gracefully */ }
    }

    updateQuery += ` WHERE user_id = @userId`;
    await request.query(updateQuery);

    // Fetch updated user
    let fetchQuery = `SELECT user_id, full_name, email, phone, role_default, avatar_url, bio, created_at, is_email_verified`;
    try {
      await pool.request().input('userId', sql.Int, userId).query(`SELECT TOP 0 bio_extras FROM Users WHERE user_id = @userId`);
      fetchQuery += `, bio_extras`;
    } catch { /* skip */ }
    fetchQuery += ` FROM Users WHERE user_id = @userId`;

    const updated = await pool.request().input('userId', sql.Int, userId).query(fetchQuery);

    res.json({ message: 'Cập nhật thông tin thành công!', user: updated.recordset[0] });
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
      .query('SELECT password_hash FROM Users WHERE user_id = @userId');

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
      .query(`UPDATE Users SET password_hash = @passwordHash WHERE user_id = @userId`);

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
      .query('SELECT password_hash, role_default FROM Users WHERE user_id = @userId');

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
      .query(`UPDATE Users SET status = 'DELETED', refresh_token = NULL WHERE user_id = @userId`);

    res.json({ message: 'Tài khoản đã được xóa thành công.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa tài khoản.' });
  }
};
