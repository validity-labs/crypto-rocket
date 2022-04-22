import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Link from './Link';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Link />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Link href="/" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
