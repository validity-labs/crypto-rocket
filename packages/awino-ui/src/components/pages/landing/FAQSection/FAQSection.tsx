import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Header from '@/components/general/Header/Header';
import ExpandIcon from '@/components/icons/ExpandIcon';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: theme.spacing(88),
  '.MuiAccordionSummary-root': {
    svg: {
      fontSize: '52px',
      color: theme.palette.text.active,
    },
  },
  [theme.breakpoints.up('md')]: {},
}));

const items = [1, 2, 3, 4];

export default function FAQSection() {
  const t = usePageTranslation();

  return (
    <Root>
      <Header title={t('faq-section.title')} description={t('faq-section.description')} />
      <Container maxWidth="md">
        {items.map((id, index) => (
          /* @ts-ignore - for some reason component prop is not defined */
          <Accordion key={id} component="article" defaultExpanded={index === 0}>
            <AccordionSummary
              aria-controls={`panel-content-${id}`}
              id={`panel-header-${id}`}
              expandIcon={<ExpandIcon />}
            >
              {t(`faq-section.items.${id - 1}.title`)}
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{t(`faq-section.items.${id - 1}.description`)}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Root>
  );
}
