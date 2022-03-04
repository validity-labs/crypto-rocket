import React from 'react';

import ScrollUp from './ScrollUp';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

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
