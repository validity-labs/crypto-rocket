import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import FAQSection from './FAQSection';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<FAQSection />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<FAQSection />, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
