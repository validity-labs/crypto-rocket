import React from 'react';

import CloseIcon from '@mui/icons-material/CloseRounded';
import { Modal as MuiModal, Typography, Container, IconButton, ModalProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';

import Label from '../Label/Label';

const Root = styled(MuiModal)(({ theme }) => ({
  padding: theme.spacing(6),
  '.MuiTypography-root': {
    overflow: 'visible',
  },
  '.AwiModal-container': {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  '.AwiModal-paper': {
    pointerEvents: 'all',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    maxHeight: '100%',
    // paddingBottom: theme.spacing(5),
    border: `1px solid ${theme.palette.text.active}`,
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: theme.palette.background.light,
    overflow: 'hidden',
  },
  '.AwiModal-header': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(6, 6, 5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    h2: {
      color: theme.palette.text.secondary,
    },
  },
  '.AwiModal-close': {
    position: 'absolute',
    top: 20,
    right: 17,
  },
  '.AwiModal-content': {
    display: 'flex',
    flexDirection: 'column',
    // gap: theme.spacing(4),
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(10, 6, 10),
    margin: theme.spacing(1, 0, 1),
  },
  '*::-webkit-scrollbar': {
    width: '6px',
    height: '6px',
    borderRadius: +theme.shape.borderRadius * 2,
  },
  '*::-webkit-scrollbar-thumb': {
    borderRadius: '6px',
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10),
    '.AwiModal-header': {
      padding: theme.spacing(6, 14, 5, 11),
    },
    '.AwiModal-content': {
      padding: theme.spacing(10, 14, 10, 11),
    },
  },
}));

interface Props extends Omit<ModalProps, 'children' | 'onClose' | 'title'> {
  id: string;
  title: React.ReactNode;
  titleTooltip?: string;
  children: React.ReactNode;
  close: () => void;
}

export default function Modal({ id: idPrefix, title, titleTooltip, close, children, ...restOfProps }: Props) {
  const t = usePageTranslation();
  const id = `${idPrefix}ModalTitle`;
  return (
    <Root onClose={close} aria-labelledby={id} {...restOfProps}>
      <Container maxWidth="sm" className="AwiModal-container">
        <div className="AwiModal-paper">
          <div className="AwiModal-header">
            <Label variant="body" component="h2" color="text.active" fontWeight={500} id={id} tooltip={titleTooltip}>
              {title}
            </Label>
            <IconButton
              size="small"
              title={t('common:common.close-modal')}
              aria-label={t('common:common.close-modal')}
              className="AwiModal-close"
              onClick={close}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="AwiModal-content">{children}</div>
        </div>
      </Container>
    </Root>
  );
}
