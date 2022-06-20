import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Tab, Tabs as MuiTabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import { setPageI18nNamespace } from '@/app/state/slices/app';
import storeWrapper from '@/app/store';
import Section from '@/components/layout/Section/Section';
import Seo from '@/components/layout/Seo/Seo';
import AssetSection from '@/components/pages/portfolio/AssetSection/AssetSection';
import BalanceSection from '@/components/pages/portfolio/BalanceSection/BalanceSection';
import InfoSection, { DashboardInfoData } from '@/components/pages/portfolio/InfoSection/InfoSection';
import TotalSection from '@/components/pages/portfolio/TotalSection/TotalSection';
import { balanceGroupedList, dashboardInfo, dashboardTotalStats } from '@/fixtures/portfolio';
import usePageTranslation from '@/hooks/usePageTranslation';
import { sleep, tabA11yProps } from '@/lib/helpers';
import { BalanceGrouped } from '@/types/app';
import { StatsData } from '@/types/app';

export const Tabs = styled(MuiTabs)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 0, 9),
  borderBottom: `2px solid #3B414E`,
  '& .MuiTabs-flexContainer': {
    gap: theme.spacing(5.5),
  },
  '& .MuiTab-root': {
    ...theme.typography['body-md'],
    color: theme.palette.text.primary,
    textTransform: 'none',
    '&.Mui-selected': {
      color: theme.palette.text.active,
    },
    '&:hover, &.Mui-focusVisible': {
      color: theme.palette.text.active,
    },
  },
}));

const id = 'portfolioPage';

const PortfolioPage: NextPage = () => {
  const t = usePageTranslation();
  const [tab, setTab] = React.useState(0);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BalanceGrouped>({ tokens: [], stableCoins: [], pool: [] });
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
      const itemsNew = await new Promise<any>((res) => {
        return res(balanceGroupedList);
      });
      setItems(itemsNew);

      const totalNew = await new Promise<any>((res) => {
        return res(dashboardTotalStats);
      });
      setTotal(totalNew);
      setInfo(dashboardInfo);

      setLoading(false);
    })();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      <Seo />
      <Section>
        <Tabs value={tab} onChange={handleTabChange} aria-label={t('common.tabs-aria')} variant="scrollable">
          <Tab label={t('common.portfolio')} {...tabA11yProps(id, 0)} />
          <Tab label={t('common.charts-view')} {...tabA11yProps(id, 1)} />
        </Tabs>
        <div role="tabpanel" hidden={tab !== 0} id={`tabpanel-${id}-${0}`} aria-labelledby={`tab-${id}-${0}`}>
          <TotalSection items={total} />
          <InfoSection loading={loading} info={info} />
          <AssetSection />
        </div>
        <div role="tabpanel" hidden={tab !== 1} id={`tabpanel-${id}-${1}`} aria-labelledby={`tab-${id}-${1}`}>
          <BalanceSection loading={loading} items={items} />
        </div>
      </Section>
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
