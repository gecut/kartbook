import IranianBanks from '@gecut/kartbook-banks-data';
import {cache} from 'lit/directives/cache.js';
import {until} from 'lit/directives/until.js';
import {html} from 'lit/html.js';

import kartbookLogo from '../../../public/logo.png';
import {setSelectedCard} from '../../contexts/cards.js';

import type {SelectedCardType} from '../../contexts/cards.js';
import type {CardData} from '@gecut/kartbook-types';

export function $CardListItem(card: CardData, index: number, selectedCard: SelectedCardType) {
  const selectedCardChanged = () => {
    setSelectedCard(card);
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
      <div class="size-6">
        ${cache(
          until(
            IranianBanks.getInfo(card.cardNumber).then((info) => info.image?.cloneNode(true)),
            html`<img src=${kartbookLogo} alt="logo" />`,
          ),
        )}
      </div>
    </div>
  `;
}
