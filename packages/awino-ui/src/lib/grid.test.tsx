import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import { renderCellWithAPR } from './grid';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<renderCellWithAPR />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<>{renderCellWithAPR({ value: 5.99 })}</>, {}, 'landing');
    expect(asFragment()).toMatchSnapshot();
  });
});
