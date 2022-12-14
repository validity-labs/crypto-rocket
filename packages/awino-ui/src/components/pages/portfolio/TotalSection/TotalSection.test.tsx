import React from 'react';

import { dashboardTotalStats } from '@/fixtures/portfolio';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TotalSection from './TotalSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TotalSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<TotalSection items={dashboardTotalStats} />, {}, 'portfolio');
    expect(asFragment()).toMatchSnapshot();
  });
});
