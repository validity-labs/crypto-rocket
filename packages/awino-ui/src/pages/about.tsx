import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import ApproachSection from '@/components/pages/about/ApproachSection/ApproachSection';
import InfoSection from '@/components/pages/about/InfoSection/InfoSection';
import TeamSection from '@/components/pages/about/TeamSection/TeamSection';

const AboutPage: NextPage = () => {
  return (
    <>
      <Seo />
      <InfoSection />
      <ApproachSection />
      <TeamSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'about';
  await store.dispatch(setPageI18nNamespace(ns));

  // console.log(locale, params, 'State on server', store.getState());

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default AboutPage;
