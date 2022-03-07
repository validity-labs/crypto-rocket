import React from 'react';

import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import TablePaginationActions from './TablePaginationActions';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<TablePaginationActions />', () => {
  it('has valid snapshot', () => {
    const { asFragment } = render(
      <TablePaginationActions page={1} rowsPerPage={5} count={21} onPageChange={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
