import React from 'react';

import { earnStakeAwinoStake, earnStakeAwinoStats } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { statsFormatters } from '@/pages/earn/stake-awino';
import { cleanup, render } from '@/testing/utils';

import OperationSection from './OperationSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<OperationSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <OperationSection
        statItems={earnStakeAwinoStats}
        stake={earnStakeAwinoStake}
        statFormatters={statsFormatters}
        updateBalance={() => {}}
      />,
      {},
      'earn-stake-awino'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
