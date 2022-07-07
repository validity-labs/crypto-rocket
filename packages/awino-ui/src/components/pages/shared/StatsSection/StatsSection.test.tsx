import React from 'react';

import { earnManageAwinoStats } from '@/fixtures/earn';
import { statsSectionData } from '@/fixtures/landing';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { statsFormatters } from '@/pages/earn/manage-awino';
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
      <StatsSection items={earnManageAwinoStats} formatters={statsFormatters} />,
      {},
      'landing'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
