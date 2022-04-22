import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import LoadingButton from './LoadingButton';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<LoadingButton />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<LoadingButton loading={true}>Lorem</LoadingButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});
