import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import APRBadge from './APRBadge';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<APRBadge />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<APRBadge value={0.99} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
