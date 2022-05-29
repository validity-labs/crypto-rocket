import ReactMarkdown from 'react-markdown';

import remarkBreaks from 'remark-breaks';

import { ArrowBackRounded } from '@mui/icons-material';
import { Button, Chip, Typography } from '@mui/material';

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
      <Button component={Link} href="/governance" variant="text" startIcon={<ArrowBackRounded />} sx={{ mb: 6 }}>
        {t('back')}
      </Button>
      <Panel className="AwiTitleSection-panel">
        {loading ? (
          <Loader />
        ) : !proposal ? (
          <EmptyResult />
        ) : (
          <>
            <div className="Awi-row Awi-center">
              <Chip variant="outlined" label={id} color="default" size="small" sx={{ mr: 10 }} />
              <ProposalStatus status={status} />
            </div>
            <Typography variant="h3" component="h1" mt={10} mb={4}>
              {title}
            </Typography>
            <Typography variant="body-md">
              {description && <ReactMarkdown remarkPlugins={[remarkBreaks]}>{description}</ReactMarkdown>}
            </Typography>
          </>
        )}
      </Panel>
    </Section>
  );
}
