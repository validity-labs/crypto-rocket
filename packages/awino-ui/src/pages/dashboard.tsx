import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
// import AssetSection from '@/components/pages/market/AssetSection/AssetSection';
// import StatsSection from '@/components/pages/market/StatsSection/StatsSection';

const DashboardPage: NextPage = () => {
  return (
    <>
      <Seo />
      {/* <StatsSection items={stats} /> */}
      {/* <AssetSection total={assets} /> */}
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'dashboard';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default DashboardPage;
