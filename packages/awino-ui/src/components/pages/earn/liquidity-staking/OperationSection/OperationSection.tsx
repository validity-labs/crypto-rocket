import React from 'react';

import { Grid } from '@mui/material';

import Section from '@/components/layout/Section/Section';

import StakeCard from './StakeCard';
import UnstakeCard from './UnstakeCard';
import VestCard from './VestCard';

export interface LiquidityStakingOperationBalance {
  awi: string;
}
interface Props {
  balance: LiquidityStakingOperationBalance;
  stakedBalance?: LiquidityStakingOperationBalance;
  vestedBalance?: LiquidityStakingOperationBalance;
}

export default function wOperationSection({ balance, stakedBalance, vestedBalance }: Props) {
  return (
    <Section>
      <Grid container spacing={8}>
        <Grid item xs={12} md={8}>
          <StakeCard balance={balance.awi} />
        </Grid>
        <Grid item xs={12} md={4}>
          <UnstakeCard balance={stakedBalance?.awi} mb={8} />
          <VestCard balance={vestedBalance?.awi} />
        </Grid>
      </Grid>
    </Section>
  );
}
