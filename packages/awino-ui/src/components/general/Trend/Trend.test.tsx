import React from 'react';

import BigNumber from 'bignumber.js';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Trend from './Trend';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Trend />', () => {
  it('has valid snapshot', () => {
    const formatter = (str: BigNumber) => str.toString();
    const { asFragment, rerender } = render(<Trend value={new BigNumber(0.03)} formatter={formatter} />);
    expect(asFragment()).toMatchSnapshot();
    rerender(<Trend value={new BigNumber(-0.03)} formatter={formatter} />);
    expect(asFragment()).toMatchSnapshot();
    rerender(<Trend value={new BigNumber(0)} formatter={formatter} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
