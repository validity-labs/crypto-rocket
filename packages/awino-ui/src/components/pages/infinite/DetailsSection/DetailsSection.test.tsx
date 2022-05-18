import React from 'react';

import { infiniteDetails } from '@/fixtures/infinite';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import DetailsSection from './DetailsSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<DetailsSection />', () => {
  it('has valid snapshot', () => {
    infiniteDetails.nextDistributionBlockDate = new Date(2000, 0, 13, 12, 30);
    infiniteDetails.stats.nextDistribution = new Date(2000, 0, 13, 12, 30);
    const { asFragment } = render(<DetailsSection loading={false} data={infiniteDetails} />, {}, 'infinite');
    expect(asFragment()).toMatchSnapshot();
  });
});
