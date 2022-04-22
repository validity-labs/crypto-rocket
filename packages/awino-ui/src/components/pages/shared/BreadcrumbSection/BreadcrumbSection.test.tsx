import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BreadcrumbSection from './BreadcrumbSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<BreadcrumbSection />', () => {
  it('has valid snapshot', () => {
    const items = [
      {
        key: 'market',
        url: '/market',
      },
    ];
    const { asFragment } = render(<BreadcrumbSection items={items} last="DAI" />, {}, 'market-details');
    expect(asFragment()).toMatchSnapshot();
  });
});
