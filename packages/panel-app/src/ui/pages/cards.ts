import {gecutButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {nextAnimationFrame} from '@gecut/utilities/wait/polyfill.js';
import {repeat} from 'lit/directives/repeat.js';
import {html} from 'lit/html.js';

import {cardsContext, selectedCardSlugContext} from '../contexts/cards.js';

import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';

export function $CardsPage() {
  return gecutContext(
    cardsContext,
    (cards) => html`
      ${gecutContext(selectedCardSlugContext, (slug) => {
        return slug;
      })}

      <div class="flex flex-col gap-2 p-4">
        <h2 class="text-titleMedium text-onSurfaceVariant mb-2">کارت های شما</h2>
        ${gecutContext(selectedCardSlugContext, (slug) =>
          repeat(
            cards,
            (card) => card._id,
            (card, index) => {
              const selectedCardChanged = (event: Event) => {
                const target = event.target as HTMLElement;
                const radio = target.querySelector<HTMLInputElement>('input#' + card.slug);

                selectedCardSlugContext.value = card.slug;
                nextAnimationFrame(() => radio && (radio.checked = true));
              };
              const ring = slug === card.slug ? 'ring-primary' : 'ring-surfaceContainer';

              return html`
                <div
                  role="button"
                  class="flex ring-2 ring-inset overflow-hidden bg-surfaceContainerLow
                     p-4 gap-4 items-center justify-between rounded-xl text-onSurfaceVariant cursor-pointer
                     transition-shadow focus-ring ${ring}"
                  tabindex="0"
                  @click=${selectedCardChanged}
                  @keypress=${selectedCardChanged}
                >
                  <div
                    class="size-6 rounded-full bg-primary text-onPrimary flex items-center
                           justify-center text-labelSmall"
                  >
                    ${index + 1}
                  </div>
                  <div class="text-labelLarge">
                    <span class="text-onSurfaceVariant">k32.ir/</span>
                    <span class="text-onSurface font-bold">${card.slug}</span>
                  </div>
                </div>
              `;
            },
          ),
        )}

        <div class="mt-2"></div>
        ${gecutButton({
          type: 'filled',
          label: 'ایجاد کارت جدید',
          trailingIcon: {
            svg: SolarAddCircleBoldDuotone,
          },
        })}
      </div>
    `,
  );
}
