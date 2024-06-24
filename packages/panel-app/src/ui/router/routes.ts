import requireAuthenticated from './plugins/require-authenticated.js';
import requireNotAuthenticated from './plugins/require-not-authenticated.js';
import {$404Page} from '../pages/404.js';
import {$CardsPage} from '../pages/cards.js';
import {$SignPage} from '../pages/sign-in.js';

import SolarLibraryBoldDuotone from '~icons/solar/library-bold-duotone';
import SolarLibraryLineDuotone from '~icons/solar/library-line-duotone';

import type {StringKeyOf} from '@gecut/types';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export type Routes<T extends string = 'cards' | 'sign-in' | 'offline' | '404'> = Record<
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
  cards: {
    title: 'کارت ها',
    render: $CardsPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarLibraryLineDuotone,
      selectedIcon: SolarLibraryBoldDuotone,
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
