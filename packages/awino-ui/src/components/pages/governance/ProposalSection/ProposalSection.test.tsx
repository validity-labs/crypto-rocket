import React from 'react';

import { dashboardInfo } from '@/fixtures/dashboard';
import { governanceInfo } from '@/fixtures/governance';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ProposalSection from './ProposalSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ProposalSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ProposalSection />, {}, 'governance');
    expect(asFragment()).toMatchSnapshot();
  });
});
