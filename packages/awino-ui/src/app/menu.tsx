// import InstagramIcon from '@mui/icons-material/Instagram';

import BlogIcon from '@/components/icons/BlogIcon';
import DocumentIcon from '@/components/icons/DocumentIcon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';
import { MenuItemLink, MenuItemType } from '@/types/app';

export const mainMenuLinks: MenuItemType[] = [
  {
    type: 'internal',
    key: 'market',
    url: '/market',
  },
  {
    type: 'group',
    key: 'earn',
    items: [
      { type: 'internal', key: 'deposit', url: '/earn/deposit' },
      { type: 'internal', key: 'liquidity-staking', url: '/earn/liquidity-staking' },
    ],
  },
  {
    type: 'internal',
    key: 'borrow',
    url: '/borrow',
  },
  {
    type: 'internal',
    key: 'swap',
    url: '/swap',
  },
  {
    type: 'internal',
    key: 'podl',
    url: '/podl',
  },
  {
    type: 'group',
    key: 'more',
    items: [
      { type: 'internal', key: 'analytics', url: '/analytics' },
      { type: 'internal', key: 'docs', url: '#' },
      { type: 'internal', key: 'launchpad', url: '#' },
    ],
  },
];

export const settingMenuLinks: MenuItemLink[] = [
  {
    type: 'internal',
    key: 'profile',
    url: '#',
  },
  {
    type: 'internal',
    key: 'activity',
    url: '#',
  },
];

export const moreMenuLinks: MenuItemLink[] = [
  {
    type: 'internal',
    key: 'market',
    url: '/market',
  },
  {
    type: 'internal',
    key: 'contracts',
    url: '#',
  },
  {
    type: 'internal',
    key: 'portfolio',
    url: '#',
  },
];

export const socialLinks: Required<MenuItemLink>[] = [
  {
    type: 'external',
    key: 'docs',
    url: 'https://todo',
    icon: () => <DocumentIcon style={{ fill: '#7436ff' }} />,
  },
  {
    type: 'external',
    key: 'blog',
    url: 'https://todo',
    icon: () => <BlogIcon style={{ fill: '#FFC400' }} />,
  },
  {
    type: 'external',
    key: 'youtube',
    url: 'https://todo',
    icon: () => <YouTubeIcon style={{ fill: '#FD68FD' }} />,
  },
  {
    type: 'external',
    key: 'twitter',
    url: 'https://todo',
    icon: () => <TwitterIcon style={{ fill: '#08CEB7' }} />,
  },
];

export const footerLinks = {
  general: [
    {
      key: 'privacy',
      url: '/downloads/privacy.pdf',
    },
    {
      key: 'terms',
      url: '/downloads/terms.pdf',
    },
  ],
};
