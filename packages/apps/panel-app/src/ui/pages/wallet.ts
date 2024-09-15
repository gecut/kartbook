import {gecutButton, gecutList, icon} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper';
import {html} from 'lit/html.js';

import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';

import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
import SolarAddCircleLineDuotone from '~icons/solar/add-circle-line-duotone';
import SolarAddCircleLinear from '~icons/solar/add-circle-linear';
import SolarDownloadMinimalisticLineDuotone from '~icons/solar/download-minimalistic-line-duotone';
import SolarMinusCircleBoldDuotone from '~icons/solar/minus-circle-bold-duotone';
import SolarMinusCircleLineDuotone from '~icons/solar/minus-circle-line-duotone';
import SolarMinusCircleLinear from '~icons/solar/minus-circle-linear';
import SolarUserHeartRoundedLineDuotone from '~icons/solar/user-heart-rounded-line-duotone';

import type {TransactionTypes, TransactionStatuses, TransactionInterface} from '@gecut/kartbook-types/wallet.js';
import type {ArrayValues} from '@gecut/types';

const transactionIcon = (
  type: ArrayValues<typeof TransactionTypes>,
  status: ArrayValues<typeof TransactionStatuses>,
) => {
  switch (status) {
    case 'in-progress':
      switch (type) {
        case 'withdrawal':
          return html`<i class="text-tertiary">${icon({svg: SolarMinusCircleLineDuotone})}</i>`;
        case 'deposit':
          return html`<i class="text-tertiary">${icon({svg: SolarAddCircleLineDuotone})}</i>`;
      }
    case 'done':
      switch (type) {
        case 'withdrawal':
          return html`<i class="text-primary">${icon({svg: SolarMinusCircleBoldDuotone})}</i>`;
        case 'deposit':
          return html`<i class="text-primary">${icon({svg: SolarAddCircleBoldDuotone})}</i>`;
      }
    case 'rejected':
      switch (type) {
        case 'withdrawal':
          return html`<i class="text-error">${icon({svg: SolarMinusCircleLinear})}</i>`;
        case 'deposit':
          return html`<i class="text-error">${icon({svg: SolarAddCircleLinear})}</i>`;
      }
  }
};
const transactionType = (type: ArrayValues<typeof TransactionTypes>) => {
  switch (type) {
    case 'withdrawal':
      return 'برداشت';
    case 'deposit':
      return 'واریز';
  }
};
const transactionStatus = (status: ArrayValues<typeof TransactionStatuses>) => {
  switch (status) {
    case 'in-progress':
      return 'در حال بررسی';
    case 'done':
      return 'موفق';
    case 'rejected':
      return 'رد شده';
  }
};
const transactionHeadline = (transaction: TransactionInterface) =>
  transactionType(transaction.type) + ' ' + transactionStatus(transaction.status);

export function $WalletPage() {
  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <div class="w-full h-full flex flex-col justify-center py-4 *:animate-fadeInSlide">
        ${gecutContext(userContext, (user) => {
          const balance = user.wallet.transactions
            .map((transaction) => {
              if (transaction.status === 'rejected') return 0;

              switch (transaction.type) {
                case 'withdrawal':
                  return -transaction.amount;
                case 'deposit':
                  return transaction.amount;
              }
            })
            .reduce((p, c) => p + c, 0);

          return html`
            <div class="gecut-card-elevated flex flex-col items-center justify-center p-4 gap-4">
              <div class="text-labelLarge text-onSurface">موجودی کیف پول شما</div>
              <div class="text-displayMedium text-primary">
                ${i18n.n(balance)}
                <span class="text-labelLarge">﷼</span>
              </div>
              <div class="flex flex-col gap-2 w-full">
                ${gecutButton({
                  type: 'filledTonal',
                  label: 'دعوت دوستان',
                  icon: {svg: SolarUserHeartRoundedLineDuotone},
                })}
                ${gecutButton({
                  type: 'filled',
                  label: 'بـرداشت وجـه',
                  icon: {svg: SolarDownloadMinimalisticLineDuotone},
                })}
              </div>
            </div>
            ${gecutList(
              {
                box: 'elevated',
                scrollable: true,
              },
              user.wallet.transactions,
              (transaction) => ({
                divider: true,
                headline: transactionHeadline(transaction),
                trailingSupportingText: {
                  type: 'string',
                  value: i18n.n(transaction.amount) + ' ﷼',
                },
                leading: {
                  element: 'template',
                  template: transactionIcon(transaction.type, transaction.status),
                },
              }),
            )}
          `;
        })}
      </div>
    </main>
  `;
}
