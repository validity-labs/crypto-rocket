import { styled } from '@mui/material/styles';

const Card = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: +theme.shape.borderRadius * 6,
  boxShadow: '0px 3px 6px #00000029',
  padding: theme.spacing(10, 6),
  backgroundColor: '#082938', // #12191F',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: +theme.shape.borderRadius * 6,
    background: ['rgb(0,255,235)', 'linear-gradient(120deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 50%)'],
    zIndex: -1,
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 11),
  },
}));

export default Card;
