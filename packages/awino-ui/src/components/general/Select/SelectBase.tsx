import { useTranslation } from 'next-i18next';

import { Box, FormControl, BoxProps, Typography, CircularProgress, FormLabel } from '@mui/material';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import MuiSelect, { SelectChangeEvent, selectClasses, SelectProps } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import ExpandIcon from '@/components/icons/ExpandIcon';
import { SetState } from '@/types/app';

const Root = styled(FormControl)(({ theme }) => ({
  '.MuiInput-root': {
    marginTop: theme.spacing(1),
  },
  [`& .${selectClasses.standard}`]: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '58px !important',
    padding: `${theme.spacing(1, 7, 1, 7)} !important`,

    borderRadius: +theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.transparent,
    ...theme.typography.body,
    color: theme.palette.text.primary,
    lineHeight: 2,
    overflow: 'hidden',
    '.Mui-focused': {
      borderRadius: +theme.shape.borderRadius * 2,
    },
  },
  [`& .${selectClasses.icon}`]: {
    fontSize: '32px',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(4),
    path: {
      fill: 'currentColor !important',
    },
  },
  [`& .${selectClasses.iconOpen}`]: {
    color: theme.palette.text.active,
  },
  '.MuiSelect-value': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
}

const MenuItem = styled(({ item, selected, ...restOfProps }: MenuItemProps) => {
  return (
    <MuiMenuItem value={item.id} selected={selected} dense {...restOfProps}>
      <Typography className="MuiMenuItem-content">
        <img src={`/images/assets/${item.id}.svg`} alt="" width="24" />
        {item.label}
      </Typography>
    </MuiMenuItem>
  );
})(({ theme }) => ({
  '.MuiMenuItem-content': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(1.5, 4, 1.5, 4),
    ...theme.typography['body-ms'],
    fontWeight: 500,
    color: theme.palette.text.primary,
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

interface Props extends SelectProps {
  items: Map<string, SelectItem>;
  value: string;
  setValue: SetState<string>;
  loading?: boolean;
  disabled?: boolean;
  // label: React.ReactNode;
}
export default function SelectBase({
  id,
  label,
  items,
  value,
  setValue,
  loading = false,
  disabled = false,
  ...restOfProps
}: Props) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <Root>
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
                    <>
                      <img src={`/images/assets/${value}.svg`} alt="" width="24" />
                      {items.get(value).label}
                    </>
                  ) : (
                    <Typography variant="inherit" color="text.secondary">
                      {t('common.select-token')}
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
          <MenuItem key={id} item={item} value={id} selected={value === id} />
        ))}
      </MuiSelect>
    </Root>
  );
}
