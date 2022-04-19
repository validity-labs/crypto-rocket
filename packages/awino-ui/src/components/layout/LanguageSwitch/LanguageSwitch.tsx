import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { ButtonBase, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SUPPORTED_LANGUAGES } from '@/app/constants';

import { Language } from '../../../types/app';
import HoverMenu from '../Menu/HoverMenu';

const Root = styled(HoverMenu)(({ theme }) => ({
  '.AwiHoverMenu-toggle': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    ...theme.typography.menu,
    '& svg': {
      fontSize: '12px',
      marginLeft: theme.spacing(3),
    },
  },
}));

interface Props {
  onClose: (event: any) => void;
}

const languageCount = SUPPORTED_LANGUAGES.length;

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

  //  anchorOrigin={{
  //   vertical: 'top',
  //   horizontal: 'right',
  // }}
  // transformOrigin={{
  //   vertical: 'top',
  //   horizontal: 'left',
  // }}

  return (
    <Root
      id="languageMenu"
      ariaLabel={t(`menu.language.toggle-label`)}
      toggle={
        <span className="MuiMenuItem-content">
          {t(`language.choose`)}
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </span>
      }
      toggleProps={{
        disableRipple: true,
      }}
      // toggleComponent={}
      onMouseLeave={null}
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
        SUPPORTED_LANGUAGES.map((lang, index) => (
          <MenuItem
            key={lang}
            onClick={() => {
              changeLanguage(lang);
              close(null);
            }}
            selected={lang === i18n.language}
            divider={index !== languageCount - 1}
            dense
          >
            <Typography className="MuiMenuItem-content">{t(`language.${lang}`)}</Typography>
          </MenuItem>
        ))
      }
    </Root>
  );
}
