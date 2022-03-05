import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import GuideSection from './GuideSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<GuideSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<GuideSection />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
