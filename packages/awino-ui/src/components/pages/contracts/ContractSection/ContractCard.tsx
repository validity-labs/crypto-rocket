import clsx from 'clsx';

import { Box, BoxProps, BoxTypeMap, Button, Typography } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { styled } from '@mui/material/styles';

import Address from '@/components/general/Address/Address';
import usePageTranslation from '@/hooks/usePageTranslation';
import { ContractInfo } from '@/types/app';

export interface ContractCardProps extends Partial<BoxProps> {
  item: ContractInfo;
  mode?: 'row' | 'card';
}

const ContractCard = styled(
  ({ item, className, ...restOfProps }: ContractCardProps) => {
    const { key, address } = item;
    const t = usePageTranslation();

    const handleAdd = () => {
      console.log('AwiContactCard/handleAdd');
    };
    return (
      <Box className={clsx(className, 'AwiContactCard-root')} {...restOfProps}>
        <div className="AwiContactCard-startBox">
          <img src={`/images/assets/${key}.svg`} alt="" className="AwiContactCard-icon" />
          <div>
            <Typography color="text.primary" mt={2}>
              {t(`contract-section.assets.${key}.title`)}
            </Typography>
            <Address address={address} />
            <Typography variant="body-sm">{t(`contract-section.assets.${key}.description`)}</Typography>
          </div>
        </div>
        <Button
          variant="outlined"
          className="AwiContactCard-add"
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
)<ContractCardProps>(({ theme, mode = 'card' }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(10),

  // marginBottom: theme.spacing(6.5),
  ...(mode === 'card'
    ? {
        padding: theme.spacing(10.5, 8, 9, 12),
        borderRadius: +theme.shape.borderRadius * 5,
        backgroundColor: theme.palette.background.transparent,
      }
    : {
        padding: theme.spacing(10.5, 0, 9, 0),
        margin: theme.spacing(0, 8, 0, 12),
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),

  '.AwiContactCard-startBox': {
    display: 'flex',
    flexDirection: 'row',
  },
  '.AwiContactCard-icon': {
    width: 32,
    height: 32,
    marginRight: theme.spacing(5),
  },
  '.AwiContactCard-add': {
    img: {
      width: 32,
      height: 32,
    },
  },
  p: { fontWeight: 500 },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
}));

export default ContractCard as OverridableComponent<BoxTypeMap<ContractCardProps, 'div'>>;
