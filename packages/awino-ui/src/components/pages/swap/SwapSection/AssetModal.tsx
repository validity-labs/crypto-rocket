import React, { useCallback, useMemo, useRef, useState } from 'react';

import { debounce } from 'lodash';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { InputBase, IconButton, ButtonBase, ButtonBaseProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import Label from '@/components/general/Label/Label';
import Modal from '@/components/general/Modal/Modal';
import SearchIcon from '@/components/icons/SearchIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { AssetKey } from '@/types/app';

import { AssetInfo, AssetInfoMap } from './SwapSection';

const Root = styled(Modal)(({ theme }) => ({
  '.MuiForm-root': {
    width: '100%',
  },
  '.MuiInputBase-root': {
    padding: theme.spacing(2.5, 3.5, 2, 7),
    ...theme.typography['body-sm'],
  },
  '.AwiAssetModal-search': {
    '.MuiInputBase-root': {
      width: '100%',
      padding: theme.spacing(3, 3.5, 3, 7),
      ...theme.mixins.radius(2),
      backgroundColor: theme.palette.background.transparent,
      input: {
        minWidth: 60,
      },
    },
  },
  '.AwiAssetModal-common': {
    '> .Awi-row': {
      gap: theme.spacing(3.5),
    },
  },
  '.AwiAssetModal-commonItem': {
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    ...theme.mixins.border.outlined,
    ...theme.mixins.radius(2),

    img: {
      position: 'relative',
      marginRight: theme.spacing(1),
    },
  },
  '.AwiAssetModal-tokenItems': {
    height: 200,
    overflow: 'auto',
  },
  '.AwiAssetModal-tokenItem': {
    width: '100%',
    padding: theme.spacing(2.5, 6, 2.5, 3),
    ...theme.typography.body,
    fontWeight: 500,
    img: {
      marginRight: theme.spacing(1),
    },
    '&.Awi-row': {
      justifyContent: 'space-between',
      gap: theme.spacing(3.5),
    },
  },
  '.AwiAssetModal-search, .AwiAssetModal-common': {
    margin: theme.spacing(0, 0, 8),
    padding: theme.spacing(0, 0, 8),
    ...theme.mixins.divider,
  },
  '.AwiAssetModal-common, .AwiAssetModal-tokens': {
    '.AwiLabel-root': {
      margin: theme.spacing(0, 0, 4, 0),
      fontWeight: 500,
      color: theme.palette.text.secondary,
    },

    '.AwiAssetModal-commonItem, .AwiAssetModal-tokenItem': {
      '&:hover, &.Mui-focusVisible': {
        outline: `2px solid ${theme.palette.success.light}`,
        outlineOffset: -2,
      },
    },
  },
}));

interface CommonItemProps extends Omit<ButtonBaseProps, 'type'> {
  id: AssetKey;
  label: string;
  type: AssetModalDataType;
  callback: AssetModalUpdateCallback;
}

const CommonItem = ({ id, label, type, callback, ...restOfProps }: CommonItemProps) => {
  const handleClick = useCallback(() => {
    callback(type, id);
  }, [id, type, callback]);

  return (
    <ButtonBase key={id} className="AwiAssetModal-commonItem Awi-row" onClick={handleClick} {...restOfProps}>
      <img src={`/images/assets/${id}.svg`} alt="" width="24" height="24" />
      {label}
    </ButtonBase>
  );
};

interface TokenItemProps extends Omit<ButtonBaseProps, 'type'> {
  item: AssetInfo;
  type: AssetModalDataType;
  callback: AssetModalUpdateCallback;
}
const TokenItem = ({ item, type, callback, ...restOfProps }: TokenItemProps) => {
  const { id, label, value } = item;

  const handleClick = useCallback(() => {
    callback(type, id);
  }, [id, type, callback]);

  return (
    <ButtonBase key={id} className="AwiAssetModal-tokenItem Awi-row" onClick={handleClick} {...restOfProps}>
      <span className="Awi-row">
        <img src={`/images/assets/${id}.svg`} alt="" width="30" height="30" />
        {label}
      </span>
      <span>{value}</span>
    </ButtonBase>
  );
};

type AssetModalDataType = 'source' | 'target';

export interface AssetModalData {
  type: AssetModalDataType;
  currentAsset: AssetKey;
  assets: AssetInfoMap;
}

export type AssetModalUpdateCallback<T = void> = (type: 'source' | 'target', payload: AssetKey) => T;

interface Props {
  open: boolean;
  close: () => void;
  data: AssetModalData;
  callback: AssetModalUpdateCallback;
  i18nKey: string;
}

export default function AssetModal({ open, close, data, callback, i18nKey }: Props) {
  const t = usePageTranslation({ keyPrefix: i18nKey });

  const { currentAsset, type, assets } = data;

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchValue, setSearchValue] = useState(null);

  const handleSearchValueDebounce = useRef(
    debounce((newSearchValue: string) => setSearchValue(newSearchValue.toLowerCase()), 50)
  ).current;

  const { ids, commonIds } = useMemo(() => {
    let newIds = [];
    let newCommonIds = [];

    Array.from(assets).forEach(([id, assetItem]) => {
      if (id !== currentAsset) {
        if (!searchValue || assetItem.label.toLowerCase().indexOf(searchValue) !== -1) {
          newIds.push(id);
        }
        if (assetItem.common) {
          newCommonIds.push(id);
        }
      }
    });

    return { ids: newIds, commonIds: newCommonIds };
  }, [assets, currentAsset, searchValue]);

  const handleSearchSubmit = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault();
      // console.log('handleSearchSubmit');
      // isChangeThroughSubmit.current = true;
      // setSearchValue(searchInputValue.toLowerCase());

      if (ids.length === 1) {
        callback(type, ids[0]);
        close();
      }
    },
    [ids, type, callback, close]
  );

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInputValue(newValue);
    handleSearchValueDebounce(newValue);
  };

  const handleSearchInputClear = () => {
    setSearchInputValue('');
    setSearchValue(null);
  };

  const handleAssetClick: AssetModalUpdateCallback = useCallback(
    (type, payload) => {
      callback(type, payload);
      close();
    },
    [callback, close]
  );

  const clearSeachLabel = t('common:common.clear-search');

  return (
    <Root id="assetSwap" title={t('title')} open={open} close={close}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSearchSubmit}
        className="AwiAssetModal-search"
        data-testid="SearchForm"
      >
        <InputBase
          value={searchInputValue}
          onChange={handleSearchInputChange}
          autoFocus
          endAdornment={
            <IconButton
              size="small"
              title={clearSeachLabel}
              aria-label={clearSeachLabel}
              disabled={!searchInputValue}
              onClick={handleSearchInputClear}
            >
              {searchInputValue ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          }
          placeholder={t('search')}
        />
      </form>
      {commonIds && (
        <div className="AwiAssetModal-common">
          <Label id="assetModalCommon" tooltip={t('common-bases-hint')}>
            {t('common-bases')}
          </Label>
          <div className="Awi-row">
            {commonIds.map((id) => (
              <CommonItem
                key={id}
                id={id}
                label={assets.get(id).label}
                callback={handleAssetClick}
                type={type}
                aria-labelledby="assetModalCommon"
              />
            ))}
          </div>
        </div>
      )}
      {ids && (
        <div className="AwiAssetModal-tokens">
          <Label id="assetModalTokens">{t('tokens')}</Label>
          <div className="AwiAssetModal-tokenItems">
            {ids.map((id) => (
              <TokenItem
                key={id}
                item={assets.get(id)}
                callback={handleAssetClick}
                type={type}
                aria-labelledby="assetModalTokens"
              />
            ))}
          </div>
        </div>
      )}
    </Root>
  );
}
