import api from './api';

/**
 * Report Service
 * 
 * Production-grade frontend service.
 * 
 * Key changes:
 * - buildReportPayload no longer accepts ownerId
 * - Uses standardized entityType + entityId contract
 * - Admin endpoints use /admin/reports path
 */

/**
 * Build report payload for submission
 * 
 * NEVER includes ownerId - backend resolves ownership from database.
 * 
 * @param {Object} params
 * @param {string} params.entityType - "PROJECT" | "USER" | "REVIEW" | "ORDER" | "MESSAGE"
 * @param {number} params.entityId - ID of the entity being reported
 * @param {string} params.violationType - Type of violation
 * @param {string} params.description - Description of the violation
 * @returns {Object} Clean payload ready for API
 */
export const buildReportPayload = ({ entityType, entityId, violationType, description }) => {
  const normalizedEntityType = (entityType || '').toUpperCase();
  
  return {
    entityType: normalizedEntityType,
    entityId: Number(entityId),
    violationType: violationType || 'OTHER',
    description: (description || '').trim()
  };
};

export const reportService = {
  /**
   * Submit a new report
   * POST /api/reports
   */
  submitReport: async (payload) => {
    const response = await api.post('/reports', payload);
    return response.data;
  },

  /**
   * Get admin reports list
   * GET /api/admin/reports
   */
  getAdminReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  /**
   * Get report detail by ID
   * GET /api/admin/reports/:id
   */
  getReportById: async (reportId) => {
    const response = await api.get(`/admin/reports/${reportId}`);
    return response.data;
  },

  /**
   * Resolve a report
   * PATCH /api/admin/reports/:id/resolve
   */
  resolveReport: async (reportId, note) => {
    const response = await api.patch(`/admin/reports/${reportId}/resolve`, { note });
    return response.data;
  },

  /**
   * Dismiss a report
   * PATCH /api/admin/reports/:id/dismiss
   */
  dismissReport: async (reportId, note) => {
    const response = await api.patch(`/admin/reports/${reportId}/dismiss`, { note });
    return response.data;
  },

  /**
   * Mark report as under review
   * PATCH /api/admin/reports/:id/review
   */
  reviewReport: async (reportId) => {
    const response = await api.patch(`/admin/reports/${reportId}/review`);
    return response.data;
  },

  /**
   * Reopen a resolved/dismissed report
   * PATCH /api/admin/reports/:id/reopen
   */
  reopenReport: async (reportId, note) => {
    const response = await api.patch(`/admin/reports/${reportId}/reopen`, { note });
    return response.data;
  },

  /**
   * Get current user's reports
   * GET /api/reports/my
   */
  getMyReports: async (params = {}) => {
    const response = await api.get('/reports/my', { params });
    return response.data;
  },

  /**
   * Add evidence to a report
   * POST /api/reports/:id/evidence
   */
  addEvidence: async (reportId, { fileUrl, fileType, fileName, fileSize }) => {
    const response = await api.post(`/reports/${reportId}/evidence`, {
      fileUrl, fileType, fileName, fileSize
    });
    return response.data;
  }
};
