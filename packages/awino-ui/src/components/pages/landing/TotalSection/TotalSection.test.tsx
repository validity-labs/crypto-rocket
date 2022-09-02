import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';
import { StatsData } from '@/types/app';

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
    const statsSectionData: StatsData = [{ value: 89.7 }, { value: 89.7 }, { value: 0.27 }];

    const { asFragment } = render(<TotalSection items={statsSectionData} />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
