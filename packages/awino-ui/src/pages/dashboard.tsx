import React, { useState, useEffect } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Seo from '@/components/layout/Seo/Seo';
import AssetSection from '@/components/pages/dashboard/AssetSection/AssetSection';
import InfoSection, { DashboardInfoData } from '@/components/pages/dashboard/InfoSection/InfoSection';
import TotalSection from '@/components/pages/dashboard/TotalSection/TotalSection';
import { dashboardInfo, dashboardTotalStats } from '@/fixtures/dashboard';
import { sleep } from '@/lib/helpers';
import { StatsData } from '@/types/app';

const DashboardPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<StatsData>([{ value: 0 }, { value: 0 }, { value: 0 }]);
  const [info, setInfo] = useState<DashboardInfoData>({
    borrowLimit: {
      percent: 0,
      amount: 0,
    },
    stats: [{ value: 0 }, { value: 0 }, { value: 0 }],
  });

  useEffect(() => {
    (async () => {
      await sleep(2);
      const totalNew = await new Promise<any>((res) => {
        return res(dashboardTotalStats);
      });
      setTotal(totalNew);
      setInfo(dashboardInfo);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Seo />
      <TotalSection items={total} />
      <InfoSection loading={loading} info={info} />
      <AssetSection />
    </>
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps((store) => async ({ locale }) => {
  const ns = 'dashboard';
  await store.dispatch(setPageI18nNamespace(ns));

  return {
    props: {
      protected: true,
      ...(await serverSideTranslations(locale, ['common', ns])),
    },
  };
});

export default DashboardPage;
