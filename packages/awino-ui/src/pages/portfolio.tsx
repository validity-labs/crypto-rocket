import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BalanceSection from '@/components/pages/portfolio/BalanceSection/BalanceSection';
import { balanceGroupedList } from '@/fixtures/portfolio';

const PortfolioPage: NextPage = () => {
  return (
    <>
      <Seo />
      <BalanceSection items={balanceGroupedList} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'portfolio';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default PortfolioPage;
