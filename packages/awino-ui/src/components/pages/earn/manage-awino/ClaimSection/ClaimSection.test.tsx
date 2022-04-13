import React from 'react';

import { earnManageAwinoClaim } from '@/fixtures/earn';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ClaimSection from './ClaimSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ClaimSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ClaimSection data={earnManageAwinoClaim} />, {}, 'earn-manage-awino');
    expect(asFragment()).toMatchSnapshot();
  });
});
