import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Card from './Card';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Card />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Card>Text</Card>);
    expect(asFragment()).toMatchSnapshot();
  });
});
