import clsx from 'clsx';

import { Box, BoxProps, BoxTypeMap, Button, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import Address from '@/components/general/Address/Address';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ContractInfo } from '@/types/app';

export interface ContractCardProps extends Partial<BoxProps> {
  item: ContractInfo;
  // mode?: 'row' | 'card';
}

const ContractCard = styled(
  ({ item, className, ...restOfProps }: ContractCardProps) => {
    const { key, address } = item;
    const t = usePageTranslation();

    const handleAdd = async () => {
      console.log(item)
       await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: item.address, // The address that the token is at.
            symbol: item.key, // A ticker symbol or shorthand, up to 5 chars.
            decimals: item.decimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });
    };
    return (
      <Box className={clsx(className, 'AwiContactCard-root')} {...restOfProps}>
        <div className="AwiContactCard-left">
          <img src={`/images/assets/${key}.svg`} alt="" className="AwiContactCard-icon" />
          <div>
            <Typography color="text.primary">{t(`contract-section.assets.${key}.title`)}</Typography>
            <Address address={address} />
            <Typography variant="body-sm">{t(`contract-section.assets.${key}.description`)}</Typography>
          </div>
        </div>
        <Button
          variant="outlined"
          className="AwiContactCard-add"
          color="primary"
          size="small"
          startIcon={<img src={`images/wallets/metamask.svg`} alt="" />}
          onClick={handleAdd}
        >
          {t('contract-section.add-to-wallet')}
        </Button>
      </Box>
    );
  },
  {
    shouldForwardProp: (prop) => prop !== 'mode',
  }
)(
  /* <ContractCardProps> */ ({ theme /* , mode = 'row' */ }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(10),
    padding: theme.spacing(10, 0, 9),
    // ...(mode === 'card'
    //   ? {
    //       padding: theme.spacing(10.5, 8, 9, 12),
    //       borderRadius: +theme.shape.borderRadius * 5,
    //       backgroundColor: theme.palette.background.transparent,
    //     }
    //   : {
    //       padding: theme.spacing(10, 0, 9),
    //     }),
    '.AwiContactCard-left': {
      display: 'flex',
      flexDirection: 'row',
    },
    '.AwiContactCard-icon': {
      position: 'relative',
      top: -4,
      width: 30,
      height: 30,
      marginRight: theme.spacing(3),
    },
    '.AwiContactCard-add': {
      margin: '0 0 0 auto',
      img: {
        width: 32,
        height: 32,
      },
    },
    p: { fontWeight: 500 },
  })
);

export default ContractCard as OverridableComponent<BoxTypeMap<ContractCardProps, 'div'>>;
