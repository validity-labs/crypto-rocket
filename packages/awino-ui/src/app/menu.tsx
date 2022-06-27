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
      { type: 'internal', key: 'manage-awino', url: '/earn/manage-awino' },
      { type: 'internal', key: 'farms', url: '/earn/farms' },
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
    key: 'infinite',
    url: '/infinite',
  },
  {
    type: 'internal',
    key: 'pol',
    url: '/pol',
  },
  // {
  //   type: 'group',
  //   key: 'more',
  //   items: [
  //     { type: 'internal', key: 'analytics', url: '/analytics' },
  //     { type: 'internal', key: 'docs', url: 'https://app.gitbook.com/s/epRC3Tf5qPuOqDRuDbvw/' },
  //     { type: 'internal', key: 'launchpad', url: '#' },
  //   ],
  // },
];

// export const settingMenuLinks: MenuItemLink[] = [
//   // {
//   //   type: 'internal',
//   //   key: 'profile',
//   //   url: '/dashboard',
//   // },
//   {
//     type: 'internal',
//     key: 'activity',
//     url: '#',
//   },
// ];

export const moreMenuLinks: MenuItemLink[] = [
  {
    type: 'internal',
    key: 'swap',
    url: '/swap',
  },
  {
    type: 'internal',
    key: 'contracts',
    url: '/contracts',
  },
  {
    type: 'internal',
    key: 'portfolio',
    url: '/portfolio',
  },
  {
    type: 'internal',
    key: 'governance',
    url: '/governance',
  },
  {
    type: 'internal',
    key: 'analytics',
    url: '/analytics',
  },
];

export const socialLinks: MenuItemLink[] = [
  {
    type: 'external',
    key: 'docs',
    url: 'https://app.gitbook.com/s/epRC3Tf5qPuOqDRuDbvw/',
  },
  {
    type: 'external',
    key: 'blog',
    url: 'https://todo',
  },
  {
    type: 'external',
    key: 'youtube',
    url: 'https://todo',
  },
  {
    type: 'external',
    key: 'twitter',
    url: 'https://todo',
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
