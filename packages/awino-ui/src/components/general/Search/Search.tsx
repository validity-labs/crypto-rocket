import React, { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { IconButton, Input, InputProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

import SearchIcon from '@/components/icons/SearchIcon';
// import { SetState } from '@/types/app';

const Form = styled('form')({
  width: '100%',
});

const SearchInput = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.75, 4),
  border: '1px solid #546367',
  borderRadius: +theme.shape.borderRadius * 3,
  transition: '200ms ease-in',
  input: {
    padding: 0,
    ...theme.typography.menu,
    color: theme.palette.text.primary,
    '&::placeholder': {
      transition: '200ms ease-in',
      color: theme.palette.text.secondary,
    },
  },
  '&.Mui-focused': {
    transition: '200ms ease-in',
    border: '1px solid #0cbc9a',
    input: {
      '&::placeholder': {
        color: theme.palette.text.primary,
      },
    },
  },
  '&.MuiInputBase-adornedEnd svg': {
    color: '#0cbc9a',
    fontSize: '24px',
  },
}));

interface Props extends InputProps {
  // term: string;
  // setTerm: SetState<string | null>;
  // eslint-disable-next-line no-unused-vars
  onSearch: (term: string) => void;
  sx?: SxProps<Theme>;
}

export default function Search({ /* term, setTerm, */ onSearch, ...props }: Props) {
  const { t } = useTranslation();
  const [term, setTerm] = useState<string>('');
  const handleSearch = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      onSearch(term);
      // setTerm('');
    },
    [onSearch, term /* , setTerm */]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleSearchInputClear = () => {
    onSearch(null);
    setTerm('');
  };

  return (
    <Form noValidate autoComplete="off" onSubmit={handleSearch} data-testid="SearchForm" className="AwiSearch-root">
      <SearchInput
        disableUnderline
        value={term}
        onChange={handleChange}
        endAdornment={
          // <SearchIcon />

          <IconButton
            size="small"
            // title={clearSeachLabel}
            // aria-label={clearSeachLabel}
            // disabled={!searchInputValue}
            onClick={handleSearchInputClear}
          >
            {term ? <CloseIcon /> : <SearchIcon />}
          </IconButton>
        }
        placeholder={t('common.search')}
        {...props}
      />
    </Form>
  );
}
