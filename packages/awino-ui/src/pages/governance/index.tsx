import React, { useState, useEffect } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import InfoSection from '@/components/pages/governance/InfoSection/InfoSection';
import ProposalSection from '@/components/pages/governance/ProposalSection/ProposalSection';
import { governanceInfo } from '@/fixtures/governance';
import { sleep } from '@/lib/helpers';
import { GovernanceInfo } from '@/types/app';
// import AssetSection from '@/components/pages/market/AssetSection/AssetSection';

// const stats = [
//   { value: 89.7, subValues: [24.72] },
//   { value: 89.7, subValues: [24.72] },
//   { value: 0.27, subValues: [24.72] },
//   { value: 273.4, subValues: [52] },
//   { value: 47.4 },
// ];

// const assets = { market: 12345678, platform: 1234567.89 };

const GovernancePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<GovernanceInfo>({
    treasuryAmount: 0,
    treasuryAmountUSD: 0,
  });

  useEffect(() => {
    (async () => {
      await sleep(2);
      setInfo(governanceInfo);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <InfoSection loading={loading} info={info} />
      <ProposalSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'governance';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default GovernancePage;
