import * as React from 'react';

import { PriorityHighRounded } from '@mui/icons-material';
import CheckRounded from '@mui/icons-material/CheckRounded';
import MuiStepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { styled } from '@mui/material/styles';

export const StepConnector = styled(MuiStepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 33,
    left: 'calc(-50% + 43px)',
    right: 'calc(50% + 43px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#9ADE8E',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.common.white,
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean; error?: boolean } }>(
  ({ theme, ownerState }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 66,
    height: 66,
    padding: 0,
    borderRadius: '100%',
    ...theme.typography['body-xl'],
    lineHeight: 1,
    fontWeight: 600,
    color: theme.palette.background.light,
    backgroundColor: '#EFF4FF', // 'rgba(24, 37, 44, 0.32)',
    transition: 'all 500ms ease-in-out',
    ...(ownerState.active && {
      backgroundColor: theme.palette.primary.main,
    }),
    ...(ownerState.completed && {
      backgroundColor: '#9ADE8E',
    }),
    ...(ownerState.error && {
      backgroundColor: theme.palette.error.main,
    }),
  })
);

export function StepIconComponent(props: StepIconProps) {
  const { active, completed, error, icon, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active, completed, error }} className={className}>
      {error ? <PriorityHighRounded /> : completed ? <CheckRounded /> : icon}
    </QontoStepIconRoot>
  );
}
