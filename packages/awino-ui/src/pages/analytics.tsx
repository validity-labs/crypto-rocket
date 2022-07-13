import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import PlatformSection from '@/components/pages/analytics/PlatformSection/PlatformSection';
import StatsSection from '@/components/pages/shared/StatsSection/StatsSection';
import { StatsFormatter } from '@/types/app';

const stats = [
  { value: 89.7, subValues: [24.72] },
  { value: 89.7, subValues: [24.72] },
  { value: 0.27 },
  { value: 273.4, subValues: [52] },
  { value: 47.4, subValues: [24.72] },
];

export const statsFormatters: StatsFormatter[] = [
  { value: 'amount', subValues: ['usd'] },
  { value: 'amount', subValues: ['usd'] },
  { value: 'usd' },
  { value: 'amount', subValues: ['percent'] },
  { value: 'amount', subValues: ['usd'] },
];

const platformStats = {
  totalDeposit: 1232432,
  totalBorrow: 438403.33,
  globalHealthRatio: 1.38,
  totalPlatformFee: 3432332,
};
const AnalyticsPage: NextPage = () => {
  return (
    <>
      <Seo />
      <StatsSection items={stats} formatters={statsFormatters} />
      <PlatformSection stats={platformStats} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'analytics';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default AnalyticsPage;
