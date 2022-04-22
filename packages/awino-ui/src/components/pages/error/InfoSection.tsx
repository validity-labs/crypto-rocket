import React from 'react';

import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '@/components/general/Label/Label';
import Link from '@/components/general/Link/Link';
import Panel from '@/components/general/Panel/Panel';
import AwinoIcon from '@/components/icons/AwinoIcon';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  '.AwiPanel-content': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(6),
  },
  '.AwiInfoSection-icon': {
    marginBottom: theme.spacing(6),
    fontSize: '60px',
    color: theme.palette.text.secondary,
  },
  '.AwiInfoSection-prompt': {
    marginBottom: theme.spacing(12),
  },
}));

interface Props {
  statusCode?: number;
}

const InfoSection = ({ statusCode }: Props) => {
  const t = usePageTranslation();
  return (
    <>
      <Root>
        <Panel header={<Label component="h1">{t('info-section.title')}</Label>}>
          <AwinoIcon className="AwiInfoSection-icon" />
          <Typography variant="h2" color="text.secondary" className="AwiInfoSection-prompt">
            {t('info-section.error-code', { code: statusCode || '-' })}
          </Typography>
          <Button component={Link} href="/" variant="outlined">
            {t('info-section.back')}
          </Button>
        </Panel>
      </Root>
    </>
  );
};

export default InfoSection;
