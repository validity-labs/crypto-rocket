import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Seo from './Seo';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Seo />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Seo />);
    expect(asFragment()).toMatchSnapshot();
  });
});
