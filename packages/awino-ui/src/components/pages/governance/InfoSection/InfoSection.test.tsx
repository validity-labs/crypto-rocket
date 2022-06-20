import React from 'react';

import { governanceInfo } from '@/fixtures/governance';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import InfoSection from './InfoSection';

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
    const { asFragment } = render(<InfoSection loading={false} info={governanceInfo} />, {}, 'governance');
    expect(asFragment()).toMatchSnapshot();
  });
});
