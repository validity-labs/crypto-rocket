import React, { useEffect, useState } from 'react';

import { Box, Tab, Tabs as MuiTabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import SwapIcon from '@/components/icons/SwapIcon';
import ZapIcon from '@/components/icons/ZapIcon';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { tabA11yProps } from '@/lib/helpers';

import SwapPanel from './SwapPanel';
import ZapPanel from './ZapPanel';

const Tabs = styled(MuiTabs)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(0, 0, 9),
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    minHeight: 'auto',
    padding: theme.spacing(5, 12),
    borderRadius: +theme.shape.borderRadius * 2,
    ...theme.typography.body,
    fontSize: '1rem' /* 16px */,
    color: theme.palette.text.primary,
    textTransform: 'none',
    '&.Mui-selected': {
      color: theme.palette.text.active,
      backgroundColor: theme.palette.background.transparent,
    },
    '.MuiSvgIcon-root': {
      fontSize: '26px',
      color: theme.palette.text.active,
    },
  },
}));

const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(5.5, 12, 12),
  borderRadius: +theme.shape.borderRadius * 6,
  backgroundColor: theme.palette.background.transparent,
  '.header': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(7),
    minHeight: 56,
    margin: theme.spacing(0, 0, 8.5, 0),
  },
  '.sub-panel': {
    position: 'relative',
    borderRadius: +theme.shape.borderRadius * 6,
    boxShadow: '0px 3px 6px #00000029',
    margin: theme.spacing(0, 0, 13),
    backgroundColor: '#12191F',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: -5,
      right: -5,
      bottom: -5,
      borderRadius: +theme.shape.borderRadius * 6,
      background: ['rgb(0,255,235)', 'linear-gradient(120deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 50%)'],
      zIndex: -1,
    },
  },
}));

const id = 'swapSection';

export default function SwapSection() {
  const t = usePageTranslation();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState(new Map());

  useEffect(() => {
    const fakeAssets = [
      { id: 'dai', label: 'DAI' },
      { id: 'usdt', label: 'USDT' },
      { id: 'usdc', label: 'USDC' },
      { id: 'eth', label: 'ETH' },
      { id: 'link', label: 'LINK' },
    ];

    setTimeout(() => {
      setAssets(new Map(fakeAssets.map((m) => [m.id, m])));
      setLoading(false);
    }, 2000);
  }, []);

  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Section>
      <Tabs value={tab} onChange={handleTabChange} aria-label={t('swap-section.tabs-aria')} variant="scrollable">
        <Tab label={t('swap-section.swap.title')} icon={<SwapIcon />} iconPosition="end" {...tabA11yProps(id, 0)} />
        <Tab label={t('swap-section.zap.title')} icon={<ZapIcon />} iconPosition="end" {...tabA11yProps(id, 1)} />
      </Tabs>
      <Panel>
        <SwapPanel id={id} value={tab} index={0} assets={assets} loading={loading} />
        <ZapPanel id={id} value={tab} index={1} assets={assets} loading={loading} />
      </Panel>
    </Section>
  );
}