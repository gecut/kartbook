import {createTRPCProxyClient, httpBatchLink} from '@trpc/client';

import {envvm} from '../utilities/envvm.js';
import {sbm} from '../utilities/sbm.js';

import type {AppRouter} from '@gecut/kartbook-panel-api/panel-api.js';

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.API_URL ?? 'https://api.panel.kartbook.ir',
      headers: () => ({
        Authorization: `Bearer ${envvm.get('user-token')}`,
      }),
      fetch: (...opts) => {
        return fetch(...opts)
          .then(async (response) => {
            if (response.ok) return response;

            const result = await response.clone().json();

            if (result.error.message) {
              sbm.notify({
                message: result.error.message,
                close: true,
              });
            }

            return response;
          })
          .catch((error) => {
            console.error('trpc_fetch_error', error);

            sbm.notify({
              message: 'اتصال به سرور با خطا مواجه شد',
              close: true,
            });

            return error;
          });
      },
    }),
  ],
});
