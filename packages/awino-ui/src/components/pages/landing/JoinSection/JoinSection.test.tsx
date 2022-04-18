import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import JoinSection from './JoinSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<JoinSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<JoinSection />);
    expect(asFragment()).toMatchSnapshot();
  });
});
