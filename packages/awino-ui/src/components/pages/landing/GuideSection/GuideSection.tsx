import { Fragment, useMemo } from 'react';

import Image from 'next/image';

import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Header from '@/components/general/Header/Header';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const Root = styled(Section)(({ theme }) => ({
  paddingTop: theme.spacing(88),
  // overflow: 'hidden',
  '.card': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    p: {
      maxWidth: 420,
    },
  },
  h3: {
    marginBottom: theme.spacing(13),
    fontWeight: 400,
  },
  '.step': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(5.5),
    borderRadius: +theme.shape.borderRadius * 2,
    fontWeight: 700,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.transparent,
  },
  '.media1': {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center',
    '.media-card': {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 8, 1, 6),
      margin: theme.spacing(0, 'auto', 6),
      borderRadius: +theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.transparent,
      img: {
        width: 44,
        marginRight: theme.spacing(2),
      },
      p: {
        fontSize: '1.25rem' /* 20px */,
        color: theme.palette.text.primary,
      },
      '&:nth-of-type(1)': {
        transformOrigin: 'top left',
        transform: 'rotate(-10deg)',
      },
      '&:nth-of-type(2)': {
        transformOrigin: 'top left',
        transform: 'translate(0%, 10%) rotate(10deg)',
      },
    },
  },
  '.media2': {
    width: '100%',
    height: '100%',
    '.image': {
      position: 'relative',
      '>span:before': {
        content: '""',
        position: 'absolute',
        top: -30,
        right: -15,
        bottom: -30,
        left: -15,
        // padding: theme.spacing(6),
        backgroundColor: theme.palette.background.transparent,
        borderRadius: +theme.shape.borderRadius * 2,
        transform: 'rotate(5deg)',
      },
      '> span': {
        overflow: 'visible !important',
        '> img': {
          maxWidth: 'initial !important',
          minHeight: 'initial !important',
          maxHeight: 'initial !important',
          height: 'initial !important',
        },
      },
    },
  },
  '.media3': {
    width: '100%',
    height: '100%',
    '.image': {
      position: 'relative',
      '>span:before': {
        content: '""',
        position: 'absolute',
        top: -30,
        right: -15,
        bottom: -30,
        left: -15,
        // padding: theme.spacing(6),
        backgroundColor: theme.palette.background.transparent,
        borderRadius: +theme.shape.borderRadius * 2,
        transform: 'rotate(-5deg)',
      },
      '> span': {
        overflow: 'visible !important',
        '> img': {
          maxWidth: 'initial !important',
          minHeight: 'initial !important',
          maxHeight: 'initial !important',
          height: 'initial !important',
        },
      },
    },
  },
  [theme.breakpoints.up('md')]: {
    '.media1': {
      '.media-card': {
        borderRadius: +theme.shape.borderRadius * 4,
        img: {
          width: 84,
        },
        p: {
          fontSize: '1.875rem' /* 30px */,
        },
        '&:nth-of-type(2)': {
          transform: 'translate(20%, 10%) rotate(10deg)',
        },
      },
    },
    '.media2': {
      position: 'relative',
      '.image': {
        position: 'absolute',
        top: '-20%',
        right: 0,
        bottom: '-20%',
        left: '-20%',
      },
    },
    '.media3': {
      position: 'relative',
      '.image': {
        position: 'absolute',
        top: '-20%',
        right: 0,
        bottom: '-20%',
        left: '-20%',
      },
    },
  },
}));

const items = [1, 2, 3];

export default function GuideSection() {
  const t = usePageTranslation();

  const itemsMedia = useMemo(
    () => ({
      1: (
        <div className="media1">
          <div className="media-card">
            <img src={`images/wallets/metamask.svg`} alt="" />
            <Typography>{t('guide-section.items.0.metamask')}</Typography>
          </div>
          <div className="media-card">
            <img src={`images/wallets/wallet-connect.svg`} alt="" />
            <Typography>{t('guide-section.items.0.wallet-connect')}</Typography>
          </div>
        </div>
      ),
      2: (
        <div className="media2">
          <div className="image">
            <Image src="/images/pages/landing/guide1.png" alt="" width="834" height="490" placeholder="empty" />
          </div>
        </div>
      ),
      3: (
        <div className="media3">
          <div className="image">
            <Image src="/images/pages/landing/guide2.png" alt="" width="834" height="490" placeholder="empty" />
          </div>
        </div>
      ),
    }),
    [t]
  );
  return (
    <>
      <Root>
        <Header title={t('guide-section.title')} description={t('guide-section.description')} />
        <Container maxWidth="lg">
          {items.map((id, index) => (
            <Grid key={index} container spacing={17} mb={index !== items.length - 1 ? [10, 10, 56] : 0}>
              <Grid item xs={12} md={6} order={[0, 0, index % 2 !== 0 ? 1 : 0]}>
                <div className="card">
                  <Typography className="step" variant="body-xs">
                    {id}
                  </Typography>
                  <Typography variant="h3">{t(`guide-section.items.${index}.title`)}</Typography>
                  <Typography>{t(`guide-section.items.${index}.description`)}</Typography>
                </div>
              </Grid>
              <Grid key={index} item xs={12} md={6}>
                {itemsMedia[id]}
              </Grid>
            </Grid>
          ))}
        </Container>
      </Root>
    </>
  );
}
