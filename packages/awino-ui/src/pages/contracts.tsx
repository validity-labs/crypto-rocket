import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import ContractSection from '@/components/pages/contracts/ContractSection/ContractSection';
import { contractGroupedList } from '@/fixtures/contracts';
import { sleep } from '@/lib/helpers';
import { ContractsGrouped } from '@/types/app';

const ContractsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ContractsGrouped>({ tokens: [], stableCoins: [] });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const itemsNew = await new Promise<any>((res) => {
        return res(contractGroupedList);
      });
      setItems(itemsNew);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <ContractSection loading={loading} items={items} />
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
