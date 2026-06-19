import { sql, poolPromise } from '../config/db.js';

export const getOverviewStats = async () => {
  const pool = await poolPromise;

  const queries = [
    pool.request().query(`SELECT COUNT(*) as count FROM users`),
    pool.request().query(`SELECT COUNT(*) as count FROM users WHERE role_default = 'FREELANCER'`),
    pool.request().query(`SELECT COUNT(*) as count FROM users WHERE role_default = 'EMPLOYER'`),
    pool.request().query(`SELECT COUNT(*) as count FROM projects`),
    pool.request().query(`SELECT COUNT(*) as count FROM projects WHERE status = 'ACTIVE'`),
    pool.request().query(`SELECT COUNT(*) as count FROM projects WHERE status = 'CLOSED'`),
    pool.request().query(`SELECT COUNT(*) as count FROM contracts WHERE status IN ('ACTIVE', 'APPROVED')`),
    pool.request().query(`SELECT COUNT(*) as count FROM contracts WHERE status = 'COMPLETED'`),
    pool.request().query(`SELECT COUNT(*) as count FROM disputes WHERE status = 'OPEN'`),
    pool.request().query(`SELECT COUNT(*) as count FROM reports WHERE status = 'PENDING'`),
    pool.request().query(`SELECT ISNULL(SUM(amount), 0) as total FROM transactions WHERE status = 'COMPLETED'`),
  ];

  const results = await Promise.all(queries);

  return {
    totalUsers: results[0].recordset[0]?.count || 0,
    totalFreelancers: results[1].recordset[0]?.count || 0,
    totalEmployers: results[2].recordset[0]?.count || 0,
    totalProjects: results[3].recordset[0]?.count || 0,
    activeProjects: results[4].recordset[0]?.count || 0,
    completedProjects: results[5].recordset[0]?.count || 0,
    activeContracts: results[6].recordset[0]?.count || 0,
    completedContracts: results[7].recordset[0]?.count || 0,
    pendingDisputes: results[8].recordset[0]?.count || 0,
    pendingReports: results[9].recordset[0]?.count || 0,
    totalRevenue: results[10].recordset[0]?.total || 0,
  };
};

export const getMonthlyRevenue = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      YEAR(created_at) as year,
      MONTH(created_at) as month,
      ISNULL(SUM(amount), 0) as revenue
    FROM transactions
    WHERE status = 'COMPLETED'
      AND created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY year ASC, month ASC
  `);
  return result.recordset;
};

export const getMonthlyProjects = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      YEAR(created_at) as year,
      MONTH(created_at) as month,
      COUNT(*) as count
    FROM projects
    WHERE created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY year ASC, month ASC
  `);
  return result.recordset;
};

export const getMonthlyUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      YEAR(created_at) as year,
      MONTH(created_at) as month,
      COUNT(*) as count
    FROM users
    WHERE created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY year ASC, month ASC
  `);
  return result.recordset;
};

export const getProjectStatusDistribution = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT status, COUNT(*) as count
    FROM projects
    GROUP BY status
    ORDER BY count DESC
  `);
  return result.recordset;
};

export const getContractStatusDistribution = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT status, COUNT(*) as count
    FROM contracts
    GROUP BY status
    ORDER BY count DESC
  `);
  return result.recordset;
};