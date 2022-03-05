import React from 'react';

import Label from './Label';
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

describe('<Label />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Label href="/" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
