import React from 'react';

import { marketInfo } from '@/fixtures/market';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import DetailSection from './DetailSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<DetailSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<DetailSection asset="DAI" info={marketInfo} />, {}, 'market-details');
    expect(asFragment()).toMatchSnapshot();
  });
});
