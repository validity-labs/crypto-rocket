import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Switch from './Switch';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Switch />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(<Switch checked={true} setChecked={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
