import { useMemo } from 'react';

import { TFunction } from 'next-i18next';

import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import { Form, Formik, FormikHelpers } from 'formik';
import remarkBreaks from 'remark-breaks';
import * as Yup from 'yup';

import { Alert, Typography, FormControl, FormLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import FieldInput from '@/components/fields/FieldInput/FieldInput';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import usePageTranslation from '@/hooks/usePageTranslation';
// import useSnack from '@/hooks/useSnack';
import useYupLocales from '@/hooks/useYupLocales';

const Root = styled('div')(({ theme }) => ({
  '.AwiProposalEditor-preview': {
    minHeight: 182,
    padding: theme.spacing(7, 3.5, 3, 7),
    borderRadius: +theme.shape.borderRadius * 9,
    backgroundColor: theme.palette.background.transparent,
  },
  '.MuiInputBase-root': {
    borderRadius: +theme.shape.borderRadius * 9,
  },

  [theme.breakpoints.up('md')]: {},
}));

const getValidationSchema = (t: TFunction) => {
  return Yup.object({
    title: Yup.string().required().label(t('field.title.label')),
    description: Yup.string().required().label(t('field.description.label')),
  }) as Yup.SchemaOf<Values>;
};

interface Values {
  title: string;
  description: string;
}

export interface ProposalData {
  title: string;
  description: string;
}

interface Props {
  proposalThreshold?: number;
  loading: boolean;
  canCreate: boolean;
  has: {
    activeOrPendingProposal: boolean;
    enoughVote: boolean;
  };
  onCreate: ({ title, description }: ProposalData) => Promise<boolean>;
}

const ProposalEditor = ({ loading, canCreate, has, proposalThreshold, onCreate }: Props) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-editor' });
  const {
    i18n: { language },
  } = useTranslation();

  useYupLocales();

  const validationSchema = useMemo<Yup.SchemaOf<Values>>(
    () => getValidationSchema(t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, language]
  );

  const handleSubmit = async (values: Values, formikBag: FormikHelpers<Values>) => {
    const result = await onCreate(values);
    if (result) {
      formikBag.resetForm();
    } else {
      // snack(t('message.submit-failed'), 'error');
    }
    formikBag.setSubmitting(false);
  };

  const message = useMemo(() => {
    if (has.activeOrPendingProposal) {
      return t('message.existing-proposal');
    } else if (!has.enoughVote) {
      if (proposalThreshold) {
        return t('message.proposal-threshold', {
          n: proposalThreshold + 1,
        });
      }
      return t('message.not-enough-votes');
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, language, has]);

  return (
    <Root>
      {message && (
        <Alert severity="error" sx={{ width: '100%', mb: 10 }}>
          {message}
        </Alert>
      )}
      <Typography component="h2" color="text.secondary" mb={6}>
        {t('title')}
      </Typography>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          title: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, isValid, /* touched, errors, */ setFieldValue }) => {
          return (
            <Form autoComplete="off" noValidate>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <FieldInput
                    name="title"
                    required
                    fullWidth
                    aria-label={t('field.title.label')}
                    placeholder={t('field.title.placeholder')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FieldInput
                    name="description"
                    /* @ts-expect-error */
                    component="textarea"
                    multiline
                    rows={5}
                    required
                    fullWidth
                    aria-label={t('field.description.label')}
                    placeholder={t('field.description.placeholder')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 15 }}>
                    <FormLabel htmlFor="awiProposalEditorPreview" sx={{ mb: 4 }}>
                      {t('field.preview.label')}
                    </FormLabel>
                    <output id="awiProposalEditorPreview">
                      <ReactMarkdown className="AwiProposalEditor-preview" remarkPlugins={[remarkBreaks]}>
                        {values.description}
                      </ReactMarkdown>
                    </output>
                  </FormControl>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <LoadingButton
                    type="submit"
                    sx={{ whiteSpace: 'nowrap', margin: '0 auto' }}
                    loading={isSubmitting || loading}
                    disabled={!canCreate || isValid || has.activeOrPendingProposal || !has.enoughVote}
                  >
                    {t('create-proposal')}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Root>
  );
};
export default ProposalEditor;
