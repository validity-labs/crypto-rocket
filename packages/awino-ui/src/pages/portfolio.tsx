import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BalanceSection from '@/components/pages/portfolio/BalanceSection/BalanceSection';
import { contractGroupedList } from '@/fixtures/contracts';
import { balanceGroupedList } from '@/fixtures/portfolio';
import { getBalanceFormatted } from '@/lib/blockchain';
import { sleep } from '@/lib/helpers';
import { BalanceGrouped } from '@/types/app';

const PortfolioPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BalanceGrouped>({ tokens: [], stableCoins: [], pool: [] });
  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    (async () => {
      // @TODO refactor.
      // 1. fetch pools dynamically (subgraph ?)
      // 2. batch requests
      const contracts = contractGroupedList;

      let itemsNew = {
        tokens: [],
        pool: [],
        stableCoins: [],
      };

      for (const item of contracts.tokens) {
        try {
          itemsNew.tokens.push({
            key: item.key,
            total: new BigNumber(await getBalanceFormatted(item.address, account, library, item.decimals)),
          });
        } catch (error) {
          itemsNew.tokens.push({
            key: item.key,
            total: new BigNumber(0),
          });
        }
      }

      for (const item of contracts.stableCoins) {
        try {
          itemsNew.stableCoins.push({
            key: item.key,
            total: new BigNumber(await getBalanceFormatted(item.address, account, library, item.decimals)),
          });
        } catch (error) {
          itemsNew.tokens.push({
            key: item.key,
            total: new BigNumber(0),
          });
        }
      }

      for (const item of contracts.pools) {
        try {
          itemsNew.pool.push({
            key: item.key,
            total: new BigNumber(await getBalanceFormatted(item.address, account, library, item.decimals)),
            staked: 0,
            assets: item.key.split('/'),
          });
        } catch (error) {
          itemsNew.pool.push({
            key: item.key,
            total: new BigNumber(0),
            staked: 0,
            assets: item.key.split('/'),
          });
        }
      }

      setItems(itemsNew);
      setLoading(false);
    })();
  }, [account, library, chainId]);

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
