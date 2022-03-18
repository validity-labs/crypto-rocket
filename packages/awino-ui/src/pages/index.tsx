import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import AssetSection from '@/components/pages/landing/AssetSection/AssetSection';
import BenefitSection from '@/components/pages/landing/BenefitSection/BenefitSection';
import FAQSection from '@/components/pages/landing/FAQSection/FAQSection';
import GuideSection from '@/components/pages/landing/GuideSection/GuideSection';
import InfoSection from '@/components/pages/landing/InfoSection/InfoSection';
import StatsSection from '@/components/pages/landing/StatsSection/StatsSection';
import { StatsData } from '@/types/pages/landing';

const stats: StatsData = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
];

const IndexPage: NextPage = () => {
  return (
    <>
      <Seo />
      <StatsSection items={stats} />
      <InfoSection />
      <BenefitSection />
      <GuideSection />
      <AssetSection />
      <FAQSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'landing';
  await store.dispatch(setPageI18nNamespace(ns));

  // console.log(locale, params, 'State on server', store.getState());

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default IndexPage;
