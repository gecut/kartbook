import {icon} from '@gecut/components';
import {ContextSignal} from '@gecut/signal';
import {html, nothing} from 'lit/html.js';

import {selectedCardContext} from '../../contexts/cards.js';

import SolarAlarmTurnOffLineDuotone from '~icons/solar/alarm-turn-off-line-duotone';
import SolarCalendarMinimalisticLineDuotone from '~icons/solar/calendar-minimalistic-line-duotone';

import type {StateManager} from '@gecut/utilities/state-manager.js';
import type {TemplateResult} from 'lit/html.js';

export type CardDialogStates = 'info' | 'share' | 'disabled' | 'nothing';

export const cardDialogContext = new ContextSignal<CardDialogStates>('card-dialog', 'AnimationFrame');
export const cardDialogStates: StateManager<CardDialogStates, TemplateResult | typeof nothing> = {
  info: () => {
    const card = selectedCardContext.value;

    if (!card) return nothing;

    return html`
      <div
        class="translucent bg-surfaceContainerHigh absolute z-dropdown inset-0
               flex flex-col justify-center p-4 gap-2"
      >
        <div class="flex w-full gap-2 items-center">
          ${icon({
            svg: SolarCalendarMinimalisticLineDuotone,
          })}
          <span class="text-labelLarge text-onSurface">تاریخ ایجاد:</span>
          <span class="text-labelLarge text-onSurfaceVariant">
            ${new Date(card.card.createdAt ?? 0).toLocaleString('fa-IR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </span>
        </div>
        <div class="flex w-full gap-2 items-center">
          ${icon({
            svg: SolarAlarmTurnOffLineDuotone,
          })}
          <span class="text-labelLarge text-onSurface">تاریخ اتمام اشتراک:</span>
          <span class="text-labelLarge text-onSurfaceVariant">
            ${new Date(card.card.expireAt ?? 0).toLocaleDateString('fa-IR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    `;
  },
  share: () => html`
    <div class="translucent bg-surfaceContainerHigh absolute z-dropdown inset-0 flex flex-col p-4"></div>
  `,
  disabled: () => html`
    <div
      class="translucent bg-surfaceContainerHigh absolute z-dropdown inset-0
         flex flex-col items-center justify-center"
    >
      <span class="text-labelLarge text-onSurface">کار غیر فعال است</span>
    </div>
  `,
  nothing: () => nothing,
};
export const cardDialogSetter = (state: CardDialogStates | 'default') => () =>
  cardDialogContext.functionalValue((old) => {
    const disabled = selectedCardContext.value?.card.disabled === true;

    if (state === 'default' || old === state) return disabled ? 'disabled' : 'nothing';

    return state;
  });
