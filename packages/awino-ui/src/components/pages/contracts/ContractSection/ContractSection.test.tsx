import React from 'react';

import { contractGroupedList } from '@/fixtures/contracts';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ContractSection from './ContractSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ContractSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ContractSection items={contractGroupedList} />, {}, 'contracts');
    expect(asFragment()).toMatchSnapshot();
  });
});
