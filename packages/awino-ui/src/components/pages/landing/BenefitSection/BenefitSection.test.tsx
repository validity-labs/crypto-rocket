import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import BenefitSection from './BenefitSection';

// jest.mock('swiper', () => require('@/mocks/swiper'));
// jest.mock('swiper/react', () => require('@/mocks/swiper/react'));

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
  it.skip('has valid snapshot', () => {
    const { asFragment } = render(<BenefitSection />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
