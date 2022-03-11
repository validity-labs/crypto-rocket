import { useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

import InfoPanel from './InfoPanel';

const Panel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: +theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.background.transparent,
  '.header': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(10),
    padding: theme.spacing(5.5, 6.5, 5),
    margin: theme.spacing(0, 0, 15, 0),
    borderRadius: +theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.background.transparent,
    '.aside': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  '.content': {
    padding: theme.spacing(4, 12.5, 10),
    '.table-container': {
      height: 888 /* 66 * 10 + 12 * 10 - 12 */,
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.header': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(18),
      padding: theme.spacing(5.5, 12.5, 5),
    },
  },
}));

// interface Props {
//   total: TotalAssetSize;
// }
export interface PodlPriceInfo {
  currentPrice: number;
  offeredPrice: number;
}
export default function AssetSection(/* { total }: Props */) {
  const t = usePageTranslation();
  // const router = useRouter();
  // // const { connected } = useAppSelector((state) => ({
  // //   connected: state.account.connected,
  // // }));
  // const [toggle, setToggle] = useState(false);
  // const [term, setTerm] = useState<string>('');
  // const columns = useMemo(() => {
  //   return getColumns(t);
  // }, [t]);
  // const [sortModel, setSortModel] = useState<GridSortModel>([
  //   /* { field: 'asset', sort: 'asc' } */
  // ]);
  // const [rows, setRows] = useState<GridRowsProp>([]);
  // const [rowCount, setRowCount] = useState<number | undefined>(undefined);
  // // Some api client return undefine while loading
  // // Following lines are here to prevent `rowCountState` from being undefined during the loading
  // const [rowCountState, setRowCountState] = useState(rowCount || 0);
  // useEffect(() => {
  //   setRowCountState((prevRowCountState) => (rowCount !== undefined ? rowCount : prevRowCountState));
  // }, [rowCount, setRowCountState]);

  // const [rowsState, setRowsState] = useState<RowsState>({
  //   page: 0,
  //   pageSize: TABLE_ROWS_PER_PAGE,
  // });

  // const [loading, setLoading] = useState<boolean>(false);

  // const handleSortModelChange = (newModel: GridSortModel) => {
  //   setSortModel(newModel);
  // };

  // useEffect(() => {
  //   let active = true;
  //   setLoading(true);
  //   setRowCount(undefined);
  //   (async () => {
  //     const { total, records } = await loadData('borrow', {
  //       page: rowsState.page,
  //       pageSize: rowsState.pageSize,
  //       sort: sortModel,
  //       term,
  //     });
  //     if (!active) {
  //       return;
  //     }
  //     setRows(records);
  //     setRowCount(total);
  //     setLoading(false);
  //   })();

  //   return () => {
  //     active = false;
  //   };
  // }, [sortModel, rowsState, term /* data */]);

  // const handleSearch = useCallback(
  //   (newTerm: string) => {
  //     if (term !== newTerm) {
  //       setTerm(newTerm);
  //       setRowsState((prevRowsState) => ({ ...prevRowsState, page: 1 }));
  //     }
  //   },
  //   [term]
  // );

  // const handleRowClick: GridEventListener<GridEvents.rowClick> = useCallback(
  //   (props) => {
  //     router.push(`/borrow/${props.row.asset}`);
  //   },
  //   [router]
  // );

  const info = useMemo<PodlPriceInfo>(
    () => ({
      currentPrice: 1.93,
      offeredPrice: 1.99,
    }),
    []
  );
  return (
    <Section>
      <Typography variant="h3" component="h1" mb={7}>
        {t('purchase-section.title')}
      </Typography>
      <Typography variant="body" color="text.primary" mb={16}>
        {t('purchase-section.description')}
      </Typography>
      <Grid container columnSpacing={9} rowSpacing={15}>
        <Grid item xs={12} md={8}>
          <Grid container rowSpacing={15}>
            <Grid item xs={12}>
              <InfoPanel data={info} />
            </Grid>
            <Grid item xs={12}>
              <Panel>
                <div className="header">
                  <Label id="purchaseTitle" className="label" tooltip={t(`purchase-section.purchase.title-hint`)}>
                    {t(`purchase-section.purchase.title`)}
                  </Label>
                </div>
                <div className="content"></div>
              </Panel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={15}>
            <Grid item xs={12}>
              <Panel>
                <div className="content">buyable</div>
              </Panel>
            </Grid>
            <Grid item xs={12}>
              <Panel>
                <div className="content">treasury</div>
              </Panel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Section>
  );
}
/*
<Panel>
  <div className="header"></div>
  <div className="content"></div>
</Panel>;
 */
