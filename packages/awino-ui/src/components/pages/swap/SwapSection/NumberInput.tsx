import React from 'react';

import NumberFormat from 'react-number-format';

import { InputBase, InputBaseProps } from '@mui/material';

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

const NumberInput = (props: InputBaseProps) => {
  return <InputBase {...props} inputComponent={NumberFormatCustom as any} />;
};

export default NumberInput;
