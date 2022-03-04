import React from 'react';

import Section from './Section';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

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
      </Section>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
