import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import EmptyResult from './EmptyResult';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<EmptyResult />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<EmptyResult />);
    expect(asFragment()).toMatchSnapshot();
  });
});
