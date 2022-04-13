import { Grid } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import StatsItems from '@/components/pages/shared/FormattedStatsItems/StatsItems';
import { StatsData, StatsFormatter } from '@/types/app';

import LockCard, { LockData } from './LockCard';
import StakeCard, { StakeData } from './StakeCard';

interface Props {
  statItems: StatsData;
  statFormatters: StatsFormatter[];
  stake: StakeData;
  lock: LockData;
}

const gridItemProps = {
  lg: 6,
};
export default function OperationSection({ statItems, statFormatters, stake, lock }: Props) {
  return (
    <Section>
      <Grid container columns={10} spacing={8}>
        <Grid item xs={10} md={4}>
          <StatsItems items={statItems} formatters={statFormatters} gridItemProps={gridItemProps} />
        </Grid>
        <Grid item xs={10} md={3}>
          <StakeCard data={stake} />
        </Grid>
        <Grid item xs={10} md={3}>
          <LockCard data={lock} />
        </Grid>
      </Grid>
    </Section>
  );
}
