import { fetchReports, getReportById, updateReportStatus, createReport, findDuplicateReport } from '../repositories/reportRepository.js';
import { getUserById } from '../services/userService.js';

const allowedStatuses = ['PENDING', 'RESOLVED', 'DISMISSED'];

export const listReports = async (filters) => {
  return fetchReports(filters);
};

export const getReportDetails = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    return { status: 404, error: 'Report not found.' };
  }
  return { status: 200, data: report };
};

export const resolveReport = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    return { status: 404, error: 'Report not found.' };
  }

  if (report.status === 'RESOLVED') {
    return { status: 400, error: 'Report is already resolved.' };
  }

  await updateReportStatus(reportId, 'RESOLVED');
  return { status: 200, data: { reportId, status: 'RESOLVED' } };
};

export const dismissReport = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    return { status: 404, error: 'Report not found.' };
  }

  if (report.status === 'DISMISSED') {
    return { status: 400, error: 'Report is already dismissed.' };
  }

  await updateReportStatus(reportId, 'DISMISSED');
  return { status: 200, data: { reportId, status: 'DISMISSED' } };
};

export const createNewReport = async ({ reporterId, targetUserId, reportType, reason, description }) => {
  // Validate required fields
  if (!reporterId) {
    return { status: 400, error: 'Reporter ID is required.' };
  }
  if (!targetUserId) {
    return { status: 400, error: 'Target user ID is required.' };
  }
  if (!reportType || !reportType.trim()) {
    return { status: 400, error: 'Report type is required.' };
  }
  if (!description || !description.trim()) {
    return { status: 400, error: 'Description is required.' };
  }

  // Cannot report yourself
  if (Number(reporterId) === Number(targetUserId)) {
    return { status: 400, error: 'You cannot report yourself.' };
  }

  // Target user must exist
  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return { status: 404, error: 'Target user not found.' };
  }

  // Prevent duplicate pending reports from same reporter to same target
  const duplicate = await findDuplicateReport({ reporterId, targetUserId });
  if (duplicate) {
    return { status: 400, error: 'You have already submitted a pending report against this user.' };
  }

  const reportId = await createReport({
    reporterId,
    targetUserId,
    reportType: reportType.trim(),
    reason: reason || null,
    description: description.trim()
  });

  return { status: 201, data: { reportId, status: 'PENDING' } };
};
