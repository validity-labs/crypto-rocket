import { useTranslation } from 'next-i18next';

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ConnectButton from '@/components/buttons/ConnectButton';

import Link from '../Link/Link';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(5),
  '.LabConnectPanel-logo': {
    width: 80,
    marginBottom: theme.spacing(6),
  },
  '.prompt': {
    marginBottom: theme.spacing(12),
  },
  '.actions': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(24),
    '.MuiButton-root': {
      margin: theme.spacing(3),
    },
  },
}));

interface Props {
  back?: string;
}

export default function ConnectPanel({ back }: Props) {
  const { t } = useTranslation();

  return (
    <Root>
      <img src={`/images/logo-small.svg`} alt="" width={80} className="LabConnectPanel-logo" />
      <Typography variant="h3" component="p" color="text.secondary" className="prompt">
        {t('account.connect-prompt')}
      </Typography>
      <div className="actions">
        {back && (
          <Button component={Link} href={back} variant="outlined">
            {t('common.back')}
          </Button>
        )}
        <ConnectButton />
      </div>
    </Root>
  );
}
