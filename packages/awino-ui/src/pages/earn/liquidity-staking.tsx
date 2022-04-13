import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BriefSection from '@/components/pages/earn/liquidity-staking/BriefSection/BriefSection';
import DetailsSection, {
  LiquidityStakingDetailsData as DetailsData,
} from '@/components/pages/earn/liquidity-staking/DetailsSection/DetailsSection';
import OperationSection, {
  LiquidityStakingOperationBalance as OperationBalance,
} from '@/components/pages/earn/liquidity-staking/OperationSection/OperationSection';
import { earnLiquidityStakingDetails, earnLiquidityStakingStats } from '@/fixtures/earn';
import { sleep } from '@/lib/helpers';
import { StatsData } from '@/types/app';

const EarnLiquidityStakingPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [briefData, setBriefData] = useState<StatsData>([{ value: 0 }, { value: 0 }, { value: 0 }]);
  const [detailsData, setDetailsData] = useState<DetailsData>({
    stakingAPR: 0,
    totalRewardsPerDay: 0,
    lpTokenPrice: 0,
    totalRewardsPerWeek: 0,
    totalLPTokensStaked: 0,
  });
  const [balance, setBalance] = useState<OperationBalance>({ awi: 0 });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const briefDataNew = await new Promise<StatsData>((res) => {
        return res(earnLiquidityStakingStats);
      });
      setBriefData(briefDataNew);
      const detailsDataNew = await new Promise<DetailsData>((res) => {
        return res(earnLiquidityStakingDetails);
      });
      setDetailsData(detailsDataNew);
      setBalance({ awi: 99.98 });
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <BriefSection items={briefData} />
      <DetailsSection data={detailsData} loading={loading} />
      <OperationSection balance={balance} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-liquidity-staking';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default EarnLiquidityStakingPage;
