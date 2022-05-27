import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import BriefSection from '@/components/pages/earn/liquidity-staking/BriefSection/BriefSection';
import DetailsSection, {
  LiquidityStakingDetailsData as DetailsData,
} from '@/components/pages/earn/liquidity-staking/DetailsSection/DetailsSection';
import OperationSection, {
  LiquidityStakingOperationBalance as OperationBalance,
} from '@/components/pages/earn/liquidity-staking/OperationSection/OperationSection';
import { earnLiquidityStakingDetails, earnLiquidityStakingStats } from '@/fixtures/earn';
import { ChainId } from '@/lib/blockchain/awino-swap-sdk';
import { erc20AbiJson } from '@/lib/blockchain/common/erc20/abi/erc20';
import { AWINO_MASTER_CHEF_ADDRESS_MAP, AWINO_USDT_PAIR_ADDRESS_MAP } from '@/lib/blockchain/farm-pools';
import { sleep } from '@/lib/helpers';
import { StatsData } from '@/types/app';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
import IAwinoMasterChef from '@/lib/blockchain/farm-pools/abis/IAwinoMasterChef.json';

const EarnLiquidityStakingPage: NextPage = () => {
  const { account, library, chainId, connector } = useWeb3React();

  const [loading, setLoading] = useState(true);
  const [briefData, setBriefData] = useState<StatsData>([{ value: 0 }, { value: 0 }, { value: 0 }]);
  const [detailsData, setDetailsData] = useState<DetailsData>({
    stakingAPR: 0,
    totalRewardsPerDay: 0,
    lpTokenPrice: 0,
    totalRewardsPerWeek: 0,
    totalLPTokensStaked: 0,
  });
  const [balance, setBalance] = useState<OperationBalance>({ awi: '0' });
  const [stakedBalance, setStakedBalance] = useState<OperationBalance>({ awi: '0' });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const briefDataNew = await new Promise<StatsData>((res) => {
        return res(earnLiquidityStakingStats);
      });
      setBriefData(briefDataNew);
      const detailsDataNew = await new Promise<DetailsData>((res) => {
        return res(earnLiquidityStakingDetails);
      });
      setDetailsData(detailsDataNew);
      setLoading(false);
    })();
  }, []);

  // Set balance
  useEffect(() => {
    const fetchBalance = async () => {
      const contract = new ethers.Contract(AWINO_USDT_PAIR_ADDRESS_MAP[ChainId.TESTNET], erc20AbiJson, library);
      const balance = await contract.balanceOf(account);
      setBalance({ awi: ethers.utils.formatEther(balance.toString()) });
    };

    const fetchStakedBalance = async () => {
      const contract = new ethers.Contract(AWINO_MASTER_CHEF_ADDRESS_MAP[ChainId.TESTNET], IAwinoMasterChef, library);
      const balance = await contract.userInfo(0, account);
      console.log({ account, balance });
      setStakedBalance({ awi: ethers.utils.formatEther(balance.amount.toString()) });
    };

    setLoading(true);
    fetchBalance();
    fetchStakedBalance();
    setLoading(false);
  }, [account]);

  console.log({ balance, stakedBalance });
  return (
    <>
      <Seo />
      <BriefSection items={briefData} />
      <DetailsSection data={detailsData} loading={loading} />
      <OperationSection balance={balance} stakedBalance={stakedBalance} vestedBalance={{ awi: '0' }} />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'earn-liquidity-staking';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default EarnLiquidityStakingPage;
