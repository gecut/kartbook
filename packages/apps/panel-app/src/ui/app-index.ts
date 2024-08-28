import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {cache} from 'lit/directives/cache.js';
import {html, render} from 'lit/html.js';
import 'unfonts.css';

// eslint-disable-next-line import/order
import './router/index.js';
import {navigationBar} from './components/navigation-bar.js';
import {topBar} from './components/top-bar.js';
import './styles/global.css';
import {routerContext} from '../contexts/router.js';
import {sbm} from '../utilities/sbm.js';

document.body.innerHTML = '';

render(
  html`
    ${topBar()}
    <main class="has-top-bar max-w-md mx-auto pb-20 px-4">
      ${cache(gecutContext(routerContext, (router) => router.render()))}
    </main>
    ${sbm.html} ${navigationBar()}
  `,
  document.body,
);
