import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import { CollateralInfo } from './AssetSection';
import CollateralModal, { CollateralModalData } from './CollateralModal';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<CollateralModal />', () => {
  it('has valid snapshot', () => {
    const collateralInfo: CollateralInfo = {
      borrowLimit: [1.03, 1.03],
      borrowLimitUsed: [0, 0],
    };
    const collateralData: CollateralModalData = {
      asset: 'dai',
      stage: 'enable',
    };
    const fn = jest.fn();
    const { asFragment } = render(
      <CollateralModal open={true} close={fn} info={collateralInfo} data={collateralData} callback={fn} />,
      {},
      'portfolio'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
