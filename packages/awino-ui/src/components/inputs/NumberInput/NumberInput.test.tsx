import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import NumberInput from './NumberInput';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<NumberInput />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<NumberInput />);
    expect(asFragment()).toMatchSnapshot();
  });
});
