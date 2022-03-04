import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import Header from '@/components/general/Header/Header';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: theme.spacing(88),
  '.items': {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'wrap',
    justifyContent: 'center',
    img: {
      margin: theme.spacing(2, 4),
    },
  },
  [theme.breakpoints.up('md')]: {},
}));

const items = [1, 2, 3, 4, 5, 6, 7, 8];

export default function AssetSection() {
  const t = usePageTranslation();

  return (
    <Root>
      <Header title={t('asset-section.title')} description={t('asset-section.description')} dense />
      <Container maxWidth="lg">
        <div className="items">
          {items.map((id, index) => (
            <img
              key={id}
              /* TODO WIP When assets are ready use id to reference correct asset */
              src={`/images/pages/landing/asset1.svg`}
              alt=""
              title={t(`asset-section.items.${index}`)}
              width="92"
            />
          ))}
        </div>
      </Container>
    </Root>
  );
}
