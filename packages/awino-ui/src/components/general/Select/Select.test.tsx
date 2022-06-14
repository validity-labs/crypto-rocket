import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import Select, { SelectValueAndOptionDefault } from './Select';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<Select />', () => {
  it('has valid snapshot', () => {
    const items = new Map([
      ['1', { id: '1', label: 'First' }],
      ['2', { id: '2', label: 'Second' }],
    ]);
    const { asFragment } = render(
      <Select
        id="select"
        items={items}
        value="1"
        setValue={() => {}}
        ValueComponent={SelectValueAndOptionDefault}
        OptionComponent={SelectValueAndOptionDefault}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
