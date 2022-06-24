import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import AssetIcons from './AssetIcons';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<AssetIcons />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<AssetIcons ids={['awi', 'usdt']} size="small" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
