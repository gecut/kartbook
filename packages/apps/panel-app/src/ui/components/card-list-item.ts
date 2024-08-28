import {nextAnimationFrame} from '@gecut/utilities/wait/polyfill.js';
import {html} from 'lit/html.js';

import {setSelectedCard} from '../../contexts/cards.js';

import type {SelectedCardType} from '../../contexts/cards.js';
import type {CardData} from '@gecut/kartbook-types';

export function $CardListItem(card: CardData, index: number, selectedCard: SelectedCardType) {
  const selectedCardChanged = (event: Event) => {
    const target = event.target as HTMLElement;
    const radio = target.querySelector<HTMLInputElement>('input#' + card.slug);

    setSelectedCard(card);
    nextAnimationFrame(() => radio && (radio.checked = true));
  };
  const ring = selectedCard.card.slug === card.slug ? 'ring-primary' : 'ring-surfaceContainer';

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
}
