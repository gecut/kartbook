import {gecutButton, icon} from '@gecut/components';
import {GecutState} from '@gecut/lit-helper';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {loadUser} from '../../contexts/user.js';
import {router} from '../router/index.js';
import {resolvePath} from '../router/resolver.js';

import SolarCheckCircleLineDuotone from '~icons/solar/check-circle-line-duotone';
import SolarCloseCircleLineDuotone from '~icons/solar/close-circle-line-duotone';

import type {CardData} from '@gecut/kartbook-types';

export function $CreateCardCallbackPage() {
  const {trackId, orderId} = router.context.query as {trackId: number; orderId: string};
  const state = new GecutState<'success' | 'error'>('order.data');
  let cardSlug = '';

  client.order.verify
    .mutate({trackId: Number(trackId), orderId})
    .then((card: CardData) => {
      state.value = 'success';

      cardSlug = card.slug;

      loadUser();
    })
    .catch(() => {
      state.value = 'error';
    });

  return html`
    <main
      class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar
                 items-center justify-center pb-20 px-4 h-full !z-sticky"
    >
      ${state.hydrate(
        (state) =>
          stateManager(
            {
              success: () => html`
                <i class="[&>.gecut-icon]:text-[6rem] text-primary">
                  ${icon({
                    svg: SolarCheckCircleLineDuotone,
                  })}
                </i>
                <h1 class="text-headlineMedium text-onSurface mt-2">تراکنش موفق</h1>
                <h2 class="text-labelLarge text-onSurfaceVariant mt-1">کارت با موفقیت ایجاد شد</h2>
                <div class="w-full mt-4 flex flex-col gap-2">
                  ${gecutButton({
                    type: 'filled',
                    href: resolvePath('cards'),
                    label: 'مشاهده کارت',
                  })}
                  ${gecutButton({
                    type: 'filledTonal',
                    href: 'https://k32.ir/' + cardSlug,
                    target: '_blank',
                    label: 'k32.ir/' + cardSlug,
                  })}
                </div>
              `,
              error: () => html`
                <i class="[&>.gecut-icon]:text-[6rem] text-error">
                  ${icon({
                    svg: SolarCloseCircleLineDuotone,
                  })}
                </i>
                <h1 class="text-headlineMedium text-onSurface mt-2">تراکنش ناموفق</h1>
                <h2 class="text-labelLarge text-onSurfaceVariant mt-1">عملیات پرداخت ناموفق بود</h2>
                <div class="w-full mt-4 flex flex-col gap-2">
                  ${gecutButton({
                    type: 'filledTonal',
                    href: resolvePath('cards'),
                    label: 'بازگشت',
                  })}
                </div>
              `,
            },
            state,
          ),
        () => html`loading...`,
      )}
    </main>
  `;
}
