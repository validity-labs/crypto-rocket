import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Text from './Text';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Text />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Text highlighted value="Text" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
