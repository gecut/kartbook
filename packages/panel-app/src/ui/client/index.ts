import {createTRPCProxyClient, httpLink} from '@trpc/client';

import type {AppRouter} from '@gecut/kartbook-panel-api/panel-api.js';

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:8083',
    }),
  ],
});
