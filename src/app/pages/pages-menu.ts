import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Application',
    icon: 'monitor-outline',
    link: '/pages/application',
    home: true,
  },
  // {
  //   title: 'Test Cases',
  //   icon: 'clipboard-outline',
  //   link: '/pages/test-cases',
  // },
  // {
  //   title: 'Automate',
  //   icon: 'repeat-outline',
  //   link: '/pages/automate',
  // },
  {
    title: 'Reports',
    icon: 'file-text-outline',
    link: '/pages/reports',
  },
  {
    title: 'Sign Out',
    icon: 'log-in-outline',
    link: '/pages/signout',
  },
];
