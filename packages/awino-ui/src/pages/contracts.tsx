import React from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import ContractSection from '@/components/pages/contracts/ContractSection/ContractSection';
import { contractGroupedList } from '@/fixtures/contracts';

const ContractsPage: NextPage = () => {
  return (
    <>
      <Seo />
      <ContractSection items={contractGroupedList} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'contracts';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default ContractsPage;
