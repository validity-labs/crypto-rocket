import React from 'react';

import { earnManageAwinoStats } from '@/fixtures/earn';
import { statsSectionData } from '@/fixtures/landing';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { statsFormatters } from '@/pages/earn/manage-awino';
import { cleanup, render } from '@/testing/utils';

import StatsItems from './StatsItems';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<StatsItems />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <StatsItems items={earnManageAwinoStats} formatters={statsFormatters} />,
      {},
      'earn-manage-awino'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
