import * as analyticsRepository from '../repositories/analyticsRepository.js';

const fillMissingMonths = (data, key) => {
  const now = new Date();
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const existing = data.find(item => item.month === monthStr);
    result.push({
      month: monthStr,
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
    contractStatusDistribution,
    topCategories,
    topSkills
  ] = await Promise.all([
    analyticsRepository.getOverviewStats(),
    analyticsRepository.getMonthlyRevenue(),
    analyticsRepository.getMonthlyProjects(),
    analyticsRepository.getMonthlyUsers(),
    analyticsRepository.getProjectStatusDistribution(),
    analyticsRepository.getContractStatusDistribution(),
    analyticsRepository.getTopCategories(),
    analyticsRepository.getTopSkills()
  ]);

  return {
    overview,
    monthlyRevenue: fillMissingMonths(monthlyRevenue, 'amount'),
    monthlyProjects: fillMissingMonths(monthlyProjects, 'count'),
    monthlyUsers: fillMissingMonths(monthlyUsers, 'count'),
    projectStatusDistribution: projectStatusDistribution.map(item => ({
      status: item.status,
      count: item.count
    })),
    contractStatusDistribution: contractStatusDistribution.map(item => ({
      status: item.status,
      count: item.count
    })),
    topCategories,
    topSkills
  };
};