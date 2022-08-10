import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

// import { Grid } from '@mui/material';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
// import { ClaimModalData } from '@/components/pages/earn/manage-awino/ClaimSection/ClaimModal';
import ClaimSection from '@/components/pages/earn/manage-awino/ClaimSection/ClaimSection';
import IntroSection from '@/components/pages/earn/manage-awino/IntroSection/IntroSection';
import OperationSection from '@/components/pages/earn/manage-awino/OperationSection/OperationSection';
import { StakeData } from '@/components/pages/earn/manage-awino/OperationSection/StakeCard';
// import StatsSection from '@/components/pages/shared/StatsSection/StatsSection';
import { earnManageAwinoStake, earnManageAwinoStats } from '@/fixtures/earn';
import { AWINO_TOKEN_MAP, ChainId, useTokenBalance } from '@/lib/blockchain';
import { erc20AbiJson } from '@/lib/blockchain/erc20/abi/erc20';
// import { formatAWI, formatUSD } from '@/lib/formatters';
// import { sleep } from '@/lib/helpers';
import { StatsData, StatsFormatter } from '@/types/app';
// import AssetSection from '@/components/pages/market/AssetSection/AssetSection';

export const statsFormatters: StatsFormatter[] = [
  { value: 'usd', subValues: ['awi'] },
  { value: 'usd' },
  { value: 'usd', subValues: ['usd', 'usd'] },
];

const initialStatsData: StatsData = [{ value: 0, subValues: [0] }, { value: 0 }, { value: 0, subValues: [0, 0] }];

const initialStakeData: StakeData = { apr: 0, balance: { awi: 0, usd: 0 } };

const EarnManageAwinoPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(initialStatsData);
  const [stakeData, setStakeData] = useState(initialStakeData);

  const { account, library, chainId } = useWeb3React();
  const [balance, setBalance] = useState<string>('0');

  const updateBalance = async (account: string, library: any) => {
    const contract = new ethers.Contract(AWINO_TOKEN_MAP[ChainId.TESTNET], erc20AbiJson, library);
    const balance = await contract.balanceOf(account);
    setBalance(ethers.utils.formatEther(balance.toString()));
  };

  useEffect(() => {
    (async () => {
      await updateBalance(account, library);

      const newStatsData = await new Promise<StatsData>((res) => {
        return res(earnManageAwinoStats);
      });
      setStatsData(newStatsData);

      const newStakeData = await new Promise<StakeData>((res) => {
        return res(earnManageAwinoStake);
      });
      setStakeData({ apr: 7.32, balance: { awi: balance, usd: balance } });

      setLoading(false);
    })();
  }, [balance, chainId, account, library]);

  return (
    <>
      <Seo />
      <IntroSection />
      <OperationSection
        statItems={statsData}
        statFormatters={statsFormatters}
        stake={stakeData}
        updateBalance={updateBalance}
      />
      <ClaimSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-manage-awino';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default EarnManageAwinoPage;
