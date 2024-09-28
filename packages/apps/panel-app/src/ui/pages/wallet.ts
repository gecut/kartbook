import {gecutButton, gecutList, icon} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper';
import {nextAnimationFrame} from '@gecut/utilities/wait/polyfill.js';
import jalali from 'jalali-moment';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {resolvePath} from '../router/resolver.js';

import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
import SolarAddCircleLineDuotone from '~icons/solar/add-circle-line-duotone';
import SolarAddCircleLinear from '~icons/solar/add-circle-linear';
import SolarDownloadMinimalisticLineDuotone from '~icons/solar/download-minimalistic-line-duotone';
import SolarMinusCircleBoldDuotone from '~icons/solar/minus-circle-bold-duotone';
import SolarMinusCircleLineDuotone from '~icons/solar/minus-circle-line-duotone';
import SolarMinusCircleLinear from '~icons/solar/minus-circle-linear';
import SolarNotificationLinesRemoveLineDuotone from '~icons/solar/notification-lines-remove-line-duotone';
import SolarUserHeartRoundedLineDuotone from '~icons/solar/user-heart-rounded-line-duotone';

import type {TransactionTypes, TransactionStatuses, WalletData} from '@gecut/kartbook-types/wallet.js';
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
      return 'افزایش اعتبار';
  }
};
const transactionStatus = (status: ArrayValues<typeof TransactionStatuses>) => {
  switch (status) {
    case 'in-progress':
      return 'در حال بررسی';
    case 'done':
      return 'موفق';
    case 'rejected':
      return 'ناموفق';
  }
};
const transactionHeadline = (transaction: WalletData['transactions'][number]) =>
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

          const sortedTransactions = user.wallet.transactions.sort(
            (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
          );

          nextAnimationFrame(() => {
            const button = document.querySelector<HTMLLinkElement>(`a[href='${resolvePath('wallet/withdrawal')}']`);

            if (button) {
              fetch('http://worldtimeapi.org/api/timezone/Asia/Tehran')
                .then((r) => r.json())
                .then((d) => new Date(d.datetime))
                .then((now) => jalali(now))
                .then((now) => {
                  const dayOfMonth = now.jDate();

                  if (dayOfMonth > 5) return false;

                  return true;
                })
                .then((canWithdrawal) => {
                  button.removeAttribute('loading');
                });
            }
          });

          return html`
            ${when(
              user?.seller?.isSeller === true,
              () => html`
                <div class="gecut-card-elevated flex flex-col items-center justify-center p-4 gap-4">
                  <h2 class="text-titleMedium text-onSurfaceVariant w-full">موجودی کیف پول شما</h2>

                  <div class="text-displayMedium text-primary">
                    ${i18n.n(balance)}
                    <span class="text-labelLarge">﷼</span>
                  </div>
                  <div class="flex flex-col gap-2 w-full">
                    ${gecutButton({
                      type: 'filledTonal',
                      label: 'دعوت دوستان',
                      icon: {svg: SolarUserHeartRoundedLineDuotone},
                      href: resolvePath('seller'),
                    })}
                    ${gecutButton({
                      type: 'filled',
                      label: 'بـرداشت وجـه',
                      icon: {svg: SolarDownloadMinimalisticLineDuotone},
                      href: resolvePath('wallet/withdrawal'),
                      loading: true,
                    })}
                  </div>
                </div>
              `,
            )}
            <div class="gecut-card-elevated p-0 flex flex-col items-center justify-content overflow-auto relative">
              <h2 class="sticky inset-x-0 top-0 text-titleMedium text-onSurfaceVariant p-4 w-full">لیست تراکنش ها</h2>

              ${when(
                sortedTransactions.length === 0,
                () => html`
                  <div class="flex w-full gap-4 p-4 pt-0 items-center justify-center">
                    <i class="[&>.gecut-icon]:text-xl">${icon({svg: SolarNotificationLinesRemoveLineDuotone})}</i>
                    <span>هیچ تراکنشی انجام ندادید</span>
                  </div>
                `,
              )}
              ${gecutList(
                {
                  scrollable: true,
                },
                sortedTransactions,
                (transaction, index) => ({
                  divider: sortedTransactions.length - 1 <= index ? false : true,
                  headline: transactionHeadline(transaction),
                  supportingText:
                    transaction.message +
                    ((transaction.iban?.trim().length ?? 0) > 0 ? `شبا مقصد: IR${transaction.iban}` : ''),
                  supportingTextTwoLine: true,
                  trailing: {
                    element: 'template',
                    template: html`
                      <div class="flex flex-col items-end gap-2">
                        <span class="text-bodySmall text-onSurface">${i18n.n(transaction.amount)} ﷼</span>
                        <span class="text-bodySmall text-onSurfaceVariant">
                          ${i18n.d(transaction.createdAt, {
                            hourCycle: 'h24',
                            dateStyle: 'short',
                          })}
                          -
                          ${i18n.t(transaction.createdAt, {
                            hourCycle: 'h24',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    `,
                  },
                  leading: {
                    element: 'template',
                    template: transactionIcon(transaction.type, transaction.status),
                  },
                }),
              )}
            </div>
          `;
        })}
      </div>
    </main>
  `;
}
