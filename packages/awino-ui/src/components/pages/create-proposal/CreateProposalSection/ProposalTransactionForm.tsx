import { useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { toWei } from 'web3-utils';
import { isAddress } from 'web3-utils';

import {
  Box,
  Button,
  Chip,
  FormGroup,
  FormLabel,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Step as MuiStep,
  StepLabel,
  Stepper,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { FormControlInput } from '@/components/fields/FieldInput/FieldInput';
import InfoTooltip from '@/components/general/InfoTooltip/InfoTooltip';
import Select, { SelectValueAndOptionDefault } from '@/components/general/Select/Select';
import UploadIcon from '@/components/icons/UploadIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { buildEtherscanAddressLink } from '@/lib/etherscan';

import { ProposalTransaction } from './CreateProposalSection';
import { StepConnector, StepIconComponent } from './Stepper';

const Root = styled(Box)(({ theme }) => ({
  '.AwiFormControlInput-typeFile': {
    '.AwiFormControlInput-typeFileLabel': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      ...theme.typography['body-sm'],
      fontWeight: 700,
      color: theme.palette.text.secondary,
    },
    '.AwiFormControlInput-typeFileOutput': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(3.5, 6, 3),
      ...theme.typography['body-xl'],
      lineHeight: 2,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.transparent,
      borderRadius: +theme.shape.borderRadius * 2,
      '&:focus, &:focus-visible, &:hover': {
        cursor: 'pointer',
        boxShadow: `0px 0 3px 1px ${theme.palette.primary.main}`,
        outline: 'none',
        svg: {
          color: theme.palette.text.active,
        },
      },
      svg: {
        transition: 'color 200ms ease-in',
        color: theme.palette.text.secondary,
      },
      '&.Mui-error': {
        '.AwiFormControlInput-typeFileOutput': {
          boxShadow: `0px 0 3px 1px ${theme.palette.error.main}`,
        },
      },
    },
    '&.Awi-filled': {
      '.AwiFormControlInput-typeFileOutput': {
        color: theme.palette.text.primary,
      },
    },
    '.MuiInputBase-root': {
      display: 'none',
      appearance: 'none',
    },
  },
  '.MuiFormGroup-root': {
    gap: theme.spacing(6),
    marginLeft: theme.spacing(4),
  },
  '.MuiTableBody-root .MuiTableRow-root:last-of-type': {
    borderTop: '0 !important',
  },
  [theme.breakpoints.up('md')]: {},
}));

export const CURRENCY: string = process.env.REACT_APP_CURRENCY ?? 'ETH';

interface ProposalTransactionFormProps {
  onCreate: (transaction: ProposalTransaction) => void;
}

