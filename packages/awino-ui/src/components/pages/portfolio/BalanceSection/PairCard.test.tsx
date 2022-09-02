import React from 'react';

import { balanceGroupedList } from '@/fixtures/portfolio';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import PairCard from './PairCard';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<PairCard />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<PairCard item={balanceGroupedList.pool[0]} />, {}, 'portfolio');
    expect(asFragment()).toMatchSnapshot();
  });
});
