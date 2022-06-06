import { useTranslation } from 'next-i18next';

import { CircularProgress, CircularProgressProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Props {}

const EmptyResult = styled(({ ...props }: Props) => {
  const { t } = useTranslation();
  return <span {...props}>{t('common.no-records')}</span>;
})({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export default EmptyResult;