const ProposalTransactionForm = ({ onCreate }: ProposalTransactionFormProps) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction-form' });

  const [address, setAddress] = useState('');
  const [abi, setABI] = useState({ functions: { call: {}, getBalance: {} } }); /* Interface */
  const [value, setValue] = useState('');
  const [func, setFunction] = useState('');
  const [args, setArguments] = useState<string[]>([]);

  const [isABIUploadValid, setABIUploadValid] = useState<boolean>();
  const [abiFileName, setABIFileName] = useState<string | undefined>('');

  const [activeStep, setActiveStep] = useState(0);
  const [stepHasError, setStepHasError] = useState(false);

  const addressValidator = (s: string) => {
    if (!isAddress(s)) {
      return false;
    }
    // To avoid blocking stepper progress, do not `await`
    populateABIIfExists(s);
    return true;
  };

  const valueValidator = (v: string) => !v || !new BigNumber(v).isNaN();

  const argumentsValidator = (a: string[]) => {
    if (!func) {
      return true;
    }

    try {
      return true;
      // return !!abi?._encodeParams(abi?.functions[func]?.inputs, args);
    } catch {
      return false;
    }
  };

  const setArgument = (index: number, value: string) => {
    const values = [...args];
    values[index] = value;
    setArguments(values);
  };

  let abiErrorTimeout: NodeJS.Timeout;
  const setABIInvalid = () => {
    setABIUploadValid(false);
    setABIFileName(undefined);
    abiErrorTimeout = setTimeout(() => {
      setABIUploadValid(undefined);
    }, 5_000);
  };

  const validateAndSetABI = (file: File | undefined) => {
    if (abiErrorTimeout) {
      clearTimeout(abiErrorTimeout);
    }
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const abi = e?.target?.result?.toString() ?? '';
        // setABI(new Interface(JSON.parse(abi)));
        setABI(JSON.parse(abi));
        setABIUploadValid(true);
        setABIFileName(file.name);
      } catch {
        setABIInvalid();
      }
    };
    reader.readAsText(file);
  };

  // const getContractInformation = async (address: string) => {
  //   const response = await fetch(buildEtherscanApiQuery(address));
  //   const json = await response.json();
  //   return json?.result?.[0];
  // };

  // const getABI = async (address: string) => {
  //   let info = await getContractInformation(address);
  //   if (info?.Proxy === '1' && utils.isAddress(info?.Implementation)) {
  //     info = await getContractInformation(info.Implementation);
  //   }
  //   return info.ABI;
  // };

  const populateABIIfExists = async (address: string) => {
    if (abiErrorTimeout) {
      clearTimeout(abiErrorTimeout);
    }

    // try {
    //   const result = await getABI(address);
    //   setABI(new Interface(JSON.parse(result)));
    //   setABIUploadValid(true);
    //   setABIFileName('etherscan-abi-download.json');
    // } catch {
    //   setABIUploadValid(undefined);
    //   setABIFileName(undefined);
    // }
  };

  const stepForwardOrCallback = () => {
    if (activeStep !== steps.length - 1) {
      const isValid = typeof steps[activeStep]?.validator !== 'undefined' ? steps[activeStep]?.validator() : true;
      console.log(isValid, steps, activeStep);
      if (isValid) {
        setStepHasError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setStepHasError(true);
      }
    } else {
      onCreate({
        address,
        value: value ? toWei(value) : '0',
        signature: func,
        /* TODO encode params */
        // calldata: (func && abi?._encodeParams(abi?.functions[func]?.inputs, args)) || '0x',
        calldata: 'todo',
      });
      clearState();
    }
  };

  const steps = [
    {
      label: t('step.address'),
      name: 'address',
      validator: () => addressValidator(address),
    },
    {
      label: t('step.value'),
      name: 'value',
      validator: () => valueValidator(value),
    },
    {
      label: t('step.function'),
      name: 'function',
    },
    {
      label: t('step.arguments'),
      name: 'arguments',
      validator: () => argumentsValidator(args),
    },
    {
      label: t('step.summary'),
      name: 'summary',
    },
  ];

  const clearState = () => {
    setAddress('');
    setABI(undefined);
    setValue('');
    setFunction('');
    setArguments([]);
    setABIUploadValid(undefined);
    setABIFileName(undefined);
    setActiveStep(0);
  };

  const uploadRef = useRef<HTMLLabelElement>();
  const handleUploadToggle = (event) => {
    const code = event.charCode || event.keyCode;
    if (code === 32 && uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const options = Object.keys(abi?.functions || {}).reduce((ar, r) => {
    ar.set(r, { id: r, label: r });
    return ar;
  }, new Map());

  const inputs = abi?.functions[func]?.inputs || [];
  const none = t('none');

  return (
    <Root>
      <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnector />}>
        {steps.map((step, stepIndex) => (
          <MuiStep key={stepIndex}>
            <StepLabel error={stepIndex === activeStep && stepHasError} StepIconComponent={StepIconComponent}>
              {step.label}
            </StepLabel>
          </MuiStep>
        ))}
      </Stepper>
      <Box sx={{ my: 15, px: 10 }}>
        <Collapse in={activeStep === 0} appear>
          <FormControlInput fullWidth required>
            <FormLabel htmlFor="awiProposalTransactionFormAddress">
              {t('field.address')}
              <InfoTooltip text={t('field.address-help')} />
            </FormLabel>
            <InputBase
              id="awiProposalTransactionFormAddress"
              value={address}
              type="text"
              name="address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormControlInput>
        </Collapse>
        <Collapse in={activeStep === 1} appear>
          <FormControlInput fullWidth>
            <FormLabel htmlFor="awiProposalTransactionFormValue">
              {t('field.value')}
              <InfoTooltip text={t('field.value-help')} />
            </FormLabel>
            <InputBase
              id="awiProposalTransactionFormValue"
              value={value}
              type="text"
              // name="value"
              onChange={(e) => {
                console.log(e.target.value);
                setValue(e.target.value);
              }}
            />
          </FormControlInput>
        </Collapse>
        <Collapse in={activeStep === 2} appear>
          <Select
            id="awiProposalTransactionFormFunction"
            items={options}
            value={func}
            setValue={setFunction}
            label={
              <>
                {t('field.function')}
                <InfoTooltip text={t('field.function-help')} />
              </>
            }
            placeholder={t('field.function-default')}
            ValueComponent={SelectValueAndOptionDefault}
            OptionComponent={SelectValueAndOptionDefault}
            formControlProps={{
              fullWidth: true,
              sx: { mb: 10 },
            }}
          />
          <FormControlInput
            fullWidth
            error={!isABIUploadValid}
            className={clsx('AwiFormControlInput-typeFile', { 'Awi-filled': isABIUploadValid })}
          >
            <FormLabel htmlFor="awiProposalTransactionFormImportAbi" ref={uploadRef}>
              <span className="AwiFormControlInput-typeFileLabel">
                {t('field.abi')}
                <InfoTooltip text={t('field.abi-help')} />
              </span>
              <span
                role="button"
                className="AwiFormControlInput-typeFileOutput"
                tabIndex={0}
                onKeyPress={handleUploadToggle}
              >
                {abiFileName ? abiFileName : t('field.abi-placeholder')}
                <UploadIcon color="inherit" />
              </span>
            </FormLabel>
            <InputBase
              name="abi"
              type="file"
              id="awiProposalTransactionFormImportAbi"
              // value={value}
              inputProps={{
                accept: 'application/json',
              }}
              // isValid={isABIUploadValid}
              // isInvalid={isABIUploadValid === false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => validateAndSetABI(e.target.files?.[0])}
            />
          </FormControlInput>
        </Collapse>
        <Collapse in={activeStep === 3} appear>
          {/* @ts-expect-error */}
          <FormControlInput fullWidth component="fieldset">
            <FormLabel htmlFor="awiProposalTransactionFormValue" component="legend">
              {t('field.arguments')}
              <InfoTooltip text={t('field.arguments-help')} />
            </FormLabel>
            <FormGroup>
              {inputs.map(({ name, type }, inputIndex) => (
                <FormControlInput key={inputIndex} fullWidth>
                  <FormLabel htmlFor="awiProposalTransactionFormValue">{name}</FormLabel>
                  <InputBase
                    id="awiProposalTransactionFormValue"
                    type="text"
                    startAdornment={<Chip size="small" variant="outlined" label={type} color="default" sx={{ p: 2 }} />}
                    value={args?.[inputIndex] ?? ''}
                    onChange={(e) => setArgument(inputIndex, e.target.value)}
                  />
                </FormControlInput>
              ))}
              <Typography>{!inputs.length && t('no-argument-required')}</Typography>
            </FormGroup>
          </FormControlInput>
        </Collapse>
        <Collapse in={activeStep === 4} appear>
          <Typography variant="body-sm" color="text.primary" fontWeight={700}>
            {t('field.summary')}
            <InfoTooltip text={t('field.summary-help')} />
          </Typography>
          <TableContainer>
            <Table aria-label={t('csummary-aria-label')}>
              <TableBody>
                <TableRow>
                  <TableCell variant="head" component="th" scope="row">
                    {t('step.address')}
                  </TableCell>
                  <TableCell align="right">
                    <a href={buildEtherscanAddressLink(address)} target="_blank" rel="noreferrer">
                      {address}
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" component="th" scope="row">
                    {t('step.value')}
                  </TableCell>
                  <TableCell align="right">{value ? `${value} ${CURRENCY}` : none}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" component="th" scope="row">
                    {t('step.function')}
                  </TableCell>
                  <TableCell align="right">{func || none}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" component="th" scope="row">
                    {t('step.arguments')}
                  </TableCell>
                  <TableCell align="right">{abi?.functions[func]?.inputs?.length ? '' : none}</TableCell>
                </TableRow>
                {(abi?.functions[func]?.inputs || []).map((input, i) => (
                  <TableRow key={i}>
                    <TableCell variant="head" component="th" scope="row">
                      {`${i + 1}. ${input.name}`}
                    </TableCell>
                    <TableCell align="right">{args[i]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
      <Box className="Awi-row Awi-between" px={10}>
        <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
          {t('back')}
        </Button>
        <Button variant="outlined" onClick={stepForwardOrCallback}>
          {activeStep !== steps.length - 1 ? t('next') : t('add-transaction')}
        </Button>
      </Box>
    </Root>
  );
};

export default ProposalTransactionForm;
