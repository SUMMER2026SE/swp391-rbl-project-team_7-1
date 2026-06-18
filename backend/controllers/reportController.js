import { listReports, getReportDetails, resolveReport, dismissReport } from '../services/reportService.js';

export const getReports = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      report_type: req.query.report_type,
      limit: req.query.limit || 25,
      offset: req.query.offset || 0
    };

    const result = await listReports(filters);
    return res.json({ success: true, total: result.total, reports: result.reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ message: 'Failed to fetch reports.' });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getReportDetails(id);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ success: true, report: result.data });
  } catch (error) {
    console.error('Error fetching report detail:', error);
    return res.status(500).json({ message: 'Failed to fetch report details.' });
  }
};

export const patchResolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await resolveReport(id);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ success: true, reportId: result.data.reportId, status: result.data.status });
  } catch (error) {
    console.error('Error resolving report:', error);
    return res.status(500).json({ message: 'Failed to resolve report.' });
  }
};

export const patchDismissReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dismissReport(id);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    return res.json({ success: true, reportId: result.data.reportId, status: result.data.status });
  } catch (error) {
    console.error('Error dismissing report:', error);
    return res.status(500).json({ message: 'Failed to dismiss report.' });
  }
};
