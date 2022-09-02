import React from 'react';

import { balanceGroupedList } from '@/fixtures/portfolio';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BalanceSection from './BalanceSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<BalanceSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<BalanceSection loading={false} items={balanceGroupedList} />, {}, 'contracts');
    expect(asFragment()).toMatchSnapshot();
  });
});
