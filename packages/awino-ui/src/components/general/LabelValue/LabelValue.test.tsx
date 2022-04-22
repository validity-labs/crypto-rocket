import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import LabelValue from './LabelValue';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<LabelValue />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <LabelValue
        id="labelValue"
        value={'5.99'}
        labelProps={{
          children: 'Text',
          tooltip: 'Tooltip',
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
