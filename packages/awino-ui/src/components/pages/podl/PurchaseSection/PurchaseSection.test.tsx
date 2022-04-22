import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import PurchaseSection from './PurchaseSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<PurchaseSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<PurchaseSection />, {}, 'podl');
    expect(asFragment()).toMatchSnapshot();
  });
});
