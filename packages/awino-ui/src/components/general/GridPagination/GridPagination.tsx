// source https://github.com/mui/mui-x/blob/master/packages/grid/x-data-grid/src/components/GridPagination.tsx
import * as React from 'react';

import { useTranslation } from 'next-i18next';

import { LabelDisplayedRowsArgs } from '@mui/material';
import { styled } from '@mui/material/styles';
import TablePagination, { tablePaginationClasses, TablePaginationProps } from '@mui/material/TablePagination';
import { gridPaginationSelector, useGridApiContext, useGridRootProps, useGridSelector } from '@mui/x-data-grid';

import TablePaginationActions from './TablePaginationActions/TablePaginationActions';

const GridPaginationRoot = styled(TablePagination)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [`& .${tablePaginationClasses.selectLabel}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  [`& .${tablePaginationClasses.input}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex',
    },
  },
}));

const GridPagination = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function GridPagination(
  props,
  ref
) {
  const { t } = useTranslation();
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);

  const lastPage = React.useMemo(
    () => Math.floor(paginationState.rowCount / (paginationState.pageSize || 1)),
    [paginationState.rowCount, paginationState.pageSize]
  );

  const handlePageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      apiRef.current.setPageSize(newPageSize);
    },
    [apiRef]
  );

  const handlePageChange = React.useCallback<TablePaginationProps['onPageChange']>(
    (event, page) => {
      apiRef.current.setPage(page);
    },
    [apiRef]
  );

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingPageSizeInRowsPerPageOptions = React.useRef(false);
    if (
      !warnedOnceMissingPageSizeInRowsPerPageOptions.current &&
      !rootProps.autoPageSize &&
      !rootProps.rowsPerPageOptions.includes(rootProps.pageSize ?? paginationState.pageSize)
    ) {
      console.warn(
        [
          `MUI: The page size \`${
            rootProps.pageSize ?? paginationState.pageSize
          }\` is not preset in the \`rowsPerPageOptions\``,
          `Add it to show the pagination select.`,
        ].join('\n')
      );

      warnedOnceMissingPageSizeInRowsPerPageOptions.current = true;
    }
  }

  return (
    <GridPaginationRoot
      ref={ref}
      // @ts-ignore
      component="div"
      count={paginationState.rowCount}
      page={paginationState.page <= lastPage ? paginationState.page : lastPage}
      rowsPerPageOptions={
        rootProps.rowsPerPageOptions?.includes(paginationState.pageSize) ? rootProps.rowsPerPageOptions : []
      }
      rowsPerPage={paginationState.pageSize}
      labelRowsPerPage={t('common.table.rows-per-page')}
      labelDisplayedRows={(paginationInfo: LabelDisplayedRowsArgs) => t('common.table.rows-out-of', paginationInfo)}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange}
      {...apiRef.current.getLocaleText('MuiTablePagination')}
      {...props}
      ActionsComponent={TablePaginationActions}
    />
  );
});

export default GridPagination;
