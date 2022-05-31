import React from 'react';

import NumberFormat from 'react-number-format';

import { InputBase, InputBaseProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const Input = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(3, 3.5, 3, 7),
  borderRadius: +theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.transparent,
  input: {
    minWidth: 60,
  },
}));

export default Input;
