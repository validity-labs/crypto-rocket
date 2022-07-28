import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import { AssetKey } from '@/types/app';

import BoastFarmCard from './BoastFarmCard';
import GenerateCard from './GenerateCard';
import GlobalVotesCard from './GlobalVotesCard';
import NextDistributionCard from './NextDistributionCard';
import StatsCard from './StatsCard';

const Root = styled(Section)(({ theme }) => ({
  '.AwiDetailsSection-cardTitle': {
    marginBottom: theme.spacing(8),
    fontWeight: 600,
    color: 'inherit',
  },
  '.AwiLabelValue-root': {
    padding: theme.spacing(4.5, 5),
  },
  '.AwiLabelValue-label': {
    margin: theme.spacing(0, 4, 0, 0),
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
  '.AwiLabelValue-value': {
    flex: 'auto',
    ...theme.typography['body-md'],
    fontWeight: 400,
    color: theme.palette.text.active,
    textAlign: 'right',
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiLabelValue-root': {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
}));

export interface GlobalVoteItem {
  pair: [AssetKey, AssetKey];
  votes: number;
  percent: number;
}

export interface InfiniteDetailsData {
  nextDistributionBlockDate: Date;
  awinoBalance: number;
  stats: {
    totalAWILocked: number;
    totalAWILockedValue: number;
    averageUnlockTime: number;
    nextDistribution: Date | null;
    distribution: number;
    distributionValue: number;
    awiPerInfinity: number;
    apr: number;
    claimAmount: number;
  };
  globalVotes: GlobalVoteItem[];
}

interface Props {
  data: InfiniteDetailsData;
  loading: boolean;
}

export default function DetailsSection({ data, loading }: Props) {
  return (
    <Root>
      <Grid container spacing={12}>
        <Grid item xs={12} lg={6}>
          <GenerateCard awinoBalance={data.awinoBalance} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <GlobalVotesCard items={data.globalVotes} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <StatsCard data={data.stats} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <BoastFarmCard items={data.globalVotes} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <NextDistributionCard endDate={data.nextDistributionBlockDate} />
        </Grid>
      </Grid>
    </Root>
  );
}
