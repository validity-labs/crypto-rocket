import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import Link from '@/components/general/Link/Link';
import LinkIcon from '@/components/icons/LinkIcon';

const Root = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flexWrap: 'wrap',
  '&.MuiLink-root': {
    color: theme.palette.text.active,
  },
  svg: {
    fontSize: 16,
    marginLeft: theme.spacing(2),
  },
}));

interface Props extends TypographyProps {
  href: string;
  text: string;
}

export default function ExternalLink({ href, text, ...restOfProps }: Props) {
  return (
    <Root
      className="AwiExternalLink-root"
      // @ts-ignore: types do not work as expected with component prop
      component={Link}
      href={href}
      {...restOfProps}
    >
      {text}
      <LinkIcon />
    </Root>
  );
}
