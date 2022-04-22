import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Section from './Section';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Section />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <Section>
        <></>
      </Section>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
