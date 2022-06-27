import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridEventListener, GridEvents } from '@mui/x-data-grid';

import { TABLE_ROWS_PER_PAGE_OPTIONS } from '@/app/constants';
import DataGrid from '@/components/general/DataGrid/DataGrid';
import GridPagination from '@/components/general/GridPagination/GridPagination';
import Label from '@/components/general/Label/Label';
import Link from '@/components/general/Link/Link';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import { governanceProposals } from '@/fixtures/governance';
import usePageTranslation from '@/hooks/usePageTranslation';
import { useBlockNumber } from '@/hooks/web3/useBlockNumber';
import { sleep } from '@/lib/helpers';
import { ProposalItem } from '@/types/app';

import getColumns from './columns';

const Root = styled(Section)(({ theme }) => ({
  '.AwiDataGrid-container': {
    position: 'relative',
    height: 888 /* 66 * 10 + 12 * 10 - 12 */,
    width: '100%',
    '& .MuiDataGrid-columnHeaders': { display: 'none' },
    '& .MuiDataGrid-virtualScroller': { marginTop: '0!important' },
    '.MuiDataGrid-row': {
      cursor: 'pointer',
    },
  },
}));

interface Props {}

export default function ProposalSection({}: /* info, loading */ Props) {
  const t = usePageTranslation({ keyPrefix: 'proposal-section' });
  const router = useRouter();
  const currentBlock = useBlockNumber();

  // const { data } = useAllProposals();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ProposalItem[]>([]);

  useEffect(() => {
    (async () => {
      await sleep(2);
      setItems(governanceProposals);
      setLoading(false);
    })();
  }, []);

  const columns = useMemo(() => {
    return getColumns(t, { currentBlock });
  }, [t, currentBlock]);

  const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback(
    (props) => {
      router.push(`/governance/${props.row.id}`);
    },
    [router]
  );

  return (
    <Root>
      <Panel
        className="AwiInfoSection-panel"
        header={
          <>
            <Label component="h2" id="proposalSectionTitle">
              {t('title')}
            </Label>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              href="/governance/create-proposal"
              endIcon={<AddCircleOutlineRoundedIcon fontSize="large" />}
            >
              {t('create-proposal')}
            </Button>
          </>
        }
      >
        <div className="AwiDataGrid-container">
          <DataGrid
            loading={loading}
            columns={columns}
            disableColumnMenu
            disableColumnFilter
            disableSelectionOnClick
            disableColumnSelector
            rowHeight={66}
            rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
            // rows
            rows={items}
            rowCount={items.length}
            onRowClick={handleRowClick}
            // pagination
            paginationMode="client"
            components={{
              Pagination: GridPagination,
            }}
            componentsProps={{
              row: {
                className: 'Awi-selectable',
              },
            }}
          />
        </div>
      </Panel>
    </Root>
  );
}
