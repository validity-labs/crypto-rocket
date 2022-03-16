import { useCallback, useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { useCopyToClipboard } from 'react-use';

import { IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '@/app/hooks';
import { showMessage } from '@/app/state/slices/app';
import CopyIcon from '@/components/icons/CopyIcon';
import { stopPropagation } from '@/lib/helpers';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  button: {
    position: 'relative',
    top: -2,
    marginLeft: theme.spacing(2),
    color: theme.palette.text.active,
  },
  '.AwiAddress-address': {
    display: 'flex',
    wordBreak: 'break-all',
  },
  '.AwiAddress-prefix': {
    display: ['block', '-webkit-box'],
    maxWidth: '100%',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  '.AwiAddress-postfix': {
    whiteSpace: 'nowrap',
  },
}));

interface Props {
  address: string;
  copy?: boolean;
}

const Address = ({ address, copy = true }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [, copyToClipboard] = useCopyToClipboard();

  const parts = useMemo(() => {
    return {
      prefix: address.slice(0, -4),
      postfix: address.slice(-4),
    };
  }, [address]);

  const handleCopy = useCallback(() => {
    copyToClipboard(address);
    dispatch(
      showMessage({
        message: t('common.copied'),
      })
    );
  }, [copyToClipboard, address, t, dispatch]);

  return (
    <Root className="AwiAddress-root">
      <Typography variant="body-sm" className="AwiAddress-address" title={address}>
        <span className="AwiAddress-prefix">{parts.prefix}</span>
        <span className="AwiAddress-postfix">{parts.postfix}</span>
      </Typography>
      {copy && (
        <IconButton
          size="small"
          title={t('common.copy')}
          aria-label={t('common.copy')}
          onClick={stopPropagation(handleCopy)}
        >
          <CopyIcon />
        </IconButton>
      )}
    </Root>
  );
};

export default Address;
