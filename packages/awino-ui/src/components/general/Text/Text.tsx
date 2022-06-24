import clsx from 'clsx';

import { Typography, TypographyProps, TypographyTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

export interface TextProps extends Partial<TypographyProps> {
  value: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

const Text = styled(({ value, highlighted, className, ...restOfProps }: TextProps) => {
  return (
    <Typography className={clsx('AwiText-root', { 'AwiText-highlighted': highlighted }, className)} {...restOfProps}>
      {value}
    </Typography>
  );
})(({ theme }) => ({
  '&.AwiText-highlighted': {
    display: 'inline-block',
    padding: theme.spacing(2, 5, 1),
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: '#092937',
    color: theme.palette.text.active,
  },
}));

export default Text as OverridableComponent<TypographyTypeMap<TextProps, 'span'>>;
