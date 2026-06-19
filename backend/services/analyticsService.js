import * as analyticsRepository from '../repositories/analyticsRepository.js';

const MONTH_NAMES = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const fillMissingMonths = (data, key) => {
  const now = new Date();
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const existing = data.find(item => item.year === year && item.month === month);
    result.push({
      month: MONTH_NAMES[month],
      year,
      [key]: existing ? Number(existing[key]) : 0
    });
  }
  return result;
};

export const getAnalytics = async () => {
  const [
    overview,
    monthlyRevenue,
    monthlyProjects,
    monthlyUsers,
    projectStatusDistribution,
    contractStatusDistribution
  ] = await Promise.all([
    analyticsRepository.getOverviewStats(),
    analyticsRepository.getMonthlyRevenue(),
    analyticsRepository.getMonthlyProjects(),
    analyticsRepository.getMonthlyUsers(),
    analyticsRepository.getProjectStatusDistribution(),
    analyticsRepository.getContractStatusDistribution()
  ]);

  return {
    overview,
    monthlyRevenue: fillMissingMonths(monthlyRevenue, 'revenue'),
    monthlyProjects: fillMissingMonths(monthlyProjects, 'count'),
    monthlyUsers: fillMissingMonths(monthlyUsers, 'count'),
    projectStatusDistribution: projectStatusDistribution.map(item => ({
      name: item.status,
      value: item.count
    })),
    contractStatusDistribution: contractStatusDistribution.map(item => ({
      name: item.status,
      value: item.count
    }))
  };
};