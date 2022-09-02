import React, { useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Web3Provider } from '@ethersproject/providers';
// import { formatEther } from '@ethersproject/units';
import { /* Web3ReactProvider, */ useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
// import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
import clsx from 'clsx';

import CloseIcon from '@mui/icons-material/Close';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Button, Modal, Typography, CircularProgress, Container, Divider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

// import { Spinner } from '../components/Spinner';
import { useAppDispatch } from '@/app/hooks';
import { toggleConnector } from '@/app/state/slices/app';
import {
  injected,
  network,
  walletconnect,
  walletlink,
  // ledger,
  // trezor,
  // lattice,
  // frame,
  // authereum,
  // fortmatic,
  // magic,
  // portis,
  // torus,
} from '@/app/web3/connectors';
import { useEagerConnect, useInactiveListener } from '@/app/web3/hooks';
// import Account from '@/components/web3/Account';
// import Balance from '@/components/web3/Balance';
// import BlockNumber from '@/components/web3/BlockNumber';
// import ChainId from '@/components/web3/ChainId';
// import Status from '@/components/web3/Status';
import { SetState } from '@/types/app';

// eslint-disable-next-line no-unused-vars
const enum ConnectorNames {
  // eslint-disable-next-line no-unused-vars
  Injected = 'Injected',
  // eslint-disable-next-line no-unused-vars
  Network = 'Network',
  // eslint-disable-next-line no-unused-vars
  WalletConnect = 'WalletConnect',
  // eslint-disable-next-line no-unused-vars
  WalletLink = 'WalletLink',
  // Ledger = 'Ledger',
  // Trezor = 'Trezor',
  // Lattice = 'Lattice',
  // Frame = 'Frame',
  // Authereum = 'Authereum',
  // Fortmatic = 'Fortmatic',
  // Magic = 'Magic',
  // Portis = 'Portis',
  // Torus = 'Torus',
}

const connectorsByName: Record<ConnectorNames, any> = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  // [ConnectorNames.Ledger]: ledger,
  // [ConnectorNames.Trezor]: trezor,
  // [ConnectorNames.Lattice]: lattice,
  // [ConnectorNames.Frame]: frame,
  // [ConnectorNames.Authereum]: authereum,
  // [ConnectorNames.Fortmatic]: fortmatic,
  // [ConnectorNames.Magic]: magic,
  // [ConnectorNames.Portis]: portis,
  // [ConnectorNames.Torus]: torus,
};

const connectorInfoMap = {
  [ConnectorNames.Injected]: {
    i18nKey: 'metamask',
    icon: 'metamask.svg',
  },
  [ConnectorNames.WalletConnect]: {
    i18nKey: 'wallet-connect',
    icon: 'wallet-connect.svg',
  },
  [ConnectorNames.WalletLink]: {
    i18nKey: 'coinbase',
    icon: 'coinbase.svg',
  },
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
    //  ||error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

const Root = styled(Modal)(({ theme }) => ({
  padding: theme.spacing(10),
  zIndex: theme.zIndex.modal,
  '.AwiWalletConnect-container': {
    pointerEvents: 'none',
    position: 'relative',
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    outline: 0,
  },
  '.AwiWalletConnect-paper': {
    pointerEvents: 'all',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    // height: '100%',
    maxHeight: '100%',
    paddingBottom: theme.spacing(5),
    border: `1px solid ${theme.palette.text.active}`,
    borderRadius: +theme.shape.borderRadius,
    backgroundColor: theme.palette.background.light,
    overflow: 'hidden',
  },
  '.AwiWalletConnect-header': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(8, 14, 5, 11),
  },
  '.AwiWalletConnect-close': {
    position: 'absolute',
    top: 20,
    right: 17,
  },
  '.AwiWalletConnect-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(5, 14, 11, 11),
    '&::-webkit-scrollbar': {
      borderRadius: +theme.shape.borderRadius * 2,
    },
  },
  '.AwiWalletConnect-connectButton': {
    justifyContent: 'space-between',
    borderRadius: +theme.shape.borderRadius * 6,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.transparent,
    '&.Mui-disabled': {
      color: theme.palette.text.secondary,
    },
    '&.active': {
      color: theme.palette.success.main,
    },
    img: {
      marginRight: theme.spacing(2),
    },
  },
  '.AwiWalletConnect-connectButtonContainer': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

// interface Props {
//   open: boolean;
//   // setOpen: SetState<boolean>;
// }

export default function WalletConnect(/* { open }: Props */) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(toggleConnector(false));

  const context = useWeb3React<Web3Provider>();
  const { connector, /* library, chainId, account, */ activate, deactivate, active, error } = context;
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <Root
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth="sm" className="AwiWalletConnect-container">
        <div className="AwiWalletConnect-paper">
          <div className="AwiWalletConnect-header">
            <Typography variant="h3" component="h2" color="text.active">
              {t('account.connect-your-wallet')}
            </Typography>
            <IconButton
              size="small"
              title={t('common.close-modal')}
              aria-label={t('common.close-modal')}
              className="AwiWalletConnect-close"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className="AwiWalletConnect-content">
            {Object.keys(connectorsByName)
              .filter((f) => f !== ConnectorNames.Network)
              .map((name) => {
                const currentConnector = connectorsByName[name];
                const activating = currentConnector === activatingConnector;
                const connected = currentConnector === connector;
                const disabled = /* !triedEager || */ !!activatingConnector || connected || !!error;

                return (
                  <Button
                    variant="text"
                    className={clsx('AwiWalletConnect-connectButton', { active: connected })}
                    disabled={disabled}
                    key={name}
                    onClick={() => {
                      setActivatingConnector(currentConnector);
                      activate(connectorsByName[name], (error) => {
                        if (error) {
                          setActivatingConnector(undefined);
                        }
                      }).then(() => {
                        handleClose();
                      });
                    }}
                    endIcon={
                      activating ? <CircularProgress /> : connected ? <CloudRoundedIcon color="success" /> : null
                    }
                  >
                    <span className="AwiWalletConnect-connectButtonContainer">
                      <img src={`/images/wallets/${connectorInfoMap[name].icon}`} alt="" width="42" />
                      {t(`connectors.${connectorInfoMap[name].i18nKey}`)}
                    </span>
                  </Button>
                );
              })}
            {/* deactivate */}
            {(active || error) && (
              <>
                <Divider />
                <Button
                  variant="text"
                  onClick={() => {
                    handleClose();
                    deactivate();
                  }}
                  startIcon={<LogoutRoundedIcon />}
                >
                  Deactivate
                </Button>
              </>
            )}
            {/* error */}
            {!!error && <Typography color="error">{getErrorMessage(error)}</Typography>}
          </div>
        </div>
      </Container>
    </Root>
  );
}

