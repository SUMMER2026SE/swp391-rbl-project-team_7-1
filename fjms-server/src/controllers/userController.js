import bcrypt from 'bcryptjs';
import { sql, poolPromise } from '../config/db.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT user_id, full_name, email, phone, role_default, avatar_url, created_at 
        FROM Users 
        WHERE user_id = @userId
      `);

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
    const { fullName, phone } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: 'Tên không được để trống.' });
    }

    const pool = await poolPromise;
    
    await pool.request()
      .input('fullName', sql.NVarChar, fullName)
      .input('phone', sql.VarChar, phone || null)
      .input('userId', sql.Int, userId)
      .query(`
        UPDATE Users 
        SET full_name = @fullName, phone = @phone 
        WHERE user_id = @userId
      `);

    res.json({ message: 'Cập nhật thông tin thành công!' });
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
      .query(`
        UPDATE Users 
        SET password_hash = @passwordHash 
        WHERE user_id = @userId
      `);

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu.' });
  }
};
