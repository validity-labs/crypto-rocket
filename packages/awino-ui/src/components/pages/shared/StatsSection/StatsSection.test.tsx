import React from 'react';

import { earnStakeAwinoStats } from '@/fixtures/earn';
import { statsSectionData } from '@/fixtures/landing';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { statsFormatters } from '@/pages/earn/stake-awino';
import { cleanup, render } from '@/testing/utils';

import StatsSection from './StatsSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<StatsSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <StatsSection items={earnStakeAwinoStats} formatters={statsFormatters} />,
      {},
      'landing'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
