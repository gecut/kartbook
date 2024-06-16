import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {html, render} from 'lit/html.js';
import 'unfonts.css';

import {routerContext} from './contexts/router.js';
import './router/index.js';
import './styles/global.css';

document.body.innerHTML = '';

render(html` ${gecutContext(routerContext, (router) => router.render())} `, document.body);
