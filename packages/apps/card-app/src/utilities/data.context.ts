import IranianBanks from '@gecut/kartbook-banks-data';
import {ContextSignal} from '@gecut/signal';

import {pushNotification} from './notification.context.js';
import {api} from '../ky.js';

import type {Info as Bank} from '@gecut/kartbook-banks-data';
import type {CardData} from '@gecut/kartbook-types';

export type DataContextType =
  | {
    card: CardData;
    bank: Bank;
    primaryColor: string | null;
    amount?: number;
  }
  | 'disabled'
  | 'error'
  | 'no-username'
  | null;

export const dataContext = new ContextSignal<DataContextType>('data', 'AnimationFrame');

dataContext.value = null;

export async function load() {
  const slug = window.location.pathname.split('/');

  const username = slug[1] ?? '';
  const amount = amountSanitizer(slug[2] ?? '');

  if (username != '') {
    await api
      .get(username, {throwHttpErrors: false})
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            dataContext.value = 'disabled';
          }

          throw new Error('fetch failed: ' + response.statusText);
        }

        return response.json<{ok: true; data: CardData}>();
      })
      .then(async (response) => {
        const card = response.data;
        const bank = await IranianBanks.getInfo(card.cardNumber);

        if (!bank.id) {
          pushNotification({
            type: 'warning',
            msg: 'اطلاعات بانک یافت نشد',
          });
        }

        return {card, bank};
      })
      .then((data) => {
        dataContext.value = {
          ...data,
          primaryColor: data.bank.color
            ? `${data.bank.color.red},${data.bank.color.green},${data.bank.color.blue}`
            : null,
          amount,
        };
      })
      .catch((error) => {
        console.error(error);

        if (dataContext.value !== 'disabled') {
          dataContext.value = 'error';

          pushNotification({
            type: 'error',
            msg: 'مشکلی در دریافت داده به وجود آمده، دوباره تلاش کنید.',
          });
        }
      });
  }
  else {
    dataContext.value = 'no-username';
  }

  return;
}

export function amountSanitizer(amount: string): number | undefined {
  amount = amount.trim();

  if (amount === '') return undefined;

  amount = amount.replaceAll('z', '00');
  amount = amount.replaceAll('x', '000');

  return Number(amount);
}
