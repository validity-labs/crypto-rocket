import clsx from 'clsx';

import { Tooltip, Typography, TypographyProps, TypographyTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import InfoIcon from '@/components/icons/InfoIcon';

export interface LabelProps extends Partial<TypographyProps> {
  tooltip?: string;
  className?: string;
}

const Label = styled(({ children, tooltip, className, ...restOfProps }: LabelProps) => {
  return (
    <Typography variant="h7" className={clsx('AwiLabel-root', className)} {...restOfProps}>
      {children}
      {tooltip && (
        <Tooltip title={tooltip} placement="right">
          <span className="AwiLabel-help">
            <InfoIcon />
          </span>
        </Tooltip>
      )}
    </Typography>
  );
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // ...theme.typography.h7,
  color: theme.palette.text.primary,
  '.AwiLabel-help': {
    // display: 'inline-block',
    lineHeight: 0,
    cursor: 'help',
    svg: {
      marginLeft: theme.spacing(2),
      fontSize: '20px',
      color: '#03e2e2',
    },
  },
}));

export default Label as OverridableComponent<TypographyTypeMap<LabelProps, 'span'>>;
