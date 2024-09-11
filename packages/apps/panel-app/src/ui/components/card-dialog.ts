import {gecutIconButton, icon} from '@gecut/components';
import {ContextSignal} from '@gecut/signal';
import clipboard from '@gecut/utilities/clipboard.js';
import {html, nothing} from 'lit/html.js';
import qrCode from 'qrcode';

import {selectedCardContext} from '../../contexts/cards.js';
import {sbm} from '../../utilities/sbm.js';

import SolarAlarmTurnOffLineDuotone from '~icons/solar/alarm-turn-off-line-duotone';
import SolarCalendarMinimalisticLineDuotone from '~icons/solar/calendar-minimalistic-line-duotone';
import SolarCopyBoldDuotone from '~icons/solar/copy-bold-duotone';
import SolarQrCodeBoldDuotone from '~icons/solar/qr-code-bold-duotone';
import SolarShareBoldDuotone from '~icons/solar/share-bold-duotone';

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
  share: () => {
    const card = selectedCardContext.value?.card;
    const cardURL = 'k32.ir/' + card?.slug;

    return html`
      <div
        class="translucent bg-surfaceContainerHigh absolute z-dropdown inset-0 flex items-center
               justify-center p-4"
      >
        <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
          ${gecutIconButton({
            type: 'filledTonal',
            name: 'share',
            svg: SolarQrCodeBoldDuotone,
            events: {
              click: async () =>
                window.open(
                  await qrCode.toDataURL(cardURL, {
                    color: {
                      dark: '#006c4d',
                      light: '#f8faf6',
                    },
                    width: 512,
                    margin: 4,
                    type: 'image/webp',
                  }),
                  '_blank',
                ),
            },
          })}

          <span class="text-labelMedium text-onSurfaceVariant">کیوآر کد</span>
        </div>

        <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
          ${gecutIconButton({
            type: 'filledTonal',
            name: 'share',
            svg: SolarShareBoldDuotone,
            events: {
              click: () => {
                const shareData = {
                  url: 'https://' + cardURL,
                  text: card?.ownerName,
                  title: 'پلتفرم شمـاره کـارت آنـلایـــن, کـــارت بـوک',
                };

                if (
                  typeof navigator.canShare === 'function' &&
                  typeof navigator.share === 'function' &&
                  navigator.canShare(shareData)
                ) {
                  navigator.share(shareData).catch(() =>
                    sbm.notify({
                      message: 'متاسفانه در حال حاضر امکان اشتراک‌گذاری وجود ندارد. لطفاً دوباره تلاش کنید.',
                      close: true,
                    }),
                  );
                } else {
                  sbm.notify({
                    message: 'دستگاه شما فعلاً قادر به اشتراک‌گذاری نیست.',
                    close: true,
                  });
                }
              },
            },
          })}

          <span class="text-labelMedium text-onSurfaceVariant">اشتراک لینک</span>
        </div>

        <div class="flex flex-col gap-2 justify-center items-center kb-icon-buttons min-w-20">
          ${gecutIconButton({
            type: 'filledTonal',
            name: 'share',
            svg: SolarCopyBoldDuotone,
            events: {
              click: () => {
                clipboard
                  .write(cardURL)
                  .then(() =>
                    sbm.notify({
                      message: 'لینک کارت با موفقیت کپی شد.',
                      close: true,
                    }),
                  )
                  .catch(() =>
                    sbm.notify({
                      message: 'متأسفانه در کپی کردن لینک کارت با مشکل مواجه شدیم. لطفاً مجدد تلاش کنید.',
                      close: true,
                    }),
                  );
              },
            },
          })}

          <span class="text-labelMedium text-onSurfaceVariant">کپی لینک</span>
        </div>
      </div>
    `;
  },
  disabled: () => html`
    <div
      class="translucent bg-surfaceContainerHigh absolute z-dropdown inset-0
         flex flex-col items-center justify-center"
    >
      <span class="text-labelLarge text-onSurface">کارت غیر فعال است</span>
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
