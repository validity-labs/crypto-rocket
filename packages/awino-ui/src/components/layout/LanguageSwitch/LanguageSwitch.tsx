import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { ButtonUnstyled } from '@mui/base';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { styled } from '@mui/material/styles';

import { SUPPORTED_LANGUAGES } from '@/app/constants';

import { Language } from '../../../types/app';
import HoverMenu from '../Menu/HoverMenu';
import HoverMenuItem from '../Menu/HoverMenuItem';

const Root = styled(HoverMenu)(({ theme }) => ({
  '.AwiHoverMenu-toggle': {
    '& svg': {
      fontSize: '12px',
      marginLeft: theme.spacing(3),
    },
  },
}));

interface Props {
  onClose: (event: any) => void;
}

export default function LanguageMenu({ onClose }: Props) {
  const { t, i18n } = useTranslation();

  const router = useRouter();

  const changeLanguage = (language: Language /* router: NextRouter, lang: string */) => {
    i18n.changeLanguage(language);
    onClose(null);
    const url = router.asPath;
    router.push(url, url, { locale: language });
  };

  if (SUPPORTED_LANGUAGES.length <= 1) {
    return null;
  }

  return (
    <Root
      id="languageMenu"
      ariaLabel={t(`menu.language.toggle-label`)}
      component={HoverMenuItem}
      onMouseLeave={null}
      toggle={
        <>
          {t(`language.choose`)}
          <ArrowForwardIosRoundedIcon />
        </>
      }
      // toggleProps={
      //   {
      //     disableRipple: true,
      //   }
      // }
      toggleComponent={ButtonUnstyled}
      popperProps={{
        placement: 'right-start',
        disablePortal: false,
      }}
      popperSx={{
        '& .AwiHoverMenu-paper': {
          marginTop: 0,
          marginLeft: 1,
        },
      }}
    >
      {({ close }) =>
        SUPPORTED_LANGUAGES.map((lang) => (
          <HoverMenuItem key={lang}>
            <ButtonUnstyled
              onClick={(event) => {
                event.preventDefault();
                changeLanguage(lang);
                close(null);
              }}
              className={clsx({ 'Awi-active': lang === i18n.language })}
            >
              {t(`language.${lang}`)}
            </ButtonUnstyled>
          </HoverMenuItem>
        ))
      }
    </Root>
  );
}
