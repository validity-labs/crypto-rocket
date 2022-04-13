import React from 'react';

import { earnLiquidityStakingStats } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BriefSection from './BriefSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<BriefSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<BriefSection items={earnLiquidityStakingStats} />, {}, 'earn-liquidity-staking');
    expect(asFragment()).toMatchSnapshot();
  });
});
