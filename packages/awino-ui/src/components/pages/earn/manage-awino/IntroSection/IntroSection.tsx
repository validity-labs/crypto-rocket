import { Typography } from '@mui/material';

import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

export default function IntroSection() {
  const t = usePageTranslation();

  return (
    <Section>
      <Typography variant="h3" component="h1" color="text.active" mb={4}>
        {t('intro-section.title')}
      </Typography>
      <Typography color="text.primary">{t('intro-section.description')}</Typography>
    </Section>
  );
}
