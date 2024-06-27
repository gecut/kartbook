import requireAuthenticated from './plugins/require-authenticated.js';
import requireNotAuthenticated from './plugins/require-not-authenticated.js';
import {$404Page} from '../pages/404.js';
import {$CardsPage} from '../pages/cards.js';
import {$SignPage} from '../pages/sign-in.js';
import {$SupportPage} from '../pages/support.js';
import {$UserPage} from '../pages/user.js';

import SolarHelpBoldDuotone from '~icons/solar/help-bold-duotone';
import SolarHelpLineDuotone from '~icons/solar/help-line-duotone';
import SolarLibraryBoldDuotone from '~icons/solar/library-bold-duotone';
import SolarLibraryLineDuotone from '~icons/solar/library-line-duotone';
import SolarUserBoldDuotone from '~icons/solar/user-bold-duotone';
import SolarUserLineDuotone from '~icons/solar/user-line-duotone';

import type {StringKeyOf} from '@gecut/types';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export type Routes<T extends string = 'cards' | 'user' | 'sign-in' | 'support' | 'offline' | '404'> = Record<
  T,
  {
    title: string;
    render?: RouteDefinition['render'];
    plugins?: RouteDefinition['plugins'];
    nav?: {selectedIcon: string; unselectedIcon: string};
  }
>;
export type RoutesPaths = StringKeyOf<Routes>;

export const routes: Routes = {
  support: {
    title: 'پشتیبانی',
    render: $SupportPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarHelpLineDuotone,
      selectedIcon: SolarHelpBoldDuotone,
    },
  },
  cards: {
    title: 'کارت ها',
    render: $CardsPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarLibraryLineDuotone,
      selectedIcon: SolarLibraryBoldDuotone,
    },
  },
  user: {
    title: 'حساب کاربری',
    render: $UserPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarUserLineDuotone,
      selectedIcon: SolarUserBoldDuotone,
    },
  },

  'sign-in': {
    title: 'ورود به سیستم',
    render: $SignPage,
    plugins: [requireNotAuthenticated('/cards')],
  },

  offline: {
    title: 'آفلاین',
    render: $404Page,
  },
  '404': {
    title: 'یافت نشد',
    render: $404Page,
  },
};
