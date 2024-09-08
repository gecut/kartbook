import IranianBanks from '@gecut/kartbook-banks-data';
import {GecutState} from '@gecut/lit-helper';

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
  | 'loading';

export const dataState = new GecutState<DataContextType>('data', 'loading');

export async function load(): Promise<DataContextType> {
  const slug = window.location.pathname.split('/');

  const username = slug[1] ?? '';
  const amount = amountSanitizer(slug[2] ?? '');
  let isDisabled = false;

  if (username != '') {
    return await api
      .get(username, {throwHttpErrors: false})
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            isDisabled = true;

            throw new Error('fetch failed: card disabled');
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
        return {
          ...data,
          primaryColor: data.bank.color
            ? `${data.bank.color.red},${data.bank.color.green},${data.bank.color.blue}`
            : null,
          amount,
        };
      })
      .catch((error) => {
        console.error(error);

        if (!isDisabled) {
          pushNotification({
            type: 'error',
            msg: 'مشکلی در دریافت داده به وجود آمده، دوباره تلاش کنید.',
          });

          return 'error';
        }

        return 'disabled';
      });
  }

  return 'no-username';
}

export function amountSanitizer(amount: string): number | undefined {
  amount = amount.trim();

  if (amount === '') return undefined;

  amount = amount.replaceAll('z', '00');
  amount = amount.replaceAll('x', '000');

  return Number(amount);
}
