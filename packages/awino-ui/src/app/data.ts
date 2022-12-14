import orderBy from 'lodash/orderBy';

import { GridRowsProp, GridSortModel } from '@mui/x-data-grid';

const assets = ['dai', 'usdt', 'usdc', 'eth', 'btc', 'cro', 'lod'];
// new Array(100).fill(null).map(() => (Math.random() * 100).toFixed(2))
const semiRandomValues = [
  7.71, 41.23, 24.72, 18.09, 90.07, 53.88, 79.06, 63.57, 0.51, 87.84, 89.75, 38.2, 90.3, 82.35, 3.34, 91.39, 56.89,
  32.87, 4.12, 64.41, 48.52, 37.19, 18.67, 84.3, 22.9, 9.34, 7.4, 27.3, 73.63, 66.48, 74.86, 49.38, 74.54, 36.71, 83.34,
  41.72, 31.67, 49.28, 34.83, 21.57, 86.51, 21.66, 72.08, 42.35, 34.47, 46.71, 80.23, 23.62, 49.03, 90.77, 18.65, 93.51,
  34.93, 20.24, 48.91, 7.15, 83.24, 7.48, 87.53, 58.47, 60.02, 53.01, 16.73, 88.37, 21.78, 30.05, 15.08, 1.41, 27.7,
  23.51, 44.93, 14.44, 56.27, 4.19, 76.39, 90.07, 71.68, 3.07, 69.45, 44.63, 14.01, 47.07, 53.54, 60.96, 11.89, 22.89,
  84.46, 43.22, 49.88, 6.72, 73.96, 88.96, 98.85, 74.07, 34.6, 23.04, 95.42, 96.67, 6.4, 98.06,
];
const semiRandomDates = [
  new Date(Date.UTC(1970, 0)),
  new Date(Date.UTC(1999, 0, 1, 13, 59, 59)),
  new Date(Date.UTC(2020, 11, 1, 0, 59, 59)),
  new Date(Date.UTC(2050, 0, 1, 0, 0, 0)),
];

const nextValue = (() => {
  let nextValueIndex = 0;
  return () => {
    if (nextValueIndex >= semiRandomValues.length) {
      nextValueIndex = 0;
    }
    return semiRandomValues[nextValueIndex++];
  };
})();

type RecordKeys = 'market' | 'earn-deposit' | 'earn-deposit-details' | 'borrow' | 'borrow-details' | 'analytics';
const recordsMap: Record<RecordKeys, GridRowsProp> = {
  market: new Array(assets.length)
    .fill({
      // asset
    })
    .map((m, index) => ({
      id: index,
      asset: assets[index % assets.length],
      totalSupply: nextValue(),
      totalBorrowed: nextValue(),
      depositAPY: nextValue(),
      borrowAPY: nextValue(),
      ...m,
    })) as GridRowsProp,
  'earn-deposit': new Array(20)
    .fill({
      // asset
      walletBalance: null,
    })
    .map((m, index) => ({
      id: index,
      asset: assets[index % assets.length],
      apy: nextValue(),
      collateral: !!Math.round(Math.random()),
      enabled: index % 2 === 0,
      ...m,
    })) as GridRowsProp,
  'earn-deposit-details': new Array(20)
    .fill({
      // asset
      walletBalance: null,
    })
    .map((m, index) => ({
      id: index,
      asset: assets[index % assets.length],
      apy: nextValue(),
      ...m,
    })) as GridRowsProp,
  borrow: new Array(20).fill({}).map((m, index) => ({
    id: index,
    asset: assets[index % assets.length],
    availableToBorrow: nextValue(),
    apy: nextValue(),
    utilization: nextValue(),
    enabled: index % 2 === 0,
    ...m,
  })) as GridRowsProp,
  'borrow-details': new Array(20)
    .fill({
      // asset
      walletBalance: null,
    })
    .map((m, index) => ({
      id: index,
      asset: assets[index % assets.length],
      apy: nextValue(),
      ...m,
    })) as GridRowsProp,
  analytics: new Array(20).fill({}).map((m, index) => ({
    id: index,
    date: semiRandomDates[index % 4],
    totalFees: nextValue(),
    ...m,
  })) as GridRowsProp,
};

interface LoadDataOptions {
  page: number;
  pageSize: number;
  sort: GridSortModel;
  term?: string;
}
interface LoadDataResponse {
  total: number;
  records: GridRowsProp;
}

// @TODO @REPLACE replace `records` map with the deployed `cTokens`.
// Add `address` of the cToken.
export default function loadData(
  model: RecordKeys,
  { page, pageSize, sort, term = '' }: LoadDataOptions
): Promise<LoadDataResponse> {
  return new Promise(
    (res) =>
      setTimeout(() => {
        const filteredData =
          term.length > 0
            ? recordsMap[model].filter(({ asset }) => asset.toLowerCase().startsWith(term.toLowerCase()))
            : recordsMap[model];
        return res({
          total: filteredData.length,
          records: orderBy(
            filteredData,
            sort.map(({ field }) => field),
            sort.map(({ sort }) => sort)
          ).slice(page * pageSize, (page + 1) * pageSize),
        });
      }, Math.random() * 200 + 100) // simulate network latency
  );
}

export function loadDataSync(model: RecordKeys, { page, pageSize, sort }: LoadDataOptions): LoadDataResponse {
  return {
    total: recordsMap[model].length,
    records: orderBy(
      recordsMap[model],
      sort.map(({ field }) => field),
      sort.map(({ sort }) => sort)
    ).slice(page * pageSize, (page + 1) * pageSize),
  };
}
