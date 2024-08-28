import {ContextSignal} from '@gecut/signal';

import type {Router} from '@thepassle/app-tools/router.js';

export const routerContext = new ContextSignal<Router>('router', 'AnimationFrame');
