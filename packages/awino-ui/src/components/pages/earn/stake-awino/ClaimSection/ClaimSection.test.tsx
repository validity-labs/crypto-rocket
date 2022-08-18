import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ClaimSection from './ClaimSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ClaimSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ClaimSection />, {}, 'earn-stake-awino');
    expect(asFragment()).toMatchSnapshot();
  });
});
