import React from 'react';

import { balanceGroupedList } from '@/fixtures/portfolio';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BalanceCard from './BalanceCard';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<BalanceCard />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<BalanceCard item={balanceGroupedList.tokens[0]} />, {}, 'contracts');
    expect(asFragment()).toMatchSnapshot();
  });
});