// {
//     <>
//       <Status />
//       <ChainId />
//       <BlockNumber />
//       <Account />
//       <Balance />
//       <Divider />
//       {Object.keys(connectorsByName).map((name) => {
//         const currentConnector = connectorsByName[name];
//         const activating = currentConnector === activatingConnector;
//         const connected = currentConnector === connector;
//         const disabled = !triedEager || !!activatingConnector || connected || !!error;

//         return (
//           <Button
//             variant="outlined"
//             disabled={disabled}
//             key={name}
//             onClick={() => {
//               setActivatingConnector(currentConnector);
//               activate(connectorsByName[name], (error) => {
//                 if (error) {
//                   setActivatingConnector(undefined);
//                 }
//               });
//             }}
//           >
//             {activating && <CircularProgress />}
//             {connected && (
//               <span role="img" aria-label="check">
//                 ✅
//               </span>
//             )}
//             {name}
//           </Button>
//         );
//       })}
//       <Divider />
//       {/* deactivate */}
//       {(active || error) && (
//         <Button
//           variant="outlined"
//           onClick={() => {
//             deactivate();
//           }}
//         >
//           Deactivate
//         </Button>
//       )}

//       {/* error */}
//       {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
//       <Divider />
//       {/* aux */}
//       {!!(library && account) && (
//         <Button
//           variant="outlined"
//           onClick={() => {
//             library
//               .getSigner(account)
//               .signMessage('👋')
//               .then((signature: any) => {
//                 window.alert(`Success!\n\n${signature}`);
//               })
//               .catch((error: any) => {
//                 window.alert('Failure!' + (error && error.message ? `\n\n${error.message}` : ''));
//               });
//           }}
//         >
//           Sign Message
//         </Button>
//       )}
//       {!!(connector === connectorsByName[ConnectorNames.Network] && chainId) && (
//         <Button
//           variant="outlined"
//           onClick={() => {
//             (connector as any).changeChainId(chainId === 1 ? 4 : 1);
//           }}
//         >
//           Switch Networks
//         </Button>
//       )}
//       {connector === connectorsByName[ConnectorNames.WalletConnect] && (
//         <Button
//           variant="outlined"
//           onClick={() => {
//             (connector as any).close();
//           }}
//         >
//           Kill WalletConnect Session
//         </Button>
//       )}
//       {connector === connectorsByName[ConnectorNames.WalletLink] && (
//         <Button
//           variant="outlined"
//           onClick={() => {
//             (connector as any).close();
//           }}
//         >
//           Kill WalletLink Session
//         </Button>
//       )}
//       {/* {connector === connectorsByName[ConnectorNames.Fortmatic] && (
//           <button
//             style={{
//               height: '3rem',
//               borderRadius: '1rem',
//               cursor: 'pointer',
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Fortmatic Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.Magic] && (
//           <button
//             style={{
//               height: '3rem',
//               borderRadius: '1rem',
//               cursor: 'pointer',
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Magic Session
//           </button>
//         )}
//         {connector === connectorsByName[ConnectorNames.Portis] && (
//           <>
//             {chainId !== undefined && (
//               <button
//                 style={{
//                   height: '3rem',
//                   borderRadius: '1rem',
//                   cursor: 'pointer',
//                 }}
//                 onClick={() => {
//                   (connector as any).changeNetwork(chainId === 1 ? 100 : 1);
//                 }}
//               >
//                 Switch Networks
//               </button>
//             )}
//             <button
//               style={{
//                 height: '3rem',
//                 borderRadius: '1rem',
//                 cursor: 'pointer',
//               }}
//               onClick={() => {
//                 (connector as any).close();
//               }}
//             >
//               Kill Portis Session
//             </button>
//           </>
//         )}
//         {connector === connectorsByName[ConnectorNames.Torus] && (
//           <button
//             style={{
//               height: '3rem',
//               borderRadius: '1rem',
//               cursor: 'pointer',
//             }}
//             onClick={() => {
//               (connector as any).close();
//             }}
//           >
//             Kill Torus Session
//           </button>
//         )} */}
//     </>
// }
