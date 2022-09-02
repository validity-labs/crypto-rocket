import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import IntroSection from './IntroSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<IntroSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<IntroSection />, {}, 'earn-stake-awino');
    expect(asFragment()).toMatchSnapshot();
  });
});
