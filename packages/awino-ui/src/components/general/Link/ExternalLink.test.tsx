import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import ExternalLink from './ExternalLink';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<ExternalLink />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<ExternalLink href="/" text="Lorem Ipsum" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
