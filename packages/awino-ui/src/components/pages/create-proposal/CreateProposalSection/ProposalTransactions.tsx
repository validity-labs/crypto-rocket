import { fromWei } from 'web3-utils';

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';
import { buildEtherscanAddressLink } from '@/lib/etherscan';

import { ProposalTransaction } from './CreateProposalSection';

interface TransactionDetailsProps {
  item: ProposalTransaction;
  className?: string;
}
const TransactionDetails = styled(({ item, className }: TransactionDetailsProps) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction' });
  const { address, value, signature, calldata } = item;
  const none = t('none');
  return (
    <TableContainer className={className}>
      <Table
        size="small"
        aria-label={t('details.aria-label')}
        sx={{ backgroundColor: 'transparent', '& td, & th': { border: 0 } }}
      >
        <TableBody>
          <TableRow>
            <TableCell variant="head" component="th" scope="row">
              {t('details.address')}
            </TableCell>
            <TableCell>
              <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
                {address}
              </a>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" component="th" scope="row">
              {t('details.value')}
            </TableCell>
            <TableCell>{value ? `${fromWei(value)} ETH` : none}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" component="th" scope="row">
              {t('details.function')}
            </TableCell>
            <TableCell>{signature || none}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" component="th" scope="row">
              {t('details.calldata')}
            </TableCell>
            <TableCell>{calldata === '0x' ? none : calldata}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
})(({ theme }) => ({
  '& .MuiTableCell-head ': {
    color: theme.palette.text.primary,
    background: 'none',
  },
  '.MuiTableBody-root .MuiTableRow-root:last-of-type': {
    borderTop: '0 !important',
  },
}));

const ProposalTransactions = ({
  proposalTransactions,
  onAdd,
  onRemoveProposalTransaction,
}: {
  proposalTransactions: ProposalTransaction[];
  onRemoveProposalTransaction: (index: number) => void;
  onAdd: () => void;
}) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction' });

  const hasTransactions = proposalTransactions?.length > 0;
  return (
    <>
      <Typography component="h2" color="text.secondary" mb={6}>
        {t('title')}
      </Typography>
      <Box className="Awi-row Awi-between" sx={{ gap: 9, alignItems: 'center', mb: 10 }}>
        <Box sx={{ flex: 1 }}>
          {!hasTransactions && (
            <Alert severity="info" sx={{ width: '100%' }}>
              {t('not-found')}
            </Alert>
          )}
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onAdd}
          endIcon={<AddCircleOutlineRoundedIcon fontSize="large" />}
        >
          {t('add-transaction')}
        </Button>
      </Box>
      {hasTransactions && (
        <Table>
          <TableBody>
            {proposalTransactions.map((tx, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <Chip variant="outlined" label={`# ${i + 1}`} color="default" size="small" />
                  </TableCell>
                  <TableCell width={'100%'}>
                    <Typography color="text.primary">{tx.signature || 'transfer()'}</Typography>
                  </TableCell>
                  <TableCell>
                    <div className="Awi-row">
                      <Tooltip title={<TransactionDetails item={tx} />} arrow>
                        <IconButton color="info">
                          <InfoOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        color="error"
                        onClick={() => onRemoveProposalTransaction(i)}
                        title={t('remove-transaction')}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </>
  );
};
export default ProposalTransactions;
