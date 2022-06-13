import React from 'react';

import { earnLiquidityStakingDetails, earnLiquidityStakingStats } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import OperationSection from './OperationSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<OperationSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <OperationSection balance={{ awi: '99.99' }} stakedBalance={{ awi: '99.99' }} vestedBalance={{ awi: '0' }} />,
      {},
      'earn-liquidity-staking'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
