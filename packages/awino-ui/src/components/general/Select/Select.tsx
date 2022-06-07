import { Component, memo } from 'react';

import { useTranslation } from 'next-i18next';

import { Box, FormControl, BoxProps, Typography, CircularProgress, FormLabel, FormControlProps } from '@mui/material';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import MuiSelect, { SelectChangeEvent, selectClasses, SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import ExpandIcon from '@/components/icons/ExpandIcon';
import { SetState } from '@/types/app';

const Root = styled(FormControl)(({ theme }) => ({
  // padding: 0,
  '.MuiInput-root': {
    minWidth: 160,
    padding: '0 !important',
    margin: '0 !important',
    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
    '&:hover, &[aria-expanded="true"]': {
      boxShadow: `0px 0 3px 1px ${theme.palette.primary.main}`,
      '.MuiSelect-icon': {
        color: theme.palette.text.active,
      },
    },
    '&.Mui-focused, &:focus': {
      borderRadius: +theme.shape.borderRadius * 2,
    },
  },

  [`& .${selectClasses.standard}`]: {
    // display: 'flex',
    // alignItems: 'center',
    // minHeight: '58px !important',
    // padding: `${theme.spacing(1, 7, 1, 7)} !important`,
    // borderRadius: +theme.shape.borderRadius * 2,
    // backgroundColor: theme.palette.background.transparent,
    // color: theme.palette.text.primary,
    // lineHeight: 2,
    // overflow: 'hidden',
    backgroundColor: 'transparent',
    ...theme.typography.body,
  },
  [`& .${selectClasses.icon}`]: {
    fontSize: '32px',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(4),
    transition: 'color 200ms ease-in',
    path: {
      fill: 'currentColor !important',
    },
  },
  [`& .${selectClasses.iconOpen}`]: {
    color: theme.palette.text.active,
  },
  '.MuiSelect-value': {
    ...theme.typography['body-md'],
    fontWeight: 500,
    color: theme.palette.text.primary,
    img: {
      width: 32,
      height: 32,
      marginRight: theme.spacing(4),
    },
  },
}));

interface MenuItemProps extends MuiMenuItemProps {
  item: {
    id: string;
    label: string;
  };
  value: string;
  selected: boolean;
  children: React.ReactNode;
}

const MenuItem = styled(({ item, selected, children, ...restOfProps }: MenuItemProps) => {
  return (
    <MuiMenuItem value={item.id} selected={selected} dense {...restOfProps}>
      <Typography className="MuiMenuItem-content">{children}</Typography>
    </MuiMenuItem>
  );
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.text.primary,
  },
  '.MuiMenuItem-content': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(1.5, 4, 1.5, 4),
    ...theme.typography['body-ms'],
    fontWeight: 500,
    color: 'inherit',
    img: {
      width: 32,
      height: 32,
      marginRight: theme.spacing(4),
    },
  },
}));

interface SelectItem {
  id: string;
  label: string;
}

export type SelectValueComponentFC = React.FC<{ item: SelectItem }>;
export type SelectOptionComponentFC = React.FC<{ item: SelectItem }>;

export const SelectValueAndOptionDefault: SelectValueComponentFC = memo(function SelectValueAndOptionDefault({
  item: { /* id, */ label },
}) {
  return <>{label}</>;
});

interface Props extends SelectProps {
  items: Map<string, SelectItem>;
  value: string;
  setValue: SetState<string>;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  ValueComponent: SelectValueComponentFC;
  OptionComponent: SelectOptionComponentFC;
  formControlProps?: FormControlProps;
  // label: React.ReactNode;
}
export default function Select({
  id,
  label,
  items,
  value,
  setValue,
  placeholder,
  ValueComponent,
  OptionComponent,
  formControlProps,
  loading = false,
  disabled = false,
  ...restOfProps
}: Props) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };
  return (
    <Root fullWidth {...formControlProps}>
      {label && (
        <FormLabel id={`${id}Label`} htmlFor={id}>
          {label}
        </FormLabel>
      )}
      <MuiSelect
        id={id}
        labelId={`${id}Label`}
        disableUnderline
        variant="standard"
        displayEmpty
        value={value}
        onChange={handleChange}
        disabled={loading || disabled}
        MenuProps={{
          PaperProps: {
            sx: {
              border: 0,
              borderRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            },
          },
        }}
        IconComponent={ExpandIcon}
        renderValue={() => {
          return (
            <Typography variant="body-ms" className="MuiSelect-value">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  {value ? (
                    <ValueComponent item={items.get(value)} />
                  ) : (
                    <Typography variant="inherit" component="span" color="text.secondary">
                      {placeholder}
                    </Typography>
                  )}
                </>
              )}
            </Typography>
          );
        }}
        {...restOfProps}
      >
        {Array.from(items).map(([id, item]) => (
          <MenuItem key={id} item={item} value={id} selected={value === id}>
            {<OptionComponent item={item} />}
          </MenuItem>
        ))}
      </MuiSelect>
    </Root>
  );
}
