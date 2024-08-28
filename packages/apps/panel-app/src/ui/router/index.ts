if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill');
}

import debounce from '@gecut/utilities/debounce.js';
import {offline} from '@thepassle/app-tools/router/plugins/offline.js';
import {redirect} from '@thepassle/app-tools/router/plugins/redirect.js';
import {resetFocus} from '@thepassle/app-tools/router/plugins/resetFocus.js';
import {Router} from '@thepassle/app-tools/router.js';

import requireAuthenticated from './plugins/require-authenticated.js';
import {routes} from './routes.js';
import {routerContext} from '../../contexts/router.js';
import {titleContext} from '../../contexts/title.js';

import type {Routes, RoutesPaths} from './routes.js';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export const router = new Router({
  plugins: [
    resetFocus,
    offline,
    {
      name: 'appName',
      beforeNavigation: (context) => {
        context.title = `${context.title} | کارت بوک`;
      },
    },
  ],
  fallback: '/404',
  routes: [
    {
      path: '/',
      title: 'خانه',
      plugins: [requireAuthenticated(resolveRouterPath('sign-in')), redirect(resolveRouterPath('cards'))],
    },

    ...Object.entries(routes as Routes).map(
      ([path, options]): RouteDefinition => ({
        path: resolveRouterPath(path as RoutesPaths),
        title: options.title,
        render: options?.render,
        plugins: options.plugins,
      }),
    ),
  ],
});

export function resolveRouterPath(key: RoutesPaths) {
  let resolvedPath = '/';

  resolvedPath = resolvedPath + key;

  return resolvedPath;
}

router.addEventListener(
  'route-changed',
  debounce(() => {
    routerContext.value = router;
    titleContext.value = router.context.title.replace(' | کارت بوک', '');
  }, 1000 / 30),
);
