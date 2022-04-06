/* original source - https://mui.com/components/switches/#customization */

import * as React from 'react';

// import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import MuiSwitch, { SwitchProps } from '@mui/material/Switch';

import { SetState } from '@/types/app';
export const PlainSwitch = styled((props: SwitchProps) => (
  <MuiSwitch focusVisibleClassName="Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 19,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    transitionDuration: '300ms',
    color: theme.palette.grey[500],
    '&.Mui-checked': {
      transform: 'translateX(19px)',
      color: '#03e2e2',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.background.transparent,
        opacity: 1,
        border: 0,
        // 03e2e2
      },
    },
    '&.Mui-focusVisible:not(.Mui-checked) .MuiSwitch-thumb': {
      color: '#03e2e2',
      border: `4px solid ${theme.palette.grey[500]}`,
    },
    '&.Mui-focusVisible + .MuiSwitch-track': {
      outline: `1px solid #03e2e2`,
      outlineOffset: '-1px',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.text.disabled,
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.8,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 19,
    height: 19,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: +theme.shape.borderRadius * 2.2,
    backgroundColor: theme.palette.background.transparent,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface Props extends SwitchProps {
  checked: boolean;
  setChecked: SetState<boolean>;
}
export default function Switch({ checked, setChecked, ...restOfProps }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    // <FormControlLabel
    //   control={
    <PlainSwitch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      {...restOfProps}
    />
    //   }
    //   label="iOS style"
    // />
  );
}
