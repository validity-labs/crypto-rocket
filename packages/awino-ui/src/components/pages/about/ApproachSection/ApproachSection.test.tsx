import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ApproachSection from './ApproachSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ApproachSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ApproachSection />);
    expect(asFragment()).toMatchSnapshot();
  });
});
