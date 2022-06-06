import React from 'react';

import { useField } from 'formik';

import {
  FormControl as MuiFormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  InputAdornment,
  InputBaseProps,
  MenuItem as MuiMenuItem,
  Select,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import DropdownArrowIcon from '@/components/icons/DropdownArrowIcon';

import FieldError from '../FieldError/FieldError';

export const FormControlSelect = styled(MuiFormControl)(({ theme }) => ({
  '.MuiFormLabel-root': {
    marginBottom: theme.spacing(3.5),
    ...theme.typography['body-sm'],
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  '.MuiSelect-root': {
    borderRadius: +theme.shape.borderRadius * 3,
    margin: 0,
    '&.Mui-focused': {
      boxShadow: `0px 0 3px 1px ${theme.palette.primary.main}`,
    },
    '&.Mui-error': {
      boxShadow: `0px 0 3px 1px ${theme.palette.error.main}`,
    },
  },
}));

export const MenuItemSelect = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(2, 8),
  ...theme.typography.body,
  color: theme.palette.text.contrast,
  '&.Mui-selected': {
    fontWeight: 600,
    color: theme.palette.text.active,
  },
}));

interface Props extends InputBaseProps {
  id?: string;
  label?: string;
  name: string;
  required?: boolean;
  controlProps?: FormControlProps;
  labelProps?: FormLabelProps;
  // fieldName?: never;
  options: { label: string; value: string | number }[];
  marginDense?: 'dense';
  placeholderValue?: string;
  icon?: never;
}

const FieldSelect = ({
  id,
  label,
  // fieldName,
  options = [],
  required = false,
  controlProps = {},
  labelProps = {},
  placeholder = '',
  // marginDense = 'dense',
  fullWidth = false,
  placeholderValue = '',
  icon: Icon,
  ...props
}: Props) => {
  const [field, meta] = useField(props.name);
  // console.log(field, meta);
  const inputId = id || field.name;
  const hasError = !!meta.error;

  // const helpFieldName = fieldName || label || placeholder || field.name;

  //  const handleChange = (event: SelectChangeEvent) => {
  //    onChange(event.target.value as string)
  //  };

  return (
    <FormControlSelect error={hasError} required={required} fullWidth={fullWidth} {...controlProps}>
      {label && (
        <FormLabel htmlFor={inputId} {...labelProps}>
          {label}
        </FormLabel>
      )}
      {/* @ts-expect-error */}
      <Select
        id={inputId}
        error={hasError}
        // labelId
        variant="standard"
        disableUnderline
        aria-describedby={`${inputId}Helper`}
        // required={required}
        placeholder={placeholder}
        // margin="dense"
        fullWidth={fullWidth}
        displayEmpty={!!placeholder}
        IconComponent={DropdownArrowIcon}
        MenuProps={{
          sx: {},
          PaperProps: {
            sx: {
              py: 4,
              marginTop: 2,
              backgroundColor: '#112333',
              borderColor: 'text.active',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 3,
              // border: `1px solid text.active`,
            },
          },
          // classes: {
          //   paper: {
          //   },
          // },
          // component: Menu,
          MenuListProps: {
            disablePadding: true,
          },
          // getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        startAdornment={
          Icon && <InputAdornment position="start">{/* <Icon style={{ fontSize: 20 }} /> */}</InputAdornment>
        }
        {...field}
        {...props}
      >
        {placeholder && (
          <MenuItemSelect value={placeholderValue} disabled style={{ display: 'none' }}>
            <span className="placeholder">{placeholder}</span>
          </MenuItemSelect>
        )}
        {options.map((option) => (
          <MenuItemSelect key={option.value} value={option.value}>
            {option.label}
          </MenuItemSelect>
        ))}
      </Select>
      {hasError && <FieldError id={inputId} message={meta.error} /* field={helpFieldName} */ />}
    </FormControlSelect>
  );
};

export default FieldSelect;
