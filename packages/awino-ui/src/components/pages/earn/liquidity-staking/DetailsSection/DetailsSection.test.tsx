import React from 'react';

import { earnLiquidityStakingDetails, earnLiquidityStakingStats } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import DetailsSection from './DetailsSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<DetailsSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <DetailsSection loading={false} data={earnLiquidityStakingDetails} />,
      {},
      'earn-liquidity-staking'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
