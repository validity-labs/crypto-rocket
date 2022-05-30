import ReactMarkdown from 'react-markdown';

import remarkBreaks from 'remark-breaks';

import { ArrowBackRounded } from '@mui/icons-material';
import { Box, Button, Chip, Typography } from '@mui/material';

import EmptyResult from '@/components/general/EmptyResult/EmptyResult';
import Link from '@/components/general/Link/Link';
import Loader from '@/components/general/Loader/Loader';
import Panel from '@/components/general/Panel/Panel';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ProposalItem } from '@/types/app';

import ProposalStatus from '../../governance/ProposalSection/ProposalStatus';

interface Props {
  proposal: ProposalItem;
  loading: boolean;
}

export default function TitleSection({ proposal, loading }: Props) {
  const t = usePageTranslation({ keyPrefix: 'title-section' });
  const { id, title, description, status } = proposal || {};
  return (
    <Section>
      <Box className="Awi-column" sx={{ alignItems: 'flex-start' }}>
        <Button component={Link} href="/governance" variant="text" startIcon={<ArrowBackRounded />} sx={{ mb: 6 }}>
          {t('back')}
        </Button>
        {loading ? (
          <Loader />
        ) : !proposal ? (
          <EmptyResult />
        ) : (
          <>
            <ProposalStatus status={status} />
            <Box className="Awi-row Awi-center" mt={10} mb={4}>
              <Chip variant="outlined" label={id} color="default" size="small" sx={{ mr: 10 }} />
              <Typography variant="h3" component="h1" pt={2}>
                {title}
              </Typography>
            </Box>
            <Typography variant="body-md">
              {description && <ReactMarkdown remarkPlugins={[remarkBreaks]}>{description}</ReactMarkdown>}
            </Typography>
          </>
        )}
      </Box>
    </Section>
  );
}
