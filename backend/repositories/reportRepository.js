import { sql, poolPromise } from '../config/db.js';

const parseIntParam = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
};

const parsePositiveIntParam = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};

export const buildReportFilters = ({ status, report_type }) => {
  const whereClauses = [];
  const params = {};

  if (status && typeof status === 'string') {
    whereClauses.push('vr.status = @status');
    params.status = { type: sql.VarChar(50), value: status.trim().toUpperCase() };
  }

  if (report_type && typeof report_type === 'string') {
    whereClauses.push('vr.report_type = @report_type');
    params.report_type = { type: sql.VarChar(100), value: report_type.trim() };
  }

  return {
    whereSql: whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '',
    params
  };
};

export const fetchReports = async ({ status, report_type, limit = 25, offset = 0 }) => {
  const pool = await poolPromise;
  const { whereSql, params } = buildReportFilters({ status, report_type });

  const safeLimit = Math.min(Math.max(parsePositiveIntParam(limit) ?? 25, 1), 100);
  const safeOffset = parsePositiveIntParam(offset) ?? 0;

  const countRequest = pool.request();
  const listRequest = pool.request();

  Object.entries(params).forEach(([name, { type, value }]) => {
    countRequest.input(name, type, value);
    listRequest.input(name, type, value);
  });

  listRequest.input('limit', sql.Int, safeLimit);
  listRequest.input('offset', sql.Int, safeOffset);

  const countQuery = `
    SELECT COUNT(1) AS total
    FROM violation_reports vr
    ${whereSql}
  `;

  const listQuery = `
    SELECT
      vr.report_id,
      vr.report_type,
      vr.status,
      vr.description,
      vr.reporter_id,
      vr.target_user_id,
      vr.created_at,
      vr.resolved_at,
      rep.full_name AS reporter_name,
      tgt.full_name AS target_name
    FROM violation_reports vr
    LEFT JOIN users rep ON vr.reporter_id = rep.user_id
    LEFT JOIN users tgt ON vr.target_user_id = tgt.user_id
    ${whereSql}
    ORDER BY vr.created_at DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  const [countResult, listResult] = await Promise.all([
    countRequest.query(countQuery),
    listRequest.query(listQuery)
  ]);

  return {
    total: countResult.recordset[0]?.total || 0,
    reports: listResult.recordset || []
  };
};

export const getReportById = async (reportId) => {
  const id = parseIntParam(reportId);
  if (!id || id <= 0) {
    return null;
  }

  const pool = await poolPromise;
  const result = await pool.request()
    .input('reportId', sql.Int, id)
    .query(`
      SELECT
        vr.report_id,
        vr.report_type,
        vr.status,
        vr.description,
        vr.reporter_id,
        vr.target_user_id,
        vr.created_at,
        vr.resolved_at,
        rep.full_name AS reporter_name,
        tgt.full_name AS target_name
      FROM violation_reports vr
      LEFT JOIN users rep ON vr.reporter_id = rep.user_id
      LEFT JOIN users tgt ON vr.target_user_id = tgt.user_id
      WHERE vr.report_id = @reportId
    `);

  return result.recordset[0] || null;
};

export const updateReportStatus = async (reportId, status) => {
  const id = parseIntParam(reportId);
  if (!id || id <= 0) {
    throw new Error('Invalid report id.');
  }

  const pool = await poolPromise;
  await pool.request()
    .input('reportId', sql.Int, id)
    .input('status', sql.VarChar(50), status)
    .query(`
      UPDATE violation_reports
      SET status = @status,
          resolved_at = SYSUTCDATETIME()
      WHERE report_id = @reportId
    `);
};
