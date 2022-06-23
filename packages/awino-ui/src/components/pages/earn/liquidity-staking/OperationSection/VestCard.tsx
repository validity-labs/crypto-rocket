import React, { useCallback, useMemo, useState } from 'react';

import { TFunction, useTranslation } from 'next-i18next';

import BigNumber from 'bignumber.js';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import FieldRadio from '@/components/fields/FieldRadio/FieldRadio';
import LoadingButton from '@/components/general/LoadingButton/LoadingButton';
import SwappingImage from '@/components/general/SwappingImage/SwappingImage';
import usePageTranslation from '@/hooks/usePageTranslation';
import useSnack from '@/hooks/useSnack';
import useYupLocales from '@/hooks/useYupLocales';
import { formatAWI } from '@/lib/formatters';
import { Option } from '@/types/app';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(10, 6),
  border: `1px solid rgba(0, 230, 62, 1)`,
  borderRadius: +theme.shape.borderRadius * 6,
  '.AwiVestCard-balance': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 0, -4),
    ...theme.typography.h5,
    color: theme.palette.text.primary,
  },
  '.AwiLoadingButton-root': {
    margin: theme.spacing(10, 'auto', 0),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 11),
  },
}));

const LOCK_PERIOD_OPTIONS = [
  { value: 1, i18nKey: 'month' },
  { value: 3, i18nKey: 'months' },
  { value: 6, i18nKey: 'months' },
  { value: 12, i18nKey: 'year' },
  { value: 24, i18nKey: 'years' },
  { value: 36, i18nKey: 'max' },
];

const LOCK_PERIOD_VALUES = LOCK_PERIOD_OPTIONS.map((m) => m.value);

const getValidationSchema = (t: TFunction) => {
  return Yup.object({
    lockPeriod: Yup.number().oneOf(LOCK_PERIOD_VALUES).required().label(t('vest-card.field.lockPeriod.name')),
  }) as Yup.SchemaOf<Values>;
};

interface Values {
  lockPeriod: number;
}

interface Props {
  balance: string;
}

export default function VestCard({ balance }: Props) {
  const t = usePageTranslation();
  const {
    t: tRaw,
    i18n: { language },
  } = useTranslation();
  const snack = useSnack();

  const [isCompleted, setIsCompleted] = useState(false);
  useYupLocales();

  const validationSchema = useMemo<Yup.SchemaOf<Values>>(
    () => getValidationSchema(t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, language]
  );

  const handleSubmit = useCallback(
    async (values: Values, formikBag: FormikHelpers<Values>) => {
      try {
        const res = await new Promise<{ error: boolean; result: Record<string, any> }>((res) =>
          // TODO PROTOTYPE
          setTimeout(() => {
            res({ error: false, result: {} });
          }, 4000)
        );
        if (res.error) {
          snack(t('vest-card.message.submit-failed'), 'error');
        } else {
          snack(t('vest-card.message.submit-succeeded'));
          formikBag.resetForm();
          setIsCompleted(true);
        }
      } catch (error) {
        snack(t('vest-card.message.submit-failed'), 'error');
      } finally {
        // setLoading(false);
        formikBag.setSubmitting(false);
      }
    },
    [t, snack]
  );

  const { lockPeriodOptions } = useMemo(() => {
    return {
      lockPeriodOptions: LOCK_PERIOD_OPTIONS.map(({ value, i18nKey }) => ({
        value,
        label: t(`vest-card.field.lockPeriod.value.${i18nKey}`, { v: value < 12 ? value : value / 12 }),
      })) as Option[],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, t]);

  return (
    <Root>
      <div className="AwiVestCard-balance">
        <SwappingImage source="awi" target="usdt" path="assets" />
        <Typography>{formatAWI(balance)}</Typography>
      </div>
      <Typography variant="body-sm" mb={8}>
        {t('vest-card.subtitle')}
      </Typography>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          lockPeriod: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, /* touched, errors, */ setFieldValue }) => {
          const isDisabled = new BigNumber(balance).lte(0) || isSubmitting || isCompleted;

          return (
            <Form autoComplete="off" noValidate style={{ width: '100%' }}>
              <FieldRadio
                name="lockPeriod"
                required
                fullWidth
                options={lockPeriodOptions}
                label={t('vest-card.field.lockPeriod.label')}
                disabled={isDisabled}
              />
              <LoadingButton
                once
                type="submit"
                disabled={isDisabled}
                loading={isSubmitting}
                done={isCompleted}
                size="small"
                variant="outlined"
              >
                {t(isCompleted ? 'vest-card.submit-success' : 'vest-card.submit')}
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
    </Root>
  );
}
