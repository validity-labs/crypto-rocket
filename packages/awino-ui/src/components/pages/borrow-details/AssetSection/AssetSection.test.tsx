import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import AssetSection from './AssetSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<AssetSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<AssetSection />, {}, 'borrow-details');
    expect(asFragment()).toMatchSnapshot();
  });
});
