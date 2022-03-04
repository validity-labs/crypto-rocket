import React from 'react';

import { SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledIconDivider = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  '&:after': {
    flex: 1,
    content: '""',
    height: 1,
    marginLeft: theme.spacing(4),
    backgroundColor: theme.palette.divider,
  },
  svg: {
    color: theme.palette.divider,
  },
}));

interface IconDividerProps {
  icon: React.FC<SvgIconProps>;
}

const IconDivider = ({ icon: Icon }: IconDividerProps) => {
  return (
    <StyledIconDivider>
      <Icon />
    </StyledIconDivider>
  );
};

export default IconDivider;
