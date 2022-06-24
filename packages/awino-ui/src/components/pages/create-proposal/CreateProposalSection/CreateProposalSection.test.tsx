import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import CreateProposalSection from './CreateProposalSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<CreateProposalSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<CreateProposalSection />, {}, 'governance');
    expect(asFragment()).toMatchSnapshot();
  });
});
