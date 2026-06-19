import * as analyticsService from '../services/analyticsService.js';

export const getAdminAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getAnalytics();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi lấy dữ liệu thống kê.'
    });
  }
};