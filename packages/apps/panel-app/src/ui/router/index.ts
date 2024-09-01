if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill');
}

import debounce from '@gecut/utilities/debounce.js';
import {offline} from '@thepassle/app-tools/router/plugins/offline.js';
import {Router} from '@thepassle/app-tools/router.js';

import requireAuthenticated from './plugins/require-authenticated.js';
import requireNotAuthenticated from './plugins/require-not-authenticated.js';
import {resolvePath} from './resolver.js';
import {routes} from './routes.js';
import {routerContext} from '../../contexts/router.js';
import {titleContext} from '../../contexts/title.js';

import type {Routes, RoutesPaths} from './routes.js';
import type {RouteDefinition} from '@thepassle/app-tools/router.js';

export const router = new Router({
  plugins: [
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
      plugins: [requireAuthenticated(resolvePath('sign-in')), requireNotAuthenticated(resolvePath('cards'))],
    },
    ...Object.entries(routes as Routes).map(
      ([path, options]): RouteDefinition => ({
        path: resolvePath(path as RoutesPaths),
        title: options.title,
        render: options?.render,
        plugins: options.plugins,
      }),
    ),
  ],
});

router.addEventListener(
  'route-changed',
  debounce(() => {
    routerContext.value = router;
    titleContext.value = router.context.title.replace(' | کارت بوک', '');
  }, 1000 / 30),
);
