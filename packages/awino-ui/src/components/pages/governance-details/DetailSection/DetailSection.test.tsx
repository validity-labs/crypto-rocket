import React from 'react';

import { governanceProposals } from '@/fixtures/governance';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import DetailSection from './DetailSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<DetailSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <DetailSection loading={false} proposal={governanceProposals[0]} />,
      {},
      'governance-details'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
