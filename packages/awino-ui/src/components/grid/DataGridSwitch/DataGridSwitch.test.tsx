import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import DataGridSwitch from './DataGridSwitch';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<DataGridSwitch />', () => {
  it('has valid snapshot', () => {
    const fn = jest.fn();
    const { asFragment } = render(<DataGridSwitch value={true} callback={fn} />, {}, 'earn-deposit');
    expect(asFragment()).toMatchSnapshot();
  });
});
