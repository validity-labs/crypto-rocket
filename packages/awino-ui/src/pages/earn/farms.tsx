import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import dateIO from '@/app/dateIO';
import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import ResultSection from '@/components/pages/earn/farms/ResultSection/ResultSection';
import DetailsSection, {
  InfiniteDetailsData as DetailsData,
} from '@/components/pages/infinite/DetailsSection/DetailsSection';
// import OperationSection, {
//   LiquidityStakingOperationBalance as OperationBalance,
// } from '@/components/pages/earn/liquidity-staking/OperationSection/OperationSection';
import { infiniteDetails, infiniteStats } from '@/fixtures/infinite';
import { sleep } from '@/lib/helpers';
import { StatsData } from '@/types/app';

const FarmsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [briefData, setBriefData] = useState<StatsData>([{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]);
  const [detailsData, setDetailsData] = useState<DetailsData>({
    // set to yesterday so there is nothing to show in next distribution block component
    nextDistributionBlockDate: dateIO.addDays(new Date(), -1),
    awinoBalance: 0,
    stats: {
      totalAWILocked: 0,
      totalAWILockedValue: 0,
      averageUnlockTime: 0,
      nextDistribution: null,
      distribution: 0,
      distributionValue: 0,
      awiPerInfinity: 0,
      apr: 0,
      claimAmount: 0,
    },
    globalVotes: [],
  });
  // const [balance, setBalance] = useState<OperationBalance>({ awi: 0 });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const briefDataNew = await new Promise<StatsData>((res) => {
        return res(infiniteStats);
      });
      setBriefData(briefDataNew);
      const detailsDataNew = await new Promise<DetailsData>((res) => {
        return res(infiniteDetails);
      });
      setDetailsData(detailsDataNew);
      // setBalance({ awi: 99.98 });
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <ResultSection />
      {/* <DetailsSection data={detailsData} loading={loading} /> */}
      {/* <OperationSection balance={balance} /> */}
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-farms';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'yup', ns])),
    },
  };
});

export default FarmsPage;
