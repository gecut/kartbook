import {GecutLogger} from '@gecut/logger';
import {createTRPCProxyClient, httpLink} from '@trpc/client';

import {envvm} from '../utilities/envvm.js';
import {sbm} from '../utilities/sbm.js';

import type {AppRouter} from '@gecut/kartbook-panel-api/panel-api.js';

const fetchLogger = new GecutLogger('createTRPCProxyClient.httpLink');

const errors: Record<string, string> = {
  'discount-not-found': 'تخفیف یافت نشد',
  'discount-not-applicable-to-this-plan': 'این تخفیف برای این پلن قابل استفاده نیست',
  'discount-usage-limit-exceeded': 'تعداد استفاده از این تخفیف به پایان رسیده است',
  'discount-not-yet-started': 'این تخفیف هنوز فعال نشده است',
  'discount-has-expired': 'این تخفیف منقضی شده است',
};

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: import.meta.env.API_URL ?? 'http://localhost:8081',
      headers: () => ({
        Authorization: `Bearer ${envvm.get('user-token')}`,
      }),
      fetch: (...opts) => {
        return fetch(...opts)
          .then(async (response) => {
            if (response.ok) {
              fetchLogger.methodArgs?.('fetch', {response});

              return response;
            }

            const result = await response.clone().json();

            fetchLogger.methodArgs?.('fetch', {response, result});

            if (typeof result.error.message === 'string') {
              sbm.notify({
                message: errors[String(result.error.message)] || result.error.message,
                textMultiLine: true,
                close: true,
              });
            }

            return response;
          })
          .catch((error) => {
            fetchLogger.error('fetch', error);

            sbm.notify({
              message: 'اتصال به سرور با مشکل روبه‌رو شد. لطفا اتصال خود را بررسی کرده و دوباره تلاش کنید.',
              close: true,
            });

            return error;
          });
      },
    }),
  ],
});
