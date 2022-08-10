import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TeamSection from './TeamSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TeamSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<TeamSection />);
    expect(asFragment()).toMatchSnapshot();
  });
});
