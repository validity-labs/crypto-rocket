import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const SuccessBadge = styled((props: BoxProps) => (
  <Box {...props}>
    <CheckRoundedIcon />
  </Box>
))(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  height: 80,
  marginBottom: theme.spacing(8.5),
  borderRadius: '100%',
  svg: {
    fontSize: '2.125rem' /* 34px */,
    color: theme.palette.common.white,
  },
  backgroundColor: theme.palette.success.main,
}));

export default SuccessBadge;
