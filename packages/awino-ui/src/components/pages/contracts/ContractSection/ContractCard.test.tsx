import React from 'react';

import { contractGroupedList } from '@/fixtures/contracts';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ContractCard from './ContractCard';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ContractCard />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ContractCard item={contractGroupedList.tokens[0]} />, {}, 'contracts');
    expect(asFragment()).toMatchSnapshot();
  });
});
