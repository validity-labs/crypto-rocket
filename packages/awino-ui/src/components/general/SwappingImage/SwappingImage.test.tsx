import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import SwappingImage from './SwappingImage';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<SwappingImage />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<SwappingImage source="awi" target="cro" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
