import { useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Step, StepProgressBar, useStepProgress, withStepProgress } from 'react-stepz';

import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { isAddress } from 'web3-utils';

import { ArrowBackRounded, ArrowForwardRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputBase,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { FormControlInput } from '@/components/fields/FieldInput/FieldInput';
import { FormControlSelect, MenuItemSelect } from '@/components/fields/FieldSelect/FieldSelect';
import InfoTooltip from '@/components/general/InfoTooltip/InfoTooltip';
import Modal from '@/components/general/Modal/Modal';
import DropdownArrowIcon from '@/components/icons/DropdownArrowIcon';
import ExpandIcon from '@/components/icons/ExpandIcon';
import UploadIcon from '@/components/icons/UploadIcon';
import usePageTranslation from '@/hooks/usePageTranslation';
import { buildEtherscanAddressLink } from '@/lib/etherscan';

import { ProposalTransaction } from './CreateProposalSection';
import StepProgress from './StepProgress';
// import { Vote } from './VoteCard';

const Root = styled(Box)(({ theme }) => ({
  '.MuiFormControl-root': {
    '.MuiFormLabel-root': {
      marginBottom: theme.spacing(1),
    },
  },
  '.AwiFormControlInput-typeFile': {
    '.AwiFormControlInput-typeFileLabel': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      ...theme.typography['body-sm'],
      fontWeight: 700,
      color: theme.palette.text.primary,
    },

    // '.MuiInputBase-input': {
    //   minWidth: 60,
    //   // padding: theme.spacing(5, 8, 4.5),
    //   padding: theme.spacing(1, 2),
    //   boxSizing: 'border-box',
    // },
    '.AwiFormControlInput-typeFileOutput': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(4.5, 6, 4),
      ...theme.typography['body-xl'],
      lineHeight: 2,
      // color: '#37505C',
      color: theme.palette.text.secondary,
      // flexWrap: "wrap",
      backgroundColor: theme.palette.background.transparent,
      borderRadius: +theme.shape.borderRadius * 2,
      // padding: theme.spacing(3, 3.5, 3, 7),

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
      // '&.MuiInputBase-adornedStart > svg:first-of-type': {
      //   pointerEvents: 'none',
      //   padding: theme.spacing(5, 4, 5, 4.5),
      //   borderRight: '1px solid #262F40',
      //   fontSize: '34px',
      //   color: '#313b4e',
      //   boxSizing: 'content-box',
      // },
      // '&.Mui-focused.MuiInputBase-adornedStart > svg:first-of-type': {
      //   color: theme.palette.background.lighter,
      // },

      // '& .MuiInputAdornment-positionEnd button': {
      //   padding: theme.spacing(1, 3),
      //   border: `1px solid ${theme.palette.text.secondary}`,
      //   ...theme.typography['body-sm'],
      //   color: theme.palette.text.secondary,
      //   '&:hover': {
      //     borderWidth: 1,
      //     color: theme.palette.text.primary,
      //   },
      // },

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
    // '.MuiFormControl-root': {

    // },
  },
  [theme.breakpoints.up('md')]: {},
}));

// interface VoteModalProps {
//   show: boolean;
//   onHide: () => void;
//   onVote: () => void;
//   isLoading: boolean;
//   proposalId: string | undefined;
//   availableVotes: number | undefined;
//   vote: Vote | undefined;
// }
export const CURRENCY: string = process.env.REACT_APP_CURRENCY ?? 'ETH';

interface ProposalTransactionFormProps {}

