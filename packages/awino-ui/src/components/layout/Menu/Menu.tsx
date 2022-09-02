import { useMemo } from 'react';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { ButtonUnstyled } from '@mui/base';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import Link from '@/components/general/Link/Link';

import HoverMenu from './HoverMenu';
import HoverMenuItem from './HoverMenuItem';

const Root = styled(HoverMenu)(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
}));
interface Props {
  parentKey: string;
  i18nKey: string;
  items: {
    key: string;
    url: string;
  }[];
}
export default function Menu({ parentKey, i18nKey, items }: Props) {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const isActive = useMemo(() => {
    return !!items.find((f) => f.url === pathname);
  }, [pathname, items]);

  return (
    <Root
      id={`${parentKey}Menu`}
      className="AwiMainMenu-menuItem"
      toggle={
        <Typography variant="menu" className={clsx({ 'Awi-active': isActive })}>
          {t(`menu.${i18nKey}.${parentKey}.title`)}
        </Typography>
      }
      toggleComponent={ButtonUnstyled}
    >
      {({ close }) =>
        items.map(({ key, url }, index) => (
          <HoverMenuItem key={key} close={close}>
            <Link href={url}>{t(`menu.${i18nKey}.${parentKey}.${key}`)}</Link>
          </HoverMenuItem>
        ))
      }
    </Root>
  );
}
