import { fetchReports, getReportById, updateReportStatus } from '../repositories/reportRepository.js';

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
