import {gecutButton, gecutIconButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {ContextSignal} from '@gecut/signal';
import {nextAnimationFrame} from '@gecut/utilities/wait/polyfill.js';
import {repeat} from 'lit/directives/repeat.js';
import {html} from 'lit/html.js';

import {$CardRenderer} from '../components/card.js';
import {cardsContext, selectedCardSlugContext, setSelectedCard} from '../contexts/cards.js';

import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
import SolarEyeLineDuotone from '~icons/solar/eye-line-duotone';
import SolarInfoCircleLineDuotone from '~icons/solar/info-circle-line-duotone';
import SolarPenNewRoundLineDuotone from '~icons/solar/pen-new-round-line-duotone';
import SolarShareLineDuotone from '~icons/solar/share-line-duotone';

import type {TemplateResult, nothing} from 'lit/html.js';

const cardDialog = new ContextSignal<TemplateResult | typeof nothing>('card-dialog');

export function $CardsPage() {
  return gecutContext(
    cardsContext,
    (cards) => html`
      <div class="flex flex-col py-4 gap-4">
        ${gecutContext(
          selectedCardSlugContext,
          (card) => html`
            ${$CardRenderer(card, () => html`${gecutContext(cardDialog, (t) => t)}`)}

            <div class="flex w-full max-w-[24.5rem] mx-auto justify-between items-center mx-2">
              <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons">
                ${gecutIconButton({
                  type: 'filledTonal',
                  name: 'info',
                  svg: SolarInfoCircleLineDuotone,
                })}

                <span class="text-labelMedium text-onSurfaceVariant">اطلاعات</span>
              </div>
              <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons">
                ${gecutIconButton({
                  type: 'filledTonal',
                  name: 'enable',
                  svg: SolarEyeLineDuotone,
                })}

                <span class="text-labelMedium text-onSurfaceVariant">فعال سازی</span>
              </div>
              <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons">
                ${gecutIconButton({
                  type: 'filledTonal',
                  name: 'share',
                  svg: SolarShareLineDuotone,
                })}

                <span class="text-labelMedium text-onSurfaceVariant">اشتراک گذاری</span>
              </div>
              <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons">
                ${gecutIconButton({
                  type: 'filledTonal',
                  name: 'edit',
                  svg: SolarPenNewRoundLineDuotone,
                })}

                <span class="text-labelMedium text-onSurfaceVariant">ویرایش</span>
              </div>
            </div>
          `,
        )}
      </div>

      <div class="flex flex-col gap-2 p-4">
        <h2 class="text-titleMedium text-onSurfaceVariant mb-2">کارت های شما</h2>
        ${gecutContext(selectedCardSlugContext, (selectedCard) =>
          repeat(
            cards,
            (card) => card._id,
            (card, index) => {
              const selectedCardChanged = (event: Event) => {
                const target = event.target as HTMLElement;
                const radio = target.querySelector<HTMLInputElement>('input#' + card.slug);

                setSelectedCard(card);
                nextAnimationFrame(() => radio && (radio.checked = true));
              };
              const ring = selectedCard.slug === card.slug ? 'ring-primary' : 'ring-surfaceContainer';

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
