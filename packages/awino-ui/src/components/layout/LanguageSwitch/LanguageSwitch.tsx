import type { MouseEvent } from 'react';
import { useState } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { ButtonBase, Menu, MenuItem, MenuProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SUPPORTED_LANGUAGES } from '@/app/constants';

import { Language } from '../../../types/app';
const ToggleButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...theme.typography.menu,
  '& svg': {
    fontSize: '12px',
    marginLeft: theme.spacing(3),
  },
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    marginLeft: theme.spacing(1),
  },
}));

interface Props {
  onClose: () => void;
}

const languageCount = SUPPORTED_LANGUAGES.length;

export default function LanguageMenu({ onClose }: Props) {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const router = useRouter();

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeLanguage = (language: Language /* router: NextRouter, lang: string */) => {
    i18n.changeLanguage(language);
    handleClose();
    onClose();
    const url = router.asPath;
    router.push(url, url, { locale: language });
  };

  if (SUPPORTED_LANGUAGES.length <= 1) {
    return null;
  }
  return (
    <>
      <ToggleButton
        disableRipple
        className="MuiMenuItem-content"
        id="languageSwitchButton"
        aria-controls="languageSwitchMenu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {t(`language.choose`)}
        <ArrowForwardIosRoundedIcon fontSize="small" />
      </ToggleButton>
      <StyledMenu
        id="languageSwitchMenu"
        MenuListProps={{
          'aria-labelledby': 'languageSwitchButton',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {SUPPORTED_LANGUAGES.map((lang, index) => (
          <MenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            selected={lang === i18n.language}
            divider={index !== languageCount - 1}
            dense
          >
            <ButtonBase className="MuiMenuItem-content">{t(`language.${lang}`)}</ButtonBase>
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  );
}
