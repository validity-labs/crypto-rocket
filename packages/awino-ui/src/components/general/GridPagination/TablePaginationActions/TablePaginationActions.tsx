import * as React from 'react';

// import FirstPageIcon from '@mui/icons-material/FirstPage';
import { useTranslation } from 'next-i18next';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const Root = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  marginLeft: theme.spacing(2.5),
  '.MuiIconButton-root': {
    color: theme.palette.text.active,
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
    '.MuiSvgIcon-root': {
      border: `1px solid currentColor`,
      borderRadius: '100%',
      fontSize: '20px',
      color: 'inherit',
    },
  },
}));

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export default function TablePaginationActions(props: TablePaginationActionsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  // const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   onPageChange(event, 0);
  // };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  // const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  // };

  return (
    <Root>
      {/* <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        title={t('common.table.first-page')}
        aria-label={t('common.table.first-page')}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton> */}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        title={t('common.table.previous-page')}
        aria-label={t('common.table.previous-page')}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        title={t('common.table.next-page')}
        aria-label={t('common.table.next-page')}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
      </IconButton>
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        title={t('common.table.last-page')}
        aria-label={t('common.table.last-page')}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton> */}
    </Root>
  );
}
