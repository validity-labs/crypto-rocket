import { useTranslation } from 'next-i18next';

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import ConnectButton from '@/components/buttons/ConnectButton';
import AwinoIcon from '@/components/icons/AwinoIcon';

import Link from '../Link/Link';

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(5),
  '.awino': {
    marginBottom: theme.spacing(6),
    fontSize: '60px',
    color: theme.palette.text.secondary,
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
      <AwinoIcon className="awino" />
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
