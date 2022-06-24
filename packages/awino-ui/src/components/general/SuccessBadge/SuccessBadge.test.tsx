import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import SuccessBadge from './SuccessBadge';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<SuccessBadge />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<SuccessBadge />);
    expect(asFragment()).toMatchSnapshot();
  });
});
