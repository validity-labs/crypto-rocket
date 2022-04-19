import { useTranslation } from 'next-i18next';

import { MenuItem, Typography } from '@mui/material';

import { settingMenuLinks } from '@/app/menu';
import Link from '@/components/general/Link/Link';
import GearIcon from '@/components/icons/GearIcon';

import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import HoverMenu from '../Menu/HoverMenu';

export default function SettingsMenu() {
  const { t } = useTranslation();

  return (
    <HoverMenu id="settingsMenu" ariaLabel={t(`menu.settings.toggle-label`)} toggle={<GearIcon fontSize="medium" />}>
      {({ close }) => [
        <MenuItem key="languageSwitch" divider>
          <LanguageSwitch onClose={close} />
        </MenuItem>,
        ...settingMenuLinks.map(({ key, url }, index) => (
          <MenuItem
            key={key}
            component={Link}
            href={url}
            onClick={close}
            divider={index !== settingMenuLinks.length - 1}
          >
            <Typography className="MuiMenuItem-content">{t(`menu.settings.${key}.title`)}</Typography>
          </MenuItem>
        )),
      ]}
    </HoverMenu>
  );
}
