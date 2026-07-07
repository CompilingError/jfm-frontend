import {
  Film,
  ClipboardCheck,
  Tags,
  UserRound,
  Settings,
} from 'lucide-react';

export const mainNavItems = [
  {
    key: 'movies',
    path: '/movies',
    labelKey: 'nav.movies',
    Icon: Film,
  },
  {
    key: 'review',
    path: '/review',
    labelKey: 'nav.review',
    Icon: ClipboardCheck,
  },
  {
    key: 'tags',
    path: '/tags',
    labelKey: 'nav.tags',
    Icon: Tags,
  },
  {
    key: 'artists',
    path: '/artists',
    labelKey: 'nav.artists',
    Icon: UserRound,
  },
];

export const fixedNavItems = [
  {
    key: 'settings',
    path: '/settings',
    labelKey: 'nav.settings',
    Icon: Settings,
  },
];