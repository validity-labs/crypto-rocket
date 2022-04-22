import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Label from './Label';

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
    const { asFragment } = render(<Label tooltip="Hint">Text</Label>);
    expect(asFragment()).toMatchSnapshot();
  });
});
