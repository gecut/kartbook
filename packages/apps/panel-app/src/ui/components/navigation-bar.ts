import {icon} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {mapObject} from '@gecut/lit-helper/utilities/map-object.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {routerContext} from '../../contexts/router.js';
import {routes} from '../router/routes.js';

export function navigationBar() {
  return html`
    <footer class="fixed bottom-0 inset-x-0 bg-surfaceContainer translucent flex flex-col h-20">
      <div class="max-w-md mx-auto flex items-center justify-center gap-4 w-full h-full relative px-4">
        ${gecutContext(routerContext, (router) =>
          mapObject(null, routes, (route, path) =>
            when(route.nav, () =>
              navigationItem(
                route.nav!.unselectedIcon,
                route.nav!.selectedIcon,
                '/' + path,
                router.context.url.pathname.split('/')[1] === path,
              ),
            ),
          ),
        )}
      </div>
    </footer>
  `;
}

function navigationItem(unselectedIcon: string, selectedIcon: string, link: string, active = false) {
  return html`
    <a
      .href=${link}
      class="size-12 text-onSurface rounded-xl flex items-center justify-center relative
             transition-colors duration-300 overflow-hidden
             hover:bg-primaryContainer hover:text-onPrimaryContainer
             group [&.active]:!bg-primary [&.active]:!text-onPrimary ${active ? 'active' : ''} "
    >
      <span
        class="absolute inset-0 z-above transition-[opacity] group-hover:opacity-0 duration-300
               group-[.active]:opacity-0 opacity-100 flex items-center justify-center"
      >
        ${icon({svg: unselectedIcon})}
      </span>

      <span
        class="absolute inset-0 z-above transition-[opacity] group-hover:opacity-100 duration-300
               group-[.active]:opacity-100 opacity-0 flex items-center justify-center"
      >
        ${icon({svg: selectedIcon})}
      </span>
    </a>
  `;
}
