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

export const approveContractById = async (contractId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('contractId', sql.Int, contractId)
    .query(`
      UPDATE contracts
      SET status = 'APPROVED'
      WHERE contract_id = @contractId AND status = 'PENDING_APPROVAL';
      SELECT contract_id, status FROM contracts WHERE contract_id = @contractId;
    `);

  if (!result.rowsAffected || result.rowsAffected[0] === 0) {
    return null;
  }

  return result.recordset[0] || null;
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

export const fetchUsersWithFilters = async ({ search, role, status, limit = 25, offset = 0 }) => {
  const pool = await poolPromise;

  // Build WHERE clauses safely using parameters
  const whereClauses = [];
  const request = pool.request();

  if (search) {
    request.input('search', sql.VarChar, `%${search}%`);
    whereClauses.push("(full_name LIKE @search OR email LIKE @search OR phone LIKE @search)");
  }

  if (role) {
    request.input('role', sql.VarChar, role);
    whereClauses.push('role_default = @role');
  }

  if (status) {
    request.input('status', sql.VarChar, status);
    whereClauses.push('status = @status');
  }

  const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  // Total count query
  const countQuery = `SELECT COUNT(*) AS total FROM users ${whereSql}`;

  // Paged query (SQL Server OFFSET/FETCH)
  const listQuery = `
    SELECT user_id, full_name, email, phone, role_default, status, is_email_verified, created_at
    FROM users
    ${whereSql}
    ORDER BY created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  // Build requests with same inputs
  const countReq = pool.request();
  const listReq = pool.request();

  if (search) {
    countReq.input('search', sql.VarChar, `%${search}%`);
    listReq.input('search', sql.VarChar, `%${search}%`);
  }
  if (role) {
    countReq.input('role', sql.VarChar, role);
    listReq.input('role', sql.VarChar, role);
  }
  if (status) {
    countReq.input('status', sql.VarChar, status);
    listReq.input('status', sql.VarChar, status);
  }

  listReq.input('limit', sql.Int, parseInt(limit, 10));
  listReq.input('offset', sql.Int, parseInt(offset, 10));

  const [countResult, listResult] = await Promise.all([
    countReq.query(countQuery),
    listReq.query(listQuery)
  ]);

  return {
    total: countResult.recordset[0]?.total || 0,
    users: listResult.recordset || []
  };
};

export const getDashboardStats = async () => {
  const pool = await poolPromise;

  // Execute all independent count queries in parallel
  const [totalUsersResult, totalFreelancersResult, totalEmployersResult, totalProjectsResult, activeContractsResult, pendingDisputesResult, pendingReportsResult, totalRevenueResult] = await Promise.all([
    pool.request().query('SELECT COUNT(*) as count FROM users WHERE role_default != \'ADMIN\''),
    pool.request().query('SELECT COUNT(*) as count FROM users WHERE role_default = \'FREELANCER\''),
    pool.request().query('SELECT COUNT(*) as count FROM users WHERE role_default = \'EMPLOYER\''),
    pool.request().query('SELECT COUNT(*) as count FROM projects'),
    pool.request().query('SELECT COUNT(*) as count FROM contracts WHERE status IN (\'ACTIVE\', \'APPROVED\')'),
    pool.request().query('SELECT COUNT(*) as count FROM disputes WHERE status = \'PENDING\''),
    pool.request().query('SELECT COUNT(*) as count FROM reports WHERE status = \'PENDING\''),
    pool.request().query('SELECT ISNULL(SUM(amount), 0) as total FROM transactions WHERE status = \'COMPLETED\''),
  ]);

  return {
    totalUsers: totalUsersResult.recordset[0]?.count || 0,
    totalFreelancers: totalFreelancersResult.recordset[0]?.count || 0,
    totalEmployers: totalEmployersResult.recordset[0]?.count || 0,
    totalProjects: totalProjectsResult.recordset[0]?.count || 0,
    activeContracts: activeContractsResult.recordset[0]?.count || 0,
    pendingDisputes: pendingDisputesResult.recordset[0]?.count || 0,
    pendingReports: pendingReportsResult.recordset[0]?.count || 0,
    totalRevenue: totalRevenueResult.recordset[0]?.total || 0,
  };
};
