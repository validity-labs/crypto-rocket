import React from 'react';

import { statsSectionData } from '@/fixtures/landing';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
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
    const { asFragment } = render(<StatsSection items={statsSectionData} />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
