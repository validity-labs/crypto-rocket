import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Section from '@/components/layout/Section/Section';
import { AssetKey } from '@/types/app';

const Root = styled(Section)(({ theme }) => ({
  padding: theme.spacing(7, 0),
  '.AwiInfoSection-title': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: 600,
    img: {
      marginRight: theme.spacing(2),
      position: 'relative',
      top: -4,
    },
  },
}));

interface Props {
  asset: AssetKey;
}

export default function InfoSection({ asset }: Props) {
  return (
    <Root>
      <Typography variant="h3" component="h1" className="AwiInfoSection-title">
        <img src={`/images/assets/${asset}.svg`} alt="" width="56" height="56" />
        {asset.toUpperCase()}
      </Typography>
    </Root>
  );
}
