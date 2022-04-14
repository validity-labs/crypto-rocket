import React from 'react';

import { balanceGroupedList } from '@/fixtures/portfolio';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import PoolCard from './PoolCard';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<PoolCard />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<PoolCard item={balanceGroupedList.pool[0]} />, {}, 'portfolio');
    expect(asFragment()).toMatchSnapshot();
  });
});
