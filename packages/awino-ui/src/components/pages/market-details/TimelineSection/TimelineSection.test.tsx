import React from 'react';

import { marketTypeInfo } from '@/fixtures/market';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TimelineSection from './TimelineSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TimelineSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <TimelineSection type="supply" setType={() => {}} info={marketTypeInfo} />,
      {},
      'market-details'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
