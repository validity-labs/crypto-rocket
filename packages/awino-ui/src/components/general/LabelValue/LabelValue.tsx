import React from 'react';

import { Box, BoxProps, BoxTypeMap, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import Label, { LabelProps } from '../Label/Label';

interface Props extends Partial<BoxProps> {
  id: string;
  value: React.ReactNode;
  labelProps: LabelProps;
}

const LabelValue = styled(({ id, value, labelProps, ...restOfProps }: Props) => {
  const { children, ...restOfLabelProps } = labelProps;
  return (
    <Box {...restOfProps}>
      <Label id={id} className="AwiLabelValue-label label" {...restOfLabelProps}>
        {children}
      </Label>
      <Typography variant="h5" component="p" className="AwiLabelValue-value value" aria-describedby={id}>
        {value}
      </Typography>
    </Box>
  );
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  '.label': {
    margin: theme.spacing(0, 0, 4.5),
    overflow: 'auto',
  },
  '.value': {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    // flexWrap: 'wrap',
    '.label': {
      margin: theme.spacing(0, 6.5, 0, 0),
    },
  },
}));

export default LabelValue as OverridableComponent<BoxTypeMap<Props, 'span'>>;
