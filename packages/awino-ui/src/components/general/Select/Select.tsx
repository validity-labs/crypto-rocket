import { useTranslation } from 'next-i18next';

import { Box, FormControl, BoxProps, Typography, CircularProgress } from '@mui/material';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';
import MuiSelect, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

import ExpandIcon from '@/components/icons/ExpandIcon';
import { SetState } from '@/types/app';
const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  [`& .${selectClasses.standard}`]: {
    display: 'flex',
    alignItems: 'center',
    // minHeight: '58px !important',
    minWidth: '160px !important',
    padding: `${theme.spacing(2, 10, 2.25, 2)} !important`,
    border: '1px solid #546367',
    borderRadius: +theme.shape.borderRadius * 3,
    backgroundColor: 'transparent',
  },
  '&.Mui-focused': {
    [`& .${selectClasses.standard}`]: {
      border: '1px solid #0cbc9a',
      borderRadius: +theme.shape.borderRadius * 3,
      backgroundColor: 'transparent',
    },
  },
  [`& .${selectClasses.icon}`]: {
    fontSize: '32px',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
    path: {
      fill: 'currentColor !important',
    },
  },
  [`& .${selectClasses.iconOpen}`]: {
    color: '#0cbc9a',
  },
  '.MuiSelect-value': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(0.75, 4),
    ...theme.typography.menu,
    color: theme.palette.text.primary,
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
      <Typography variant="body-sm">{item.label}</Typography>
    </MuiMenuItem>
  );
})(({ theme }) => ({
  padding: theme.spacing(1.5, 12, 1.5, 10),
  '&.Mui-selected p': {
    color: theme.palette.text.primary,
  },
}));

interface SelectItem {
  id: string;
  label: string;
}

interface Props extends BoxProps {
  items: Map<string, SelectItem>;
  value: string;
  setValue: SetState<string>;
  loading?: boolean;
  disabled?: boolean;
}
export default function Select({ items, value, setValue, loading = false, disabled = false, ...restOfProps }: Props) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <Box component={FormControl} {...restOfProps}>
      <StyledSelect
        disableUnderline
        aria-label=""
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
        variant="standard"
        displayEmpty
        fullWidth
        MenuProps={{
          PaperProps: {
            sx: {
              marginTop: 2,
            },
          },
        }}
        IconComponent={ExpandIcon}
        label={null}
        disabled={loading || disabled}
        renderValue={() => {
          return (
            <Typography className="MuiSelect-value">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <>{value ? <>{items.get(value).label}</> : <>{t('common.select-token')}</>}</>
              )}
            </Typography>
          );
        }}
      >
        {Array.from(items).map(([id, item]) => (
          <MenuItem key={id} item={item} value={id} selected={value === id} />
        ))}
      </StyledSelect>
    </Box>
  );
}
