import React from 'react';

import BigNumber from 'bignumber.js';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import AssetAmount from './AssetAmount';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<AssetAmount />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <AssetAmount asset="ftm" value={new BigNumber(1234567.89)} altAsset="usd" altValue={new BigNumber(9876543.21)} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
