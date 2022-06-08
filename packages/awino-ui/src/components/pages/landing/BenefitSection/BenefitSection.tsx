import { useRef } from 'react';

import { A11y, Navigation } from 'swiper';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';

import { ArrowForwardOutlined } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/* @ts-ignore */
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/navigation';
import Header from '@/components/general/Header/Header';
import Section from '@/components/layout/Section/Section';
import usePageTranslation from '@/hooks/usePageTranslation';

const StyledSection = styled(Section)(({ theme }) => ({
  paddingTop: 0,
  '> .MuiContainer-root': {
    position: 'relative',
    paddingTop: theme.spacing(50),
  },
  '.MuiTypography-root': {
    whiteSpace: 'pre-line',
  },
  '.swiper': {
    padding: theme.spacing(10, 0),
  },
  // '.swiper-wrapper': {
  //   alignItems: 'flex-end',
  // },
  // '.swiper-slide': {
  //   width: 'auto',
  // },
  '.AwiBenefitSlide-root': {
    padding: theme.spacing(0, 6),
    position: 'relative',

    '>div': {
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '420px',
      height: '100%',
      minHeight: 370,
      padding: theme.spacing(14, 10.5),
      margin: '0 auto',
      borderRadius: +theme.shape.borderRadius * 5,
      boxShadow: '0px 3px 6px #00000029',
      backgroundColor: theme.palette.background.darker,
      '&:before': {
        content: '""',
        position: 'absolute',
        top: -5,
        left: -5,
        right: -5,
        bottom: -5,
        borderRadius: +theme.shape.borderRadius * 6,
        background: ['rgb(0,255,235)', 'linear-gradient(154deg, rgba(0,255,235,1) 0%, rgba(0,230,62,1) 100%)'],
        zIndex: -1,
      },
    },
    h3: {
      marginBottom: theme.spacing(7),
      fontWeight: 400,
    },
  },
  '.AwiBenefitSection-navigation': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  '.AwiBenefitSection-navigationPrev': {
    svg: {
      transform: 'rotate(180deg)',
    },
  },
  '.AwiBenefitSection-navigationPrev, .AwiBenefitSection-navigationNext': {
    margin: theme.spacing(0, 3, 3, 0),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.transparent,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.active,
    },
    '&[disabled]': {
      color: theme.palette.text.disabled,
    },
  },
  '.AwiBenefitSection-image': {
    pointerEvents: 'none',
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 240,
    img: {
      maxWidth: '100%',
    },
    zIndex: -1,
  },
  [theme.breakpoints.up('md')]: {
    '> .MuiContainer-root': {
      paddingTop: theme.spacing(70),
    },
    '.AwiBenefitSection-image': {
      top: -160,
      left: 30,
      maxWidth: 440,
      transform: 'none',
    },
  },
  [theme.breakpoints.up('lg')]: {
    '.AwiBenefitSection-image': {
      top: -160,
      left: -80,
      maxWidth: 540,
    },
  },
  [theme.breakpoints.up('xl')]: {
    '.AwiBenefitSection-image': {
      top: -170,
      left: 0,
      maxWidth: 606,
    },
  },
}));

interface BenefitSlideProps {
  // item: number;
  index: number;
}

const BenefitSlide = ({ /* item,  */ index }: BenefitSlideProps) => {
  const t = usePageTranslation();
  return (
    <div className="AwiBenefitSlide-root Awi-hoverGrow">
      <div>
        <Typography variant="h5" component="h3">
          {t(`benefit-section.items.${index}.title`)}
        </Typography>
        <Typography>{t(`benefit-section.items.${index}.description`)}</Typography>
      </div>
    </div>
  );
};

const items = [0, 1, 2, 3, 4];

export default function BenefitSection() {
  const t = usePageTranslation();

  return (
    <StyledSection /* containerProps={{ maxWidth: 'lg' }} */>
      <div className="AwiBenefitSection-image">
        <img src="/images/pages/landing/benefit.svg" alt="" />
      </div>
      <Header title={t('benefit-section.title')} description={t('benefit-section.description')} />
      <SwiperReact
        modules={[Navigation, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          900: {
            slidesPerView: 2,
          },
          1536: {
            slidesPerView: 3,
          },
        }}
        navigation={{
          nextEl: '#awiBenefitSectionNavigationNext',
          prevEl: '#awiBenefitSectionNavigationPrev',
        }}
      >
        {items?.map((item, itemIndex) => (
          <SwiperSlide key={itemIndex}>
            <BenefitSlide index={itemIndex} />
          </SwiperSlide>
        ))}
      </SwiperReact>
      <div className="AwiBenefitSection-navigation">
        <IconButton id="awiBenefitSectionNavigationPrev" className="AwiBenefitSection-navigationPrev">
          <ArrowForwardOutlined />
        </IconButton>
        <IconButton id="awiBenefitSectionNavigationNext" className="AwiBenefitSection-navigationNext">
          <ArrowForwardOutlined />
        </IconButton>
      </div>
    </StyledSection>
  );
}
