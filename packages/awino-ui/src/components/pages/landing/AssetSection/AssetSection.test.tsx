import React from 'react';

// import { aboutStats as aboutStatsRecord } from '@/fixtures/about';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import AssetSection from './AssetSection';

const stats = [
  { value: 89.7, subvalue: 24.72 },
  { value: 89.7, subvalue: 24.72 },
  { value: 0.27 },
  { value: 273.4, subvalue: 52 },
];

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<AssetSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<AssetSection items={stats} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
