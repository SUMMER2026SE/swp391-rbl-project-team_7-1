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
      FORMAT(created_at, 'yyyy-MM') as month,
      ISNULL(SUM(amount), 0) as amount
    FROM transactions
    WHERE status = 'COMPLETED'
      AND created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY FORMAT(created_at, 'yyyy-MM')
    ORDER BY month ASC
  `);
  return result.recordset;
};

export const getMonthlyProjects = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      FORMAT(created_at, 'yyyy-MM') as month,
      COUNT(*) as count
    FROM projects
    WHERE created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY FORMAT(created_at, 'yyyy-MM')
    ORDER BY month ASC
  `);
  return result.recordset;
};

export const getMonthlyUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT 
      FORMAT(created_at, 'yyyy-MM') as month,
      COUNT(*) as count
    FROM users
    WHERE created_at >= DATEADD(MONTH, -12, GETDATE())
    GROUP BY FORMAT(created_at, 'yyyy-MM')
    ORDER BY month ASC
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

export const getTopCategories = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT TOP 5
      pc.category_name as category,
      COUNT(p.project_id) as count
    FROM projects p
    LEFT JOIN project_categories pc ON p.category_id = pc.category_id
    GROUP BY pc.category_name
    ORDER BY count DESC
  `);
  return result.recordset;
};

export const getTopSkills = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT TOP 10
      s.skill_name as skill,
      COUNT(ps.project_id) as count
    FROM project_skills ps
    JOIN skills s ON ps.skill_id = s.skill_id
    GROUP BY s.skill_name
    ORDER BY count DESC
  `);
  return result.recordset;
};