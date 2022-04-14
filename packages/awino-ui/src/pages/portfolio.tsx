import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BalanceSection from '@/components/pages/portfolio/BalanceSection/BalanceSection';
import { balanceGroupedList } from '@/fixtures/portfolio';
import { sleep } from '@/lib/helpers';
import { BalanceGrouped } from '@/types/app';

const PortfolioPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BalanceGrouped>({ tokens: [], stableCoins: [], pool: [] });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const itemsNew = await new Promise<any>((res) => {
        return res(balanceGroupedList);
      });
      setItems(itemsNew);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <BalanceSection loading={loading} items={items} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'portfolio';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      protected: true,
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default PortfolioPage;
