import {ContextSignal} from '@gecut/signal';

import {getAverageColor} from './average-color.js';
import {pushNotification} from './notification.context.js';
import {getBankInfo} from '../banks/index.js';
import {api} from '../ky.js';

import type {BankInfo} from '../banks/index.js';
import type {CardData} from '@gecut/kartbook-types';

export type DataContextType =
  | {
    card: CardData;
    bankInfo: NonNullable<BankInfo>;
    primaryColor: string | null;
    amount?: number;
  }
  | 'disabled'
  | 'error'
  | 'no-username'
  | null;

export const dataContext = new ContextSignal<DataContextType>('data', 'AnimationFrame');

dataContext.value = null;

export function load() {
  const slug = window.location.pathname.split('/');

  const username = slug[1] ?? '';
  const amount = amountSanitizer(slug[2] ?? '');

  if (username != '') {
    api
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
      .then((response) => {
        console.log(response);

        const card = response.data;
        const bankInfo = getBankInfo(card.cardNumber);

        if (!bankInfo?.bankName) {
          pushNotification({
            type: 'warning',
            msg: 'اطلاعات بانک یافت نشد',
          });
        }

        return {card, bankInfo};
      })
      .then(async ({card, bankInfo}) => ({card, bankInfo, primaryColor: await getAverageColor(bankInfo?.bankLogo)}))
      .then((data) => {
        dataContext.value = {
          ...data,
          primaryColor: data.primaryColor
            ? `${data.primaryColor?.r},${data.primaryColor?.g},${data.primaryColor?.b}`
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
}

export function amountSanitizer(amount: string): number | undefined {
  amount = amount.trim();

  if (amount === '') return undefined;

  amount = amount.replaceAll('z', '00');
  amount = amount.replaceAll('x', '000');

  return Number(amount);
}
