import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import LoadingText from './LoadingText';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<LoadingText />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<LoadingText loading={true} text="Lorem"></LoadingText>);
    expect(asFragment()).toMatchSnapshot();
  });
});
