import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TitleSection from './TitleSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TitleSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<TitleSection asset="dai" />, {}, 'market-details');
    expect(asFragment()).toMatchSnapshot();
  });
});
