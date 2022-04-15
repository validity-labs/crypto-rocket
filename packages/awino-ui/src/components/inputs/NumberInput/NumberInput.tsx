import React from 'react';

import NumberFormat from 'react-number-format';

import { InputBase, InputBaseProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CustomProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (event: { target: { name: string; value: string } }) => void;
  // isAllowed?: (value: any) => boolean;
  name: string;
}

const NumberFormatCustom = React.forwardRef<NumberFormat<any>, CustomProps>(function NumberFormatCustom(props, ref) {
  const { onChange, /* isAllowed, */ ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      allowLeadingZeros
      onValueChange={(values) => {
        onChange({
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
  input: {
    minWidth: 60,
  },
}));

const NumberInput = (props: InputBaseProps) => {
  return <SourceInput {...props} inputComponent={NumberFormatCustom as any} />;
};

export default NumberInput;
