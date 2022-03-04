import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BenefitSection from '@/components/pages/landing/BenefitSection/BenefitSection';
import GuideSection from '@/components/pages/landing/GuideSection/GuideSection';
import InfoSection from '@/components/pages/landing/InfoSection/InfoSection';
import StatsSection from '@/components/pages/landing/StatsSection/StatsSection';

const stats = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
];

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poiret+One&family=MuseoModerno&display=block"
          rel="stylesheet"
        />
      </Head>
      <Seo />
      <StatsSection items={stats} />
      <InfoSection />
      <BenefitSection />
      <GuideSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale, params }) => {
  const ns = 'landing';
  await store.dispatch(setPageI18nNamespace(ns));

  console.log(locale, params, 'State on server', store.getState());

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default IndexPage;
