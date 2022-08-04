import React, { useMemo, useState } from 'react';

import { TFunction, useTranslation } from 'next-i18next';

import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { Button, InputAdornment, Typography, InputBase as Input } from '@mui/material';
import { styled } from '@mui/material/styles';

import dateIO from '@/app/dateIO';
import FieldInput from '@/components/fields/FieldInput/FieldInput';
import FieldRadio from '@/components/fields/FieldRadio/FieldRadio';
import Card from '@/components/general/Card/Card';
import Label from '@/components/general/Label/Label';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import { NumberFormatCustom } from '@/components/inputs/NumberInput/NumberInput';
import usePageTranslation from '@/hooks/usePageTranslation';
import useSnack from '@/hooks/useSnack';
import useYupLocales from '@/hooks/useYupLocales';
import { formatAWI, formatDate } from '@/lib/formatters';
import { Option } from '@/types/app';

const Root = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '.Awi-expand': {
    flex: 1,
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  '.AwiGenerateCard-balance': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(0, 2, 0),
    margin: theme.spacing(2, 0, 11),
  },
  // '.AwiGenerateCard-lockUntil': {
  // display: 'grid',
  // gridTemplateColumns: '1fr 1fr 1fr',
  // },
  '.AwiGenerateCard-note': {
    margin: theme.spacing(4, 0),
    p: {
      display: 'inline-block',
      padding: theme.spacing(4, 5),
      borderRadius: +theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.main,
    },
  },
  [theme.breakpoints.up('sm')]: {
    '.AwiGenerateCard-note': {
      position: 'relative',
      p: {
        position: 'absolute',
        right: 0,
        transform: 'translateY(-50%)',
      },
    },
  },
}));

const LOCK_UNTIL_OPTIONS = [
  { value: 1, i18nKey: 'month' },
  { value: 3, i18nKey: 'months' },
  { value: 6, i18nKey: 'months' },
  { value: 12, i18nKey: 'year' },
  { value: 24, i18nKey: 'years' },
  { value: 36, i18nKey: 'max' },
];
const LOCK_UNTIL_VALUES = LOCK_UNTIL_OPTIONS.map((m) => m.value);

const getValidationSchema = (t: TFunction, { awinoBalance }: { awinoBalance: number }) => {
  return Yup.object({
    amount: Yup.number().min(0).max(awinoBalance).required().label(t('field.amount.name')),
    lockUntil: Yup.number().oneOf(LOCK_UNTIL_VALUES).required().label(t('field.lockUntil.name')),
  }) as Yup.SchemaOf<Values>;
};

interface Values {
  amount: number;
  lockUntil: number;
}

interface Props {
  awinoBalance: number;
}

let resError = 0;

export default function GenerateCard({ awinoBalance }: Props) {
  const t = usePageTranslation({ keyPrefix: 'details-section.generate-card' });
  const {
    t: tRaw,
    i18n: { language },
  } = useTranslation();

  const snack = useSnack();

  // const [loading, setLoading] = useState(false);
  // const [done, setDone] = useState(false);

  useYupLocales();

  const validationSchema = useMemo<Yup.SchemaOf<Values>>(
    () => getValidationSchema(t, { awinoBalance }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, language, awinoBalance]
  );

  const { lockUntilOptions } = useMemo(() => {
    return {
      lockUntilOptions: LOCK_UNTIL_OPTIONS.map(({ value, i18nKey }) => ({
        value,
        label: t(`field.lockUntil.value.${i18nKey}`, { v: value < 12 ? value : value / 12 }),
      })) as Option[],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, t]);

  const handleSubmit = async (values: Values, formikBag: FormikHelpers<Values>) => {
    // setLoading(true);
    // setDone(false);

    // cast values, so request do not consist of extra values
    const castValues = validationSchema.cast(values);

    try {
      const res = await new Promise<{ error: boolean; result: Record<string, any> }>((res) =>
        // TODO PROTOTYPE
        setTimeout(() => {
          res({ error: !resError++, result: {} });
        }, 4000)
      );
      if (res.error) {
        snack(t('message.submit-failed'), 'error');
      } else {
        snack(t('message.submit-succeeded'));
        formikBag.resetForm();
        // setDone(true);
      }
    } catch (error) {
      snack(t('message.submit-failed'), 'error');
    } finally {
      // setLoading(false);
      formikBag.setSubmitting(false);
    }
  };

  return (
    <Root>
      <Label className="AwiDetailsSection-cardTitle" tooltip={t(`title-hint`)}>
        {t(`title`)}
      </Label>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          amount: undefined,
          lockUntil: undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, /* touched, errors, */ setFieldValue }) => {
          return (
            <>
              <Form autoComplete="off" noValidate style={{ width: '100%' }}>
                <FieldInput
                  name="amount"
                  required
                  fullWidth
                  aria-label={t('field.amount.label')}
                  placeholder={t('field.amount.placeholder')}
                  inputComponent={NumberFormatCustom as any}
                  startAdornment={<img src={`/images/assets/awi.svg`} alt="" width={30} height={30} />}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        variant="outlined"
                        onClick={() => setFieldValue('amount', `${awinoBalance}`)}
                        className="AwiGenerateCard-max"
                      >
                        {tRaw('common.max')}
                      </Button>
                    </InputAdornment>
                  }
                />
                <Typography variant="body-xs" fontWeight={500} className="AwiGenerateCard-balance">
                  <span>{t('awino-balance')}</span>
                  <span>{formatAWI(awinoBalance)}</span>
                </Typography>
                <div className="AwiGenerateCard-note">
                  <Typography variant="body-xs" color="text.active">
                    {t(`note`)}
                  </Typography>
                </div>
                <FieldRadio
                  name="lockUntil"
                  // className="AwiGenerateCard-lockUntil"
                  required
                  fullWidth
                  options={lockUntilOptions}
                  label={t('field.lockUntil.label')}
                />
                <Input
                  disabled
                  readOnly
                  fullWidth
                  value={+values.lockUntil ? formatDate(dateIO.addMonths(new Date(), +values.lockUntil)) : '-'}
                  sx={{ mt: 3, mb: 8, input: { textAlign: 'center' } }}
                />
                <div className="Awi-expand" />
                <LoadingButton
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  // done={isCompleted}
                >
                  {t('lock-awino')}
                </LoadingButton>
              </Form>
            </>
          );
        }}
      </Formik>
    </Root>
  );
}
