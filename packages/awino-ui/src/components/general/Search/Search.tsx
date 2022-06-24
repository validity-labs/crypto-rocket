import React, { useCallback, useState } from 'react';

import { useTranslation } from 'next-i18next';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { IconButton, InputBase, InputProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

import SearchIcon from '@/components/icons/SearchIcon';
// import { SetState } from '@/types/app';

const Form = styled('form')({
  width: '100%',
});

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
      <InputBase
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
