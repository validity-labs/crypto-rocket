import BigNumber from 'bignumber.js';

import { Grid, Typography } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey } from '@/types/app';

import AvailablePanel from './AvailablePanel';
import InfoPanel from './InfoPanel';
import PurchasePanel from './PurchasePanel';
import TreasurePanel from './TreasurePanel';

export interface PodlPurchaseData {
  source: AssetKey;
  target: AssetKey;
  rate: BigNumber;
  oldRate: BigNumber;
  maxSource: BigNumber;
  maxSourceInUSD: BigNumber;
  get sourceLabel(): string;
  get targetLabel(): string;
}

const data: PodlPurchaseData = {
  source: 'ftm',
  target: 'geistftm',
  rate: new BigNumber(1.31),
  oldRate: new BigNumber(1.21),
  maxSource: new BigNumber(99.5),
  maxSourceInUSD: new BigNumber(199.5),
  get sourceLabel() {
    return this.source.toUpperCase();
  },
  get targetLabel() {
    return this.target.toUpperCase();
  },
};

const treasury = {
  amount: 1.31,
  totalShare: 3.39,
  inTreasury: {
    asset: 'geistftm',
    match: 'ftm',
    value: 83.4233,
    assetInUSD: 123.3,
  },
  breakdown: [
    {
      asset: 'geistftm',
      value: 83.4233,
      assetInUSD: 123.3,
    },
    {
      asset: 'ftm',
      value: 83.4233,
      assetInUSD: 123.3,
    },
  ],
  totalSold: {
    asset: 'ftm',
    value: 83.4233,
    assetInUSD: 123.3,
  },
};

export default function PurchaseSection() {
  const t = usePageTranslation();

  return (
    <Section>
      <Typography variant="h3" component="h1" mb={7}>
        {t('purchase-section.title')}
      </Typography>
      <Typography variant="body" color="text.primary" mb={16}>
        {t('purchase-section.description', { from: data.source.toUpperCase(), to: data.target.toUpperCase() })}
      </Typography>
      <Grid container columnSpacing={9} rowSpacing={15}>
        <Grid item xs={12} md={7}>
          <Grid container rowSpacing={15}>
            <Grid item xs={12}>
              <InfoPanel data={data} />
            </Grid>
            <Grid item xs={12}>
              <PurchasePanel data={data} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container rowSpacing={15}>
            <Grid item xs={12}>
              <AvailablePanel data={data} />
            </Grid>
            <Grid item xs={12}>
              <TreasurePanel data={data} treasury={treasury} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Section>
  );
}