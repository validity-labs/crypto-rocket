import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ConnectPanel from './ConnectPanel';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ConnectPanel />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ConnectPanel />);
    expect(asFragment()).toMatchSnapshot();
  });
});
