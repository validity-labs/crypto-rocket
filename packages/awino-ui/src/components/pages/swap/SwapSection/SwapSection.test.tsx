import React from 'react';

// import { assetSectionData } from '@/fixtures/market';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import SwapSection from './SwapSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<SwapSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<SwapSection />, {}, 'swap');
    expect(asFragment()).toMatchSnapshot();
  });
});
