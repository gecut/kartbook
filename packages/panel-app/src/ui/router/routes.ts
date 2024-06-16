import {$404Page} from '../pages/404.js';
import {$CardsPage} from '../pages/cards.js';
import {$SignPage} from '../pages/sign-in.js';

import type {StringKeyOf} from '@gecut/types';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export type Routes<T extends string = 'cards' | 'sign-in' | 'offline' | '404'> = Record<
  T,
  {title: string; render?: RouteDefinition['render']; plugins?: RouteDefinition['plugins']}
>;
export type RoutesPaths = StringKeyOf<Routes>;

export const routes: Routes = {
  cards: {
    title: 'کارت ها',
    render: $CardsPage,
  },
  'sign-in': {
    title: 'ورود به سیستم',
    render: $SignPage,
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
