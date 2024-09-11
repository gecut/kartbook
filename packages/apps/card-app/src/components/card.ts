import {icon} from '@gecut/components';
import {map} from '@gecut/lit-helper';
import clipboard from '@gecut/utilities/clipboard.js';
import {styleMap} from 'lit/directives/style-map.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {disabledCard} from './disabled.card.js';
import {errorCard} from './error.card.js';
import {skeletonCard} from './skeleton.card.js';
import {pushNotification} from '../utilities/notification.context.js';

import type {DataContextType} from '../utilities/data.state.js';

export function card(data: DataContextType) {
  if (data === 'loading') return skeletonCard;
  if (data === 'error' || data === 'no-username') return errorCard;
  if (data === 'disabled') return disabledCard;

  const copyCardNumber = async () => {
    try {
      await clipboard.write(data.card.cardNumber.join(''));

      return await pushNotification({
        type: 'success',
        msg: 'شماره کارت کپی شد',
      });
    } catch {
      return await pushNotification({
        type: 'error',
        msg: 'مشکلی در کپی کردن شماره کارت ایجاد شد، دوباره امتحان کنید',
      });
    }
  };
  const copyIBAN = async () => {
    try {
      await clipboard.write(data.card.iban ?? '');

      return await pushNotification({
        type: 'success',
        msg: 'شماره شبا کپی شد',
      });
    } catch {
      return await pushNotification({
        type: 'error',
        msg: 'مشکلی در کپی کردن شماره شبا ایجاد شد، دوباره امتحان کنید',
      });
    }
  };

  return html`
    <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
      <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
      ${when(
        data.primaryColor,
        () => html`
          <span
            class="absolute inset-0 opacity-25 bg-cover bg-gradient-to-bl from-primary from-0%
               to-transparent to-100% z-[4]"
            style=${styleMap({
              '--tw-gradient-from': `rgba(${data?.primaryColor}, 1) var(--tw-gradient-from-position)`,
              '--tw-gradient-to': `rgba(${data?.primaryColor}, 0) var(--tw-gradient-to-position)`,
              '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
            })}
          ></span>
          <span
            class="absolute inset-0 opacity-30 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent
               to-60% z-[4]"
            style=${styleMap({
              '--tw-gradient-from': `rgba(${data?.primaryColor}, 1) var(--tw-gradient-from-position)`,
              '--tw-gradient-to': `rgba(${data?.primaryColor}, 0) var(--tw-gradient-to-position)`,
              '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
            })}
          ></span>
        `,
        () => html`
          <span
            class="absolute inset-0 opacity-5 bg-cover bg-gradient-to-bl from-primary
                   from-0% to-transparent to-100% z-[4]"
          ></span>
          <span
            class="absolute inset-0 opacity-15 bg-cover bg-gradient-to-bl from-primary
                   from-0% to-transparent to-50% z-[4]"
          ></span>
        `,
      )}

      <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

      <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
        <div class="size-20 flex items-center justify-center *:h-full *:w-full *:object-contain">
          ${data.bank.image ?? html`<img src=${data.bank.logo} />`}
        </div>

        <div class="grow"></div>

        <div
          class="flex justify-between text-titleLarge text-[20px] text-onSurface cursor-pointer"
          dir="ltr"
          @click=${copyCardNumber}
        >
          ${map(null, data.card.cardNumber, (str) => html`<span>${str}</span>`)}
        </div>

        <div class="flex justify-between items-center text-bodyMedium text-outline pt-1 mt-1" dir="ltr">
          <span class="opacity-85 cursor-pointer" @click=${copyIBAN}>IR${data.card.iban}</span>

          <span class="[&>.gecut-icon]:text-[18px] [&>.gecut-icon]:text-outline cursor-pointer" @click=${copyIBAN}>
            ${icon({
              // eslint-disable-next-line max-len
              svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"/><path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828C5.343 2 7.229 2 11 2h4a3 3 0 0 1 3 3" opacity="0.5"/></g></svg>',
            })}
          </span>
        </div>

        <div class="grow"></div>

        <div class="text-bodyMedium text-outline opacity-85">
          ${data.card.ownerName || data.card.owner.firstName + ' ' + data.card.owner.lastName}
        </div>
      </div>
    </div>

    ${when(
      data.amount,
      () => html`
        <div class="-mt-3.5 h-7 inset-x-0 flex items-center justify-center z-topness">
          <div
            class="bg-onSurface text-surfaceVariant h-full px-4 gap-1 flex items-center justify-center
                 rounded-xl text-bodySmall"
          >
            <span>مبلغ: </span>
            <span class="text-labelMedium text-surface">${data.amount?.toLocaleString('fa-IR')}</span>
            <span>ریال</span>
          </div>
        </div>
      `,
    )}
  `;
}
