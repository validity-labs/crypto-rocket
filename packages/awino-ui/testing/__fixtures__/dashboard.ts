import { DashboardInfoData } from '@/components/pages/dashboard/InfoSection/InfoSection';
import { StatsData } from '@/types/app';

export const dashboardTotalStats: StatsData = [{ value: 493230 }, { value: 93430 }, { value: 1433.44 }];

export const dashboardInfo: DashboardInfoData = {
  borrowLimit: {
    percent: 10.3,
    amount: 254,
  },
  // depositBalance / netAPY / borrowBalance
  stats: [{ value: 32 }, { value: 0.4 }, { value: 234.3 }],
};
