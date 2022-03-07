import React from 'react';

import { DataGrid } from '@mui/x-data-grid';

import { loadDataSync } from '@/app/data';
import getColumns from '@/components/pages/market/AssetSection/columns';
import nextUseRouterMock from '@/mocks/nextUseRouterMock';
import { cleanup, render } from '@/testing/utils';

import GridPagination from './GridPagination';

beforeAll(() => {
  nextUseRouterMock({
    route: '/',
    pathname: '/',
    query: '',
    asPath: '',
  });
});

afterEach(cleanup);

describe('<GridPagination />', () => {
  it('has valid snapshot', () => {
    const data = loadDataSync('market', { page: 1, pageSize: 10, sort: [] });
    const { asFragment } = render(
      <DataGrid
        columns={getColumns((k: string) => k)}
        rows={data.records}
        rowCount={data.total}
        components={{ Pagination: GridPagination }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
