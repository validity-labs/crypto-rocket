import React from 'react';

import NumberFormat from 'react-number-format';

import { InputBase, InputBaseProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CustomProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (event: { info: { source: string }; target: { name: string; value: string } }) => void;
  // isAllowed?: (value: any) => boolean;
  name: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormat<any>, CustomProps>(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, /* isAllowed, */ ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      allowLeadingZeros
      onValueChange={(values, sourceInfo) => {
        onChange({
          info: sourceInfo,
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      // isAllowed={isAllowed}
      thousandSeparator
      isNumericString
    />
  );
});

const SourceInput = styled(InputBase)(({ theme }) => ({
  padding: theme.spacing(3, 3.5, 3, 7),
  borderRadius: +theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.transparent,
  '&.Mui-error': {
    boxShadow: `0px 0 3px 1px ${theme.palette.error.main}`,
  },
  input: {
    minWidth: 60,
  },
}));

const NumberInput = (props: InputBaseProps) => {
  return <SourceInput {...props} inputComponent={NumberFormatCustom as any} />;
};

export default NumberInput;
