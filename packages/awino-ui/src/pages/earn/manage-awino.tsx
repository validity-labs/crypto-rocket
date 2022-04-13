import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Grid } from '@mui/material';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import { ClaimModalData } from '@/components/pages/earn/manage-awino/ClaimSection/ClaimModal';
import ClaimSection, { ClaimData } from '@/components/pages/earn/manage-awino/ClaimSection/ClaimSection';
import IntroSection from '@/components/pages/earn/manage-awino/IntroSection/IntroSection';
import { LockData } from '@/components/pages/earn/manage-awino/OperationSection/LockCard';
import OperationSection from '@/components/pages/earn/manage-awino/OperationSection/OperationSection';
import { StakeData } from '@/components/pages/earn/manage-awino/OperationSection/StakeCard';
import StatsSection from '@/components/pages/shared/FormattedStatsSection/StatsSection';
import { earnManageAwinoClaim, earnManageAwinoLock, earnManageAwinoStake, earnManageAwinoStats } from '@/fixtures/earn';
import { formatAWI, formatUSD } from '@/lib/formatters';
import { sleep } from '@/lib/helpers';
import { StatsData, StatsFormatter } from '@/types/app';
// import AssetSection from '@/components/pages/market/AssetSection/AssetSection';
// import StatsSection from '@/components/pages/market/StatsSection/StatsSection';

export const statsFormatters: StatsFormatter[] = [
  { value: formatUSD, subValues: [formatAWI, formatAWI] },
  { value: formatUSD },
  { value: formatUSD },
  { value: formatUSD },
  { value: formatUSD, subValues: [formatUSD, formatUSD] },
];

const initialStatsData: StatsData = [
  { value: 0, subValues: [0, 0] },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0, subValues: [0, 0] },
];

const initialStakeData: StakeData = { apr: 0, balance: { geist: 0, usd: 0 } };

const initialLockData: LockData = { apr: 0, balance: { geist: 0, usd: 0 } };

const initialClaimData: ClaimData = {
  unlockedAWI: { geist: 0, claimable: true },
  vestingAWI: { geist: 0, claimable: false },
  claimAll: { geist: 0, awi: 0, claimable: true },
  expiredLockedAWI: { geist: 0, claimable: true },
};

const EarnManageAwinoPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [stakeData, setStakeData] = useState(initialStakeData);
  const [lockData, setLockData] = useState(initialLockData);
  const [claimData, setClaimData] = useState(initialClaimData);

  useEffect(() => {
    (async () => {
      await sleep(2);
      const newStatsData = await new Promise<StatsData>((res) => {
        return res(earnManageAwinoStats);
      });
      setStatsData(newStatsData);

      const newStakeData = await new Promise<StakeData>((res) => {
        return res(earnManageAwinoStake);
      });
      setStakeData(newStakeData);

      const newLockData = await new Promise<LockData>((res) => {
        return res(earnManageAwinoLock);
      });
      setLockData(newLockData);

      const newClaimData = await new Promise<ClaimData>((res) => {
        return res(earnManageAwinoClaim);
      });
      setClaimData(newClaimData);

      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <IntroSection />
      <OperationSection statItems={statsData} statFormatters={statsFormatters} stake={stakeData} lock={lockData} />
      <ClaimSection data={claimData} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-manage-awino';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default EarnManageAwinoPage;
