import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import PlatformSection from './PlatformSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<PlatformSection />', () => {
  it('has valid snapshot', () => {
    const platformStats = {
      totalDeposit: 1232432,
      totalBorrow: 438403.33,
      globalHealthRatio: 1.38,
      totalPlatformFee: 3432332,
    };
    const { asFragment } = render(<PlatformSection stats={platformStats} />, {}, 'analytics');
    expect(asFragment()).toMatchSnapshot();
  });
});
