import {divider, gecutButton, icon} from '@gecut/components';
import IranianBanks from '@gecut/kartbook-banks-data';
import {gecutContext, GecutState} from '@gecut/lit-helper';
import {cache} from 'lit/directives/cache.js';
import {repeat} from 'lit/directives/repeat.js';
import {until} from 'lit/directives/until.js';
import {html} from 'lit/html.js';

import kartbookLogo from '../../../public/logo.png';
import {client} from '../../client/index.js';
import {cardsContext} from '../../contexts/cards.js';
import {loadUser, userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {sbm} from '../../utilities/sbm.js';
import {router} from '../router/index.js';
import {resolvePath} from '../router/resolver.js';

import SolarCard2LineDuotone from '~icons/solar/card-2-line-duotone';
import SolarChatRoundMoneyLineDuotone from '~icons/solar/chat-round-money-line-duotone';

import type {WalletData} from '@gecut/kartbook-types';

export function $WithdrawalPage() {
  const withdrawalDataState = new GecutState<
    Required<Pick<WalletData['transactions'][number], 'amount' | 'iban'>> & {loading: boolean}
  >('withdrawal.data', {
    amount: 0,
    iban: '',
    loading: false,
  });

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
            <form
              class="flex flex-col gecut-card-elevated p-4 gap-1 *:animate-fadeInSlide *:transition *:duration-500"
              @submit=${(event: Event) => {
                event.preventDefault();

                withdrawalDataState.value = {
                  ...withdrawalDataState.value!,
                  loading: true,
                };

                const {amount, iban} = withdrawalDataState.value;

                client.seller.withdrawal
                  .mutate({amount, iban})
                  .then(() => {
                    sbm.notify({
                      message: 'درخواست برداشت شما ثبت شد! تا ۲ روز کاری دیگر مبلغ برداشتی به حساب شما واریز می شود',
                      close: true,
                      textMultiLine: true,
                    });
                  })
                  .then(loadUser)
                  .then(() => router.navigate(resolvePath('wallet')))
                  .finally(() => {
                    withdrawalDataState.value = {
                      ...withdrawalDataState.value!,
                      loading: false,
                    };
                  });
              }}
            >
              <div class="flex flex-col gap-3">
                <label class="gecut-input">
                  ${icon({svg: SolarChatRoundMoneyLineDuotone})}

                  <input
                    lang="en"
                    id="withdrawalAmount"
                    type="number"
                    name="amount"
                    inputmode="numeric"
                    placeholder="مبلغ برداشت"
                    max=${balance}
                    min=${500_000}
                    required
                    @input=${(event: InputEvent) => {
                      const target = event.target as HTMLInputElement;

                      withdrawalDataState.value = {
                        ...withdrawalDataState.value!,

                        amount: target.valueAsNumber || 0,
                      };
                    }}
                  />
                </label>

                <p class="text-center text-labelMedium text-onSurfaceVariant">
                  موجودی قابل برداشت: ${i18n.n(balance)} ﷼
                </p>

                ${gecutButton({
                  type: 'outlined',
                  label: 'برداشت تمام موجودی',
                  htmlType: 'button',
                  events: {
                    click: () => {
                      const input = document.querySelector<HTMLInputElement>('input#withdrawalAmount');

                      if (input) {
                        input.setAttribute('value', balance.toString());

                        input.blur();
                      }

                      withdrawalDataState.value = {
                        ...withdrawalDataState.value!,

                        amount: balance,
                      };
                    },
                  },
                })}
              </div>

              ${gecutContext(
                cardsContext,
                (cards) => html`
                  <div class="flex flex-col gap-2 my-4">
                    ${divider({})}

                    <h2 class="text-start text-labelLarge text-onSurfaceVariant flex gap-2 my-2 mx-1 items-center">
                      ${icon({svg: SolarCard2LineDuotone})} کارت مقصد:
                    </h2>

                    ${repeat(
                      cards,
                      (card) => card._id,
                      (card, index) => html`
                        <label
                          class="flex overflow-hidden bg-surfaceContainerLow p-4 gap-4 transition
                               justify-between items-center rounded-xl text-onSurfaceVariant cursor-pointer
                               has-[:checked]:bg-primaryContainer duration-500"
                        >
                          <input
                            type="radio"
                            name="card"
                            .value=${card.iban ?? ''}
                            hidden
                            class="hidden"
                            @change=${(event: InputEvent) => {
                              const target = event.target as HTMLInputElement;

                              withdrawalDataState.value = {
                                ...withdrawalDataState.value!,

                                iban: target.value,
                              };
                            }}
                          />

                          <div
                            class="size-6 rounded-full bg-primary text-onPrimary flex items-center
               justify-center text-labelSmall"
                          >
                            ${index + 1}
                          </div>
                          <div class="text-labelLarge">
                            <span class="text-onSurfaceVariant">k32.ir/</span>
                            <span class="text-onSurface font-bold">${card.slug}</span>
                          </div>
                          <div class="size-6">
                            ${cache(
                              until(
                                IranianBanks.getInfo(card.cardNumber).then((info) => info.image?.cloneNode(true)),
                                html`<img src=${kartbookLogo} alt="logo" />`,
                              ),
                            )}
                          </div>
                        </label>
                      `,
                    )}
                    ${divider({})}
                  </div>
                `,
              )}
              ${withdrawalDataState.hydrate((data) => {
                const disabled = data.amount > balance || data.amount < 500_000 || data.iban.trim() == '';

                return gecutButton({
                  htmlType: 'submit',
                  type: disabled ? 'filledTonal' : 'filled',
                  label: `درخواست برداشت ${i18n.n(data.amount)} ﷼`,
                  disabled,
                  loading: data.loading,
                });
              })}
            </form>
          `;
        })}
      </div>
    </main>
  `;
}
