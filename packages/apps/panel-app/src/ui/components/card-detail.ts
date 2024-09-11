import {gecutIconButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {html} from 'lit/html.js';

import {cardDialogContext, cardDialogStates, cardDialogSetter} from './card-dialog.js';
import {$CardRenderer} from './card.js';
import {client} from '../../client/index.js';
import {loadCards, selectedCardContext} from '../../contexts/cards.js';

import SolarEyeClosedLineDuotone from '~icons/solar/eye-closed-line-duotone';
import SolarEyeLineDuotone from '~icons/solar/eye-line-duotone';
import SolarInfoCircleLineDuotone from '~icons/solar/info-circle-line-duotone';
import SolarPenNewRoundLineDuotone from '~icons/solar/pen-new-round-line-duotone';
import SolarShareLineDuotone from '~icons/solar/share-line-duotone';

import type {SelectedCardType} from '../../contexts/cards.js';

export function $CardDetail(selectedCard: SelectedCardType) {
  return html`
    ${$CardRenderer(
      selectedCard.card.cardNumber,
      selectedCard.card.iban ?? '',
      selectedCard.card.ownerName || selectedCard.card.owner.firstName + ' ' + selectedCard.card.owner.lastName,
      selectedCard.bank,

      () => html`${gecutContext(cardDialogContext, (state) => stateManager(cardDialogStates, state))}`,
    )}

    <div class="flex w-full justify-between items-center">
      <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
        ${gecutIconButton({
          type: 'filledTonal',
          name: 'info',
          svg: SolarInfoCircleLineDuotone,

          events: {
            click: cardDialogSetter('info'),
          },
        })}

        <span class="text-labelMedium text-onSurfaceVariant">اطلاعات</span>
      </div>

      <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
        ${gecutIconButton({
          type: (selectedCard.card.disabled ?? false) ? 'filled' : 'filledTonal',
          name: 'enable',
          svg: (selectedCard.card.disabled ?? false) ? SolarEyeClosedLineDuotone : SolarEyeLineDuotone,

          events: {
            click: async (event) => {
              const target = event.target as HTMLButtonElement;

              target.setAttribute('loading', '');

              const id = selectedCardContext.value?.card._id;
              if (id) {
                await client.card.toggleDisabled.mutate({id});
              }
              await loadCards();

              target.removeAttribute('loading');
            },
          },
        })}

        <span class="text-labelMedium text-onSurfaceVariant">
          ${selectedCard.card.disabled ? 'فعال سازی' : 'غیرفعال سازی'}
        </span>
      </div>

      <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
        ${gecutIconButton({
          type: 'filledTonal',
          name: 'share',
          svg: SolarShareLineDuotone,

          events: {
            click: cardDialogSetter('share'),
          },
        })}

        <span class="text-labelMedium text-onSurfaceVariant">اشتراک گذاری</span>
      </div>

      <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
        ${gecutIconButton({
          type: 'filledTonal',
          name: 'edit',
          svg: SolarPenNewRoundLineDuotone,
          disabled: true,
        })}

        <span class="text-labelMedium text-onSurfaceVariant">ویرایش</span>
      </div>
    </div>
  `;
}
