import { useTranslation } from 'next-i18next';

// import { settingMenuLinks } from '@/app/menu';
// import Link from '@/components/general/Link/Link';
import GearIcon from '@/components/icons/GearIcon';

import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import HoverMenu from '../Menu/HoverMenu';
// import HoverMenuItem from '../Menu/HoverMenuItem';

export default function SettingsMenu() {
  const { t } = useTranslation();

  return (
    <HoverMenu id="settingsMenu" ariaLabel={t(`menu.settings.toggle-label`)} toggle={<GearIcon fontSize="medium" />}>
      {({ close }) => [
        <LanguageSwitch key="languageSwitch" onClose={close} />,
        // ...settingMenuLinks.map(({ key, url }, index) => (
        //   <HoverMenuItem key={key} close={close}>
        //     <Link href={url}>{t(`menu.settings.${key}.title`)}</Link>
        //   </HoverMenuItem>
        // )),
      ]}
    </HoverMenu>
  );
}
