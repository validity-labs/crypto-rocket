import BigNumber from 'bignumber.js';

import { MarketTypeInfo, MarketInfo } from '@/types/app';
import type { StatsData } from '@/types/pages/landing';
import { TotalAssetSize } from '@/types/pages/market';

export const statsSectionData: StatsData = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
  { value: 47.4, subvalue: 24.72 },
];

export const assetSectionData: TotalAssetSize = { market: 12345678, platform: 1234567.89 };

export const marketTypeInfo: MarketTypeInfo = {
  supply: {
    netRate: 0.1,
    apy: 0.04,
    distributionApy: 0.06,
    total: 3661920000.01,
  },
  borrow: {
    netRate: 0.13,
    apy: 2.56,
    distributionApy: 2.69,
    total: 79350000.98,
  },
};

export const marketInfo: MarketInfo = {
  price: new BigNumber(160.8),
  marketLiquidity: new BigNumber(683891),
  nOfSuppliers: new BigNumber(4703),
  nOfBorrowers: new BigNumber(91),
  borrowCap: new BigNumber(14590000),
  interestPaidDay: new BigNumber(16.11),
  reserves: new BigNumber(2210),
  reserveFactor: new BigNumber(25),
  collateralFactor: new BigNumber(65),
  cMinted: new BigNumber(33501656),
  exchangeRate: new BigNumber(49.03451162246615),
  utilization: new BigNumber(2),
};
