import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Panel from './Panel';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Panel />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Panel>Lorem ipsum</Panel>);
    expect(asFragment()).toMatchSnapshot();
  });
});
