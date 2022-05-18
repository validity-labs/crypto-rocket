import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ResultSection from './ResultSection';

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
    const { asFragment } = render(<ResultSection />, {}, 'earn-farms');
    expect(asFragment()).toMatchSnapshot();
  });
});
