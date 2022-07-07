import React from 'react';

import { earnManageAwinoLock, earnManageAwinoStake, earnManageAwinoStats } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { statsFormatters } from '@/pages/earn/manage-awino';
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
        statItems={earnManageAwinoStats}
        stake={earnManageAwinoStake}
        lock={earnManageAwinoLock}
        statFormatters={statsFormatters}
        // updateBalance={() => {}}
      />,
      {},
      'earn-manage-awino'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
