import React from 'react';

import { statsSectionData } from '@/fixtures/landing';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
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
    const { asFragment } = render(<StatsItems items={statsSectionData} />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
