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
  paddingTop: theme.spacing(88),
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
    padding: theme.spacing(0, 4),
    '>div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '420px',
      height: '100%',
      minHeight: 420,
      padding: theme.spacing(14, 10.5),
      margin: '0 auto',
      boxSizing: 'border-box',
      borderRadius: +theme.shape.borderRadius * 5,
      backgroundColor: theme.palette.background.transparent,
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
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.transparent,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.active,
    },
    '&[disabled]': {
      color: theme.palette.text.disabled,
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
    <div className="AwiBenefitSlide-root">
      <div className="Awi-hoverGrow">
        <Typography variant="h5" component="h3">
          {t(`benefit-section.items.${index}.title`)}
        </Typography>
        <Typography>{t(`benefit-section.items.${index}.description`)}</Typography>
      </div>
    </div>
  );
};

const items = [0, 1, 2, 3];

export default function BenefitSection() {
  const t = usePageTranslation();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <StyledSection containerProps={{ maxWidth: 'lg' }}>
      <Header title={t('benefit-section.title')} description={t('benefit-section.description')} />
      <SwiperReact
        modules={[A11y, Navigation]}
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
          nextEl: nextRef.current,
          prevEl: prevRef.current,
        }}
      >
        {items?.map((item, itemIndex) => (
          <SwiperSlide key={itemIndex}>
            <BenefitSlide /*  item={item} */ index={itemIndex} />
          </SwiperSlide>
        ))}
      </SwiperReact>
      <div className="AwiBenefitSection-navigation">
        <IconButton className="AwiBenefitSection-navigationPrev" ref={prevRef}>
          <ArrowForwardOutlined />
        </IconButton>
        <IconButton className="AwiBenefitSection-navigationNext" ref={nextRef}>
          <ArrowForwardOutlined />
        </IconButton>
      </div>
    </StyledSection>
  );
}
