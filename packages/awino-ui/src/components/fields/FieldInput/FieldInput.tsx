import React from 'react';

import { useField } from 'formik';

import {
  FormControl as MuiFormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  InputBase,
  InputBaseProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import FieldError from '../FieldError/FieldError';

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  '.MuiFormLabel-root': {
    marginBottom: theme.spacing(3.5),
    ...theme.typography['body-sm'],
    fontWeight: 700,
    color: theme.palette.text.contrast,
  },
  '.MuiInputBase-root': {
    borderRadius: +theme.shape.borderRadius * 2,
    padding: theme.spacing(3, 3.5, 3, 7),
    backgroundColor: theme.palette.background.transparent,
    ...theme.typography.body,
    color: theme.palette.text.primary,
    lineHeight: 2,
    '& .placeholder': {
      color: theme.palette.text.secondary,
    },
    '&.Mui-focused': {
      boxShadow: `0px 0 3px 1px ${theme.palette.primary.main}`,
    },
    '&.Mui-error': {
      boxShadow: `0px 0 3px 1px ${theme.palette.error.main}`,
    },
    svg: {
      transition: 'color 200ms ease-in',
    },
    '&.MuiInputBase-adornedStart > svg:first-of-type': {
      pointerEvents: 'none',
      padding: theme.spacing(5, 4, 5, 4.5),
      borderRight: '1px solid #262F40',
      fontSize: '34px',
      color: '#313b4e',
      boxSizing: 'content-box',
    },
    '&.Mui-focused.MuiInputBase-adornedStart > svg:first-of-type': {
      color: theme.palette.background.lighter,
    },

    '& .MuiInputAdornment-positionEnd button': {
      padding: theme.spacing(1, 3),
      border: `1px solid ${theme.palette.text.secondary}`,
      ...theme.typography['body-sm'],
      color: theme.palette.text.secondary,
      '&:hover': {
        borderWidth: 1,
        color: theme.palette.text.primary,
      },
    },
  },
  '.MuiInputBase-input': {
    minWidth: 60,
    // padding: theme.spacing(5, 8, 4.5),
    padding: theme.spacing(1, 2),
    boxSizing: 'border-box',
  },
}));

interface Props extends InputBaseProps {
  id?: string;
  label?: string;
  name: string;
  required?: boolean;
  className?: string;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
}

const FieldInput = ({
  id,
  label,
  className,
  required = false,
  fullWidth = false,
  controlProps = {},
  labelProps = {},
  ...props
}: Props) => {
  const [field, meta] = useField(props.name);
  const inputId = id || field.name;
  const hasError = !!meta.error;
  return (
    <FormControl
      color="secondary"
      error={hasError}
      required={required}
      {...controlProps}
      className={className}
      fullWidth={fullWidth}
    >
      {label && (
        <FormLabel htmlFor={inputId} {...labelProps}>
          {label}
        </FormLabel>
      )}
      <InputBase
        id={inputId}
        error={hasError}
        aria-describedby={`${inputId}Helper`}
        required={required}
        {...field}
        {...props}
      />
      {hasError && <FieldError id={`${inputId}Helper`} message={meta.error} /* field={label} */ />}
    </FormControl>
  );
};

export default FieldInput;
