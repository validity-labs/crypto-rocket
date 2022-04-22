import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ScrollUp from './ScrollUp';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ScrollUp />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ScrollUp />);
    expect(asFragment()).toMatchSnapshot();
  });
});
