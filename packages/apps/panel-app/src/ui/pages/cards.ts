import {gecutButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {repeat} from 'lit/directives/repeat.js';
import {html} from 'lit/html.js';

import {cardsContext, selectedCardContext} from '../../contexts/cards.js';
import {$CardDetail} from '../components/card-detail.js';
import {$CardListItem} from '../components/card-list-item.js';
import {resolveRouterPath} from '../router/index.js';

import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';

export function $CardsPage() {
  return gecutContext(
    cardsContext,
    (cards) => html`
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
        ${gecutButton({
          type: 'filled',
          label: 'ایجاد کارت جدید',
          href: resolveRouterPath('cards/create'),
          trailingIcon: {
            svg: SolarAddCircleBoldDuotone,
          },
        })}
      </div>
    `,
  );
}
