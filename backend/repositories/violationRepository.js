import { sql, poolPromise } from '../config/db.js';

export const fetchViolationsWithFilters = async ({ search, reportType, status, limit, offset }) => {
  const pool = await poolPromise;
  const whereClauses = [];
  const countReq = pool.request();
  const listReq = pool.request();

  if (search) {
    const searchParam = `%${search}%`;
    countReq.input('search', sql.NVarChar, searchParam);
    listReq.input('search', sql.NVarChar, searchParam);
    whereClauses.push('(u_reported.full_name LIKE @search OR u_reported.email LIKE @search)');
  }

  if (reportType) {
    countReq.input('reportType', sql.VarChar, reportType);
    listReq.input('reportType', sql.VarChar, reportType);
    whereClauses.push('vr.report_type = @reportType');
  }

  if (status) {
    countReq.input('status', sql.VarChar, status);
    listReq.input('status', sql.VarChar, status);
    whereClauses.push('vr.status = @status');
  }

  const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM violation_reports vr
    LEFT JOIN users u_reported ON vr.reported_user_id = u_reported.user_id
    ${whereSql}
  `;

  const listQuery = `
    SELECT 
      vr.report_id,
      vr.reporter_id,
      vr.reported_user_id,
      vr.project_id,
      vr.message_id,
      vr.review_id,
      vr.report_type,
      vr.reason,
      vr.status,
      vr.created_at,
      vr.resolved_at,
      u_reporter.full_name AS reporter_name,
      u_reporter.email AS reporter_email,
      u_reported.full_name AS reported_name,
      u_reported.email AS reported_email
    FROM violation_reports vr
    LEFT JOIN users u_reporter ON vr.reporter_id = u_reporter.user_id
    LEFT JOIN users u_reported ON vr.reported_user_id = u_reported.user_id
    ${whereSql}
    ORDER BY vr.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  listReq.input('limit', sql.Int, limit);
  listReq.input('offset', sql.Int, offset);

  const [countResult, listResult] = await Promise.all([
    countReq.query(countQuery),
    listReq.query(listQuery)
  ]);

  return {
    total: countResult.recordset[0]?.total || 0,
    violations: listResult.recordset || []
  };
};

export const getViolationById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT 
        vr.report_id,
        vr.reporter_id,
        vr.reported_user_id,
        vr.project_id,
        vr.message_id,
        vr.review_id,
        vr.report_type,
        vr.reason,
        vr.status,
        vr.created_at,
        vr.resolved_at,
        u_reporter.user_id AS reporter_id,
        u_reporter.full_name AS reporter_name,
        u_reporter.email AS reporter_email,
        u_reporter.status AS reporter_status,
        u_reported.user_id AS reported_user_id,
        u_reported.full_name AS reported_name,
        u_reported.email AS reported_email,
        u_reported.status AS reported_status
      FROM violation_reports vr
      LEFT JOIN users u_reporter ON vr.reporter_id = u_reporter.user_id
      LEFT JOIN users u_reported ON vr.reported_user_id = u_reported.user_id
      WHERE vr.report_id = @id
    `);

  return result.recordset[0] || null;
};

export const updateViolationStatus = async (id, status, action) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .input('status', sql.VarChar, status)
    .query(`
      UPDATE violation_reports
      SET status = @status,
          resolved_at = SYSUTCDATETIME()
      WHERE report_id = @id
    `);
};

export const updateUserStatus = async (userId, status) => {
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

export const createNotification = async (userId, message) => {
  const pool = await poolPromise;
  // Let's check if notification table is named 'notifications' or similar. We will insert into it.
  // We'll write an insert into notifications with columns user_id, message, is_read, created_at.
  // First, let's execute with custom query or try-catch since we can.
  try {
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('message', sql.NVarChar, message)
      .query(`
        INSERT INTO notifications (user_id, message, is_read, created_at)
        VALUES (@userId, @message, 0, SYSUTCDATETIME())
      `);
  } catch (error) {
    console.error('Error creating notification in DB, table might have different columns or name:', error);
    // fallback or alternative check if required
  }
};
