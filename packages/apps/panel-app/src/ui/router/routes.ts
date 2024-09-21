import requireAuthenticated from './plugins/require-authenticated.js';
import requireNotAuthenticated from './plugins/require-not-authenticated.js';
import {$404Page} from '../pages/404.js';
import {$CardsPage} from '../pages/cards.js';
import {$CreateCardCallbackPage} from '../pages/create-card-callback.js';
import {$CreateCardPage} from '../pages/create-card.js';
import {$SellerPanelPage} from '../pages/seller-panel.js';
import {$SignPage} from '../pages/sign-in.js';
import {$SupportPage} from '../pages/support.js';
import {$UserEditPage} from '../pages/user-edit.js';
import {$UserPage} from '../pages/user.js';
import {$WalletPage} from '../pages/wallet.js';
import {$WithdrawalPage} from '../pages/withdrawal.js';

import SolarHelpBoldDuotone from '~icons/solar/help-bold-duotone';
import SolarHelpLineDuotone from '~icons/solar/help-line-duotone';
import SolarLibraryBoldDuotone from '~icons/solar/library-bold-duotone';
import SolarLibraryLineDuotone from '~icons/solar/library-line-duotone';
import SolarUserBoldDuotone from '~icons/solar/user-bold-duotone';
import SolarUserHeartRoundedBoldDuotone from '~icons/solar/user-heart-rounded-bold-duotone';
import SolarUserHeartRoundedLineDuotone from '~icons/solar/user-heart-rounded-line-duotone';
import SolarUserLineDuotone from '~icons/solar/user-line-duotone';
import SolarWalletLineDuotone from '~icons/solar/wallet-line-duotone';
import SolarWalletMoneyBoldDuotone from '~icons/solar/wallet-money-bold-duotone';

import type {StringKeyOf} from '@gecut/types';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export type Routes<
  T extends string =
    | 'cards'
    | 'cards/create'
    | 'cards/create/callback'
    | 'user'
    | 'user/edit'
    | 'wallet'
    | 'wallet/withdrawal'
    | 'seller'
    | 'sign-in'
    | 'support'
    | 'offline'
    | '404',
> = Record<
  T,
  {
    title: string;
    render?: RouteDefinition['render'];
    plugins?: RouteDefinition['plugins'];
    nav?: {selectedIcon: string; unselectedIcon: string};
    index: number;
    forSeller?: true;
  }
>;
export type RoutesPaths = StringKeyOf<Routes>;

export const routes: Routes = {
  'cards/create': {
    index: 0,
    title: 'ایجاد کارت',
    render: $CreateCardPage,
    plugins: [requireAuthenticated('/sign-in')],
  },
  'cards/create/callback': {
    index: 1,
    title: 'ایجاد کارت',
    render: $CreateCardCallbackPage,
    plugins: [requireAuthenticated('/sign-in')],
  },
  cards: {
    index: 10,
    title: 'کارت ها',
    render: $CardsPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarLibraryLineDuotone,
      selectedIcon: SolarLibraryBoldDuotone,
    },
  },

  user: {
    index: 100,
    title: 'حساب کاربری',
    render: $UserPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarUserLineDuotone,
      selectedIcon: SolarUserBoldDuotone,
    },
  },

  'user/edit': {
    index: 4,
    title: 'ویرایش حساب',
    render: $UserEditPage,
    plugins: [requireAuthenticated('/sign-in')],
  },

  wallet: {
    index: 1000,
    title: 'کیف پول',
    render: $WalletPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarWalletLineDuotone,
      selectedIcon: SolarWalletMoneyBoldDuotone,
    },
  },

  'wallet/withdrawal': {
    index: 1000,
    title: 'برداشت از کیف پول',
    render: $WithdrawalPage,
    plugins: [requireAuthenticated('/sign-in')],
  },

  seller: {
    index: 101,
    title: 'پنل فروش',
    render: $SellerPanelPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarUserHeartRoundedLineDuotone,
      selectedIcon: SolarUserHeartRoundedBoldDuotone,
    },
    forSeller: true,
  },

  'sign-in': {
    index: 7,
    title: 'ورود به سیستم',
    render: $SignPage,
    plugins: [requireNotAuthenticated('/cards')],
  },

  support: {
    index: 10000,
    title: 'پشتیبانی',
    render: $SupportPage,
    plugins: [requireAuthenticated('/sign-in')],
    nav: {
      unselectedIcon: SolarHelpLineDuotone,
      selectedIcon: SolarHelpBoldDuotone,
    },
  },

  offline: {
    index: 9,
    title: 'آفلاین',
    render: $404Page,
  },
  '404': {
    index: 10,
    title: 'یافت نشد',
    render: $404Page,
  },
};
