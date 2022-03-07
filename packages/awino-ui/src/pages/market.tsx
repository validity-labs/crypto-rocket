import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import AssetSection from '@/components/pages/market/AssetSection/AssetSection';
import StatsSection from '@/components/pages/market/StatsSection/StatsSection';

const stats = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
  { value: 47.4, subvalue: 24.72 },
];

const assets = { market: 12345678, platform: 1234567.89 };

const MarketPage: NextPage = () => {
  return (
    <>
      <Seo />
      <StatsSection items={stats} />
      <AssetSection total={assets} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'market';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default MarketPage;
