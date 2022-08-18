import { useMemo } from 'react';

import { Grid, GridProps } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import StatsItems from '@/components/pages/shared/StatsItems/StatsItems';
import { StatsData, StatsFormatter } from '@/types/app';

import StakeCard, { StakeData } from './StakeCard';

interface Props {
  statItems: StatsData;
  statFormatters: StatsFormatter[];
  stake: StakeData;
  updateBalance: (account: string, library: any) => void;
}

const gridItemPropsCallbackCreator =
  (count: number) =>
  (index: number): GridProps => {
    // if (count - 1 === index) {
    //   return {
    //     sm: 12,
    //     lg: 12,
    //     className: 'Awi-last',
    //   };
    // }
    return {
      lg: 4,
    };
  };

export default function OperationSection({ statItems, statFormatters, stake, updateBalance }: Props) {
  const gridItemPropsCallback = useMemo(() => gridItemPropsCallbackCreator(statItems.length), [statItems]);
  return (
    <Section>
      <Grid container spacing={8} justifyContent="center">
        <Grid item xs={10} md={8}>
          <StatsItems
            items={statItems}
            formatters={statFormatters}
            gridItemProps={gridItemPropsCallback}
            sx={{ '.AwiStatsCard-root': { maxWidth: { sm: '100%', minHeight: 175 } } }}
          />
        </Grid>
        <Grid item xs={10} md={4}>
          <StakeCard data={stake} updateBalance={updateBalance} />
        </Grid>
      </Grid>
    </Section>
  );
}
