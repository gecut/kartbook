import {createTRPCProxyClient, httpLink} from '@trpc/client';

import {envvm} from '../utilities/envvm.js';

import type {AppRouter} from '@gecut/kartbook-panel-api/panel-api.js';

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: 'http://localhost:8083',
      headers: () => ({
        Authorization: `Bearer ${envvm.get('user-token')}`,
      }),
    }),
  ],
});
