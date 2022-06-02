import React from 'react';

import { dashboardInfo } from '@/fixtures/dashboard';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import InfoSection from './CreateProposalSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<InfoSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<InfoSection loading={false} info={dashboardInfo} />, {}, 'dashboard');
    expect(asFragment()).toMatchSnapshot();
  });
});
