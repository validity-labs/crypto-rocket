import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { GlobalStyles } from '@mui/material';

import { useAppSelector } from '@/app/hooks';
import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import { AnimatedBackground } from '@/components/pages/landing/AnimatedBackground/AnimatedBackground';
import BenefitSection from '@/components/pages/landing/BenefitSection/BenefitSection';
import FAQSection from '@/components/pages/landing/FAQSection/FAQSection';
import GuideSection from '@/components/pages/landing/GuideSection/GuideSection';
import InfoSection from '@/components/pages/landing/InfoSection/InfoSection';
import JoinSection from '@/components/pages/landing/JoinSection/JoinSection';
import StatsSection from '@/components/pages/landing/StatsSection/StatsSection';
import TotalSection from '@/components/pages/landing/TotalSection/TotalSection';
import { StatsData } from '@/types/app';

const stats: StatsData = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
];

const totalStats: StatsData = [{ value: 493230 }, { value: 93430 }, { value: 1433.44 }];

const IndexPage: NextPage = () => {
  const { connected } = useAppSelector((state) => ({
    connected: state.account.connected,
  }));
  return (
    <>
      <Seo />
      <AnimatedBackground />
      <GlobalStyles styles={{ 'main *': { userSelect: 'none' } }} />
      {connected && <TotalSection items={totalStats} />}
      <StatsSection items={stats} />
      <InfoSection />
      <BenefitSection />
      <GuideSection />
      <FAQSection />
      {!connected && <JoinSection />}
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
