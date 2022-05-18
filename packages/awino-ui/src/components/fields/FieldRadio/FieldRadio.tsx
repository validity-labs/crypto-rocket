import React from 'react';

import { useField } from 'formik';

import {
  FormControl as MuiFormControl,
  FormControlLabel,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import FieldError from '../FieldError/FieldError';

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  '.MuiFormLabel-root': {
    marginBottom: theme.spacing(3.5),
    ...theme.typography['body-sm'],
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '.MuiFormGroup-root': {
    justifyContent: 'space-between',
  },
  '.MuiRadio-root.Mui-checked + span': {
    color: theme.palette.text.primary,
  },
}));

interface Props extends RadioGroupProps {
  id?: string;
  label?: string;
  name: string;
  required?: boolean;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  fullWidth?: boolean;
  options: { label: string; value: string | number }[];
  marginDense?: 'dense';
  placeholderValue?: string;
  icon?: never;
}

const FieldRadio = ({
  id,
  label,
  options = [],
  required = false,
  controlProps = {},
  labelProps = {},
  placeholder = '',
  fullWidth = false,
  placeholderValue = '',
  icon: Icon,
  ...props
}: Props) => {
  const [field, meta] = useField(props.name);
  const inputId = id || field.name;
  const labelId = `${inputId}Label`;
  const hasError = !!meta.error;

  return (
    <FormControl error={hasError} required={required} fullWidth={fullWidth} {...controlProps}>
      {label && (
        <FormLabel id={labelId} {...labelProps}>
          {label}
        </FormLabel>
      )}
      <RadioGroup row {...field} {...props}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            labelPlacement="bottom"
            control={
              <Radio
                inputProps={{
                  'aria-labelledby': labelId,
                  ...(hasError && { 'aria-describedby': `${inputId}Helper` }),
                }}
              />
            }
            label={label}
          />
        ))}
      </RadioGroup>
      {hasError && <FieldError id={inputId} message={meta.error} />}
    </FormControl>
  );
};

export default FieldRadio;