const ProposalTransactionForm = ({}: ProposalTransactionFormProps) => {
  const t = usePageTranslation({ keyPrefix: 'proposal-transaction-form' });

  // const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [abi, setABI] = useState({ functions: { call: {}, getBalance: {} } }); /* Interface */
  const [value, setValue] = useState('');
  const [func, setFunction] = useState('');
  const [args, setArguments] = useState<string[]>([]);

  const [isABIUploadValid, setABIUploadValid] = useState<boolean>();
  const [abiFileName, setABIFileName] = useState<string | undefined>('');

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
    if (currentStep !== steps.length - 1) {
      return stepForward();
    }
    // onProposalTransactionAdded({
    //   address,
    //   value: value ? utils.parseEther(value).toString() : '0',
    //   signature: func,
    //   calldata: (func && abi?._encodeParams(abi?.functions[func]?.inputs, args)) || '0x',
    // });
    // clearState();
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

  const { stepForward, stepBackwards, currentStep } = useStepProgress({
    steps,
    startingStep: 3,
  });

  // const clearState = () => {
  //   setAddress('');
  //   setABI(undefined);
  //   setValue('');
  //   setFunction('');
  //   setArguments([]);
  //   setABIUploadValid(undefined);
  //   setABIFileName(undefined);

  //   for (let i = currentStep; i > 0; i--) {
  //     stepBackwards();
  //   }
  // };

  // const handleClose = () => {
  //   onHide();
  //   clearState();
  // };

  // const none = t('common.none');

  // const title = t(`vote.${vote}`, { id: proposalId });

  const uploadRef = useRef<HTMLLabelElement>();
  const handleUploadToggle = (event) => {
    const code = event.charCode || event.keyCode;
    if (code === 32 && uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const options = Object.keys(abi?.functions || {});
  const inputs = abi?.functions[func]?.inputs || [];
  const none = t('none');
  return (
    <Root>
      <StepProgress steps={steps} />
      <Box sx={{ my: 15, px: 10 }}>
        <Step step={0}>
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
        </Step>
        <Step step={1}>
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
        </Step>
        <Step step={2}>
          <FormControlSelect fullWidth sx={{ mb: 10 }}>
            <FormLabel htmlFor="awiProposalTransactionFormFunction">
              {t('field.function')}
              <InfoTooltip text={t('field.function-help')} />
            </FormLabel>
            <Select
              id="awiProposalTransactionFormFunction"
              // id={inputId}
              // error={hasError}
              // // labelId
              // variant="filled"
              disableUnderline
              // aria-describedby={`${inputId}Helper`}
              // // required={required}
              placeholder={t('field.function-default')}
              // // margin="dense"
              fullWidth
              displayEmpty
              IconComponent={ExpandIcon}
              MenuProps={{
                sx: {},
                PaperProps: {
                  sx: {
                    py: 4,
                    marginTop: 2,
                    backgroundColor: '#112333',
                    borderColor: 'text.active',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: 3,
                  },
                },
                MenuListProps: {
                  disablePadding: true,
                },
                // getContentAnchorEl: null,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              value={func}
              onChange={(e) => setFunction(e.target.value)}
              renderValue={(value) => {
                return (
                  <Typography className="MuiSelect-value">
                    {/* {loading ? (
                      <CircularProgress size={20} />
                    ) : ( */}
                    <>{value ? <>{value}</> : <>{t('field.function-default')}</>}</>
                    {/* )} */}
                  </Typography>
                );
              }}
              // startAdornment={
              //   Icon && <InputAdornment position="start">{/* <Icon style={{ fontSize: 20 }} /> */}</InputAdornment>
              // }
              // {...field}
              // {...props}
            >
              <MenuItemSelect /* disabled */ value="">
                <span className="placeholder">{t('field.function-default')}</span>
              </MenuItemSelect>
              {abi &&
                options.map((option, optionIndex) => (
                  <MenuItemSelect key={optionIndex} value={option}>
                    {option}
                  </MenuItemSelect>
                ))}
            </Select>
          </FormControlSelect>
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
          {/*
          <Form.Group controlId="import-abi">
            <Form.Label></Form.Label>
            <Form.Control
              type="file"
              accept="application/JSON"
              isValid={isABIUploadValid}
              isInvalid={isABIUploadValid === false}
              onChange={(e: ChangeEvent<HTMLInputElement>) => validateAndSetABI(e.target.files?.[0])}
            />
          </Form.Group> */}
        </Step>
        <Step step={3}>
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
                    // value={value}
                    // onChange={(e) => setValue(e.target.value)}
                  />
                </FormControlInput>
              ))}
              <Typography>{!inputs.length && t('no-argument-required')}</Typography>
            </FormGroup>
          </FormControlInput>
          {/* <Box>

          </Box>
          {abi?.functions[func]?.inputs?.length ? (
            <FormGroup as={Row}>
              {abi?.functions[func]?.inputs.map((input, i) => (
                <>
                  <FormLabel column sm="3">
                    {input.name}
                  </FormLabel>
                  <Col sm="9">
                    <InputGroup className="mb-2">
                      <InputGroup.Text>{input.type}</InputGroup.Text>
                      <FormControl value={args[i] ?? ''} onChange={(e) => setArgument(i, e.target.value)} />
                    </InputGroup>
                  </Col>
                </>
              ))}
            </FormGroup>
          ) : (
            t('no-argument-required')
          )} */}
        </Step>
        <Step step={4}>
          <Typography variant="body-sm" color="text.primary" fontWeight={700}>
            {t('field.summary')}
            <InfoTooltip text={t('field.summary-help')} />
          </Typography>
          <TableContainer
            sx={
              {
                // border: '1px solid rgba(24, 37, 44, 0.04)',
                // borderRadius: 2,
                // mb: 10,
                // '& td, & th': { border: 0 },
                // '& th': { fontWeight: 700 },
                // '& tr:nth-of-type(even)': {
                //   backgroundColor: 'rgba(0, 104, 255, 0.04)',
                // },
              }
            }
          >
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
                {abi?.functions[func]?.inputs.map((input, i) => (
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
        </Step>
      </Box>
      <Box className="Awi-row Awi-between" px={10}>
        <Button variant="outlined" disabled={currentStep === 0} onClick={stepBackwards}>
          {t('back')}
        </Button>
        <Button variant="outlined" onClick={stepForwardOrCallback}>
          {currentStep !== steps.length - 1 ? t('next') : t('add-transaction')}
        </Button>
      </Box>
    </Root>
  );
};

export default ProposalTransactionForm;
