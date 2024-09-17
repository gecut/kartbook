import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {untilIdle, untilNextFrame} from '@gecut/utilities/wait/wait.js';
import {cache} from 'lit/directives/cache.js';
import {html, render} from 'lit/html.js';

import {topBar} from './components/top-bar.js';
import './router/index.js';
import {routerContext} from '../contexts/router.js';
import {loadUser} from '../contexts/user.js';
import '../utilities/pwa.js';
import {sbm} from '../utilities/sbm.js';
import navigationBar from './components/navigation-bar.js';

export async function startApp() {
  await loadUser();
  await untilIdle();

  document.body.innerHTML = '';

  await untilNextFrame();

  render(
    html`
      ${topBar()}
      <main class="has-top-bar max-w-md mx-auto pb-20 px-4 h-full w-full overflow-y-auto">
        ${cache(gecutContext(routerContext, (router) => router.render()))}
      </main>
      ${sbm.html}${navigationBar()}
    `,
    document.body,
  );
}
