import { useMemo } from 'react';

import { Grid, GridProps } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import StatsItems from '@/components/pages/shared/StatsItems/StatsItems';
import { StatsData, StatsFormatter } from '@/types/app';

import LockCard, { LockData } from './LockCard';
import StakeCard, { StakeData } from './StakeCard';

interface Props {
  statItems: StatsData;
  statFormatters: StatsFormatter[];
  stake: StakeData;
  lock: LockData;
}

const gridItemPropsCallbackCreator =
  (count: number) =>
  (index: number): GridProps => {
    if (count - 1 === index) {
      return {
        sm: 12,
        lg: 12,
        className: 'Awi-last',
      };
    }
    return {
      lg: 6,
    };
  };

export default function OperationSection({ statItems, statFormatters, stake, lock }: Props) {
  const gridItemPropsCallback = useMemo(() => gridItemPropsCallbackCreator(statItems.length), [statItems]);
  return (
    <Section>
      <Grid container columns={10} spacing={8}>
        <Grid item xs={10} md={4}>
          <StatsItems
            items={statItems}
            formatters={statFormatters}
            gridItemProps={gridItemPropsCallback}
            sx={{ '.Awi-last .AwiStatsCard-root': { maxWidth: { sm: '100%' } } }}
          />
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
