import {CardInterface, StringifyEntity} from '@gecut/kartbook-types';
import {ContextSignal} from '@gecut/signal';
import {BankInfo, getBankInfo} from '../banks/index.js';
import {api} from '../ky.js';
import {pushNotification} from './notification.context.js';
import {getAverageColor} from './average-color.js';

export type DataContextType =
  | {
      card: StringifyEntity<CardInterface>;
      bankInfo: NonNullable<BankInfo>;
      primaryColor: string | null;
      amount?: number;
    }
  | 'disabled'
  | 'error'
  | 'no-username'
  | null;

export const dataContext = new ContextSignal<DataContextType>('data');

dataContext.setValue(null);

export function load() {
  const slug = window.location.pathname.split('/');

  const username = slug[1] ?? '';
  const amount = amountSanitizer(slug[2] ?? '');

  if (username != '') {
    api
      .get('cards/' + username, {throwHttpErrors: false})
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            dataContext.setValue('disabled');
          }

          throw new Error('fetch failed: ' + response.statusText);
        }

        return response.json<{ok: true; data: StringifyEntity<CardInterface>}>();
      })
      .then((response) => {
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
        dataContext.setValue({
          ...data,
          primaryColor: data.primaryColor
            ? `${data.primaryColor?.r},${data.primaryColor?.g},${data.primaryColor?.b}`
            : null,
          amount,
        });
      })
      .catch(() => {
        if (dataContext.getValue() !== 'disabled') {
          dataContext.setValue('error');

          pushNotification({
            type: 'error',
            msg: 'مشکلی در دریافت داده به وجود آمده، دوباره تلاش کنید.',
          });
        }
      });
  } else {
    dataContext.setValue('no-username');
  }
}

export function amountSanitizer(amount: string): number | undefined {
  amount = amount.trim();

  if (amount === '') return undefined;

  amount = amount.replaceAll('z', '00');
  amount = amount.replaceAll('x', '000');

  return Number(amount);
}
