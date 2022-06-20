import React from 'react';

import { governanceProposals } from '@/fixtures/governance';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TitleSection from './TitleSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TitleSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <TitleSection loading={false} proposal={governanceProposals[0]} />,
      {},
      'governance-details'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
