import {gecutButton, icon} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {repeat} from 'lit/directives/repeat.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {cardsContext, selectedCardContext} from '../../contexts/cards.js';
import {$CardDetail} from '../components/card-detail.js';
import {$CardListItem} from '../components/card-list-item.js';
import {resolvePath} from '../router/resolver.js';

import LineMdPlus from '~icons/line-md/plus';
import SolarCardLineDuotone from '~icons/solar/card-line-duotone';

export function $CardsPage() {
  const _$NewCardButton = gecutButton({
    type: 'filled',
    label: 'ایجاد کارت جدید',
    href: resolvePath('cards/create'),
    icon: {
      svg: LineMdPlus,
    },
  });

  return gecutContext(cardsContext, (cards) =>
    when(
      cards.length > 0,
      () => html`
        <div class="flex flex-col py-4 gap-4">${gecutContext(selectedCardContext, $CardDetail)}</div>

        <div class="flex flex-col gap-2 py-4">
          <h2 class="text-titleMedium text-onSurfaceVariant mb-2">کارت های شما</h2>
          ${gecutContext(selectedCardContext, (selectedCard) =>
            repeat(
              cards,
              (card) => card._id,
              (card, index) => $CardListItem(card, index, selectedCard),
            ),
          )}

          <div class="mt-2"></div>
          ${_$NewCardButton}
        </div>
      `,
      () => html`
        <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 h-full w-full !z-sticky">
          <div
            class="h-full w-full flex flex-col items-center justify-center [&>.gecut-button]:w-full
                      *:animate-fadeInSlide"
          >
            <i class="[&>.gecut-icon]:text-[6rem] text-primary !animate-bounce">
              ${icon({
                svg: SolarCardLineDuotone,
              })}
            </i>
            <h1 class="text-titleMedium mt-2">کارتی برای نمایش وجود ندارد</h1>
            <p class="text-bodySmall text-onSurface mt-1 mb-6">همین حالا یکی از کارت های خود را آنلاین کنید</p>
            ${_$NewCardButton}
          </div>
        </main>
      `,
    ),
  );
}
