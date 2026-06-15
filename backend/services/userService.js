import { sql, poolPromise } from '../config/db.js';

export const getUserById = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query('SELECT user_id, full_name, email, phone, role_default, status FROM users WHERE user_id = @userId');

  return result.recordset[0] || null;
};

export const fetchAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT user_id, full_name, email, phone, role_default, status, is_email_verified, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return result.recordset;
};

export const updateUserStatusById = async (userId, status) => {
  const pool = await poolPromise;
  await pool.request()
    .input('userId', sql.Int, userId)
    .input('status', sql.VarChar, status)
    .query(`
      UPDATE users
      SET status = @status,
          refresh_token = CASE WHEN @status = 'BANNED' THEN NULL ELSE refresh_token END
      WHERE user_id = @userId
    `);
};
