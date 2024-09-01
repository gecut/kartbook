import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {nextAnimationFrame} from '@gecut/utilities/wait/polyfill.js';
import {cache} from 'lit/directives/cache.js';
import {html, render} from 'lit/html.js';
import 'unfonts.css';

import {topBar} from './components/top-bar.js';
import './router/index.js';
import './styles/global.css';
import {routerContext} from '../contexts/router.js';
import {sbm} from '../utilities/sbm.js';
// eslint-disable-next-line import/order
import navigationBar from './components/navigation-bar.js';

document.body.innerHTML = '';

nextAnimationFrame(() => {
  render(
    html`
      ${topBar()}
      <main class="has-top-bar max-w-md mx-auto pb-20 px-4 h-full w-full">
        ${cache(gecutContext(routerContext, (router) => router.render()))}
      </main>
      ${sbm.html}${navigationBar()}
    `,
    document.body,
  );
});
