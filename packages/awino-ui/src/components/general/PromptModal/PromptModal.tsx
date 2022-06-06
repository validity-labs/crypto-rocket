import React from 'react';

import { Modal as MuiModal, Typography, Container, ModalProps, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(MuiModal)(({ theme }) => ({
  padding: theme.spacing(6),
  '.MuiTypography-root': {
    overflow: 'visible',
  },
  '.AwiPromptModal-container': {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  '.AwiPromptModal-paper': {
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
  '.AwiPromptModal-content': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    '.AwiPromptModal-content': {
      padding: theme.spacing(10, 14, 10, 11),
    },
  },
}));

export interface PromptModalData {
  title: string;
  message: string;
  button?: string;
  onClose: () => void;
}

interface Props extends Omit<ModalProps, 'children' | 'onClose' | 'title'> {
  data: PromptModalData;
  close: () => void;
}

export default function PromptModal({ data: { title, message, button, onClose }, close, ...restOfProps }: Props) {
  const t = usePageTranslation();

  const handleClose = () => {
    onClose();
    close();
  };

  return (
    <Root onClose={handleClose} aria-labelledby="promptModalTitle" {...restOfProps}>
      <Container maxWidth="sm" className="AwiPromptModal-container">
        <div className="AwiPromptModal-paper">
          <div className="AwiPromptModal-content">
            <Typography id="promptModalTitle" variant="h4" component="h2" mb={6}>
              {title}
            </Typography>
            <Typography color="text.primary" mb={6}>
              {message}
            </Typography>
            <Button variant="outlined" onClick={handleClose}>
              {button || t('common:common.close-modal')}
            </Button>
          </div>
        </div>
      </Container>
    </Root>
  );
}
