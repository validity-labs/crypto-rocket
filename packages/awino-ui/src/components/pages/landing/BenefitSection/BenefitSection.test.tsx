import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BenefitSection from './BenefitSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<BenefitSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<BenefitSection />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
