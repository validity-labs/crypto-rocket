import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Address from './Address';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Address />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Address address="0x0000000000000000000000000000000000000000" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
