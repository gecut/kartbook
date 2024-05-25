import {icon} from '@gecut/components';
import {map} from '@gecut/lit-helper';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {GecutApp} from '@gecut/lit-helper/pages/app.js';
import clipboard from '@gecut/utilities/clipboard.js';
import {PropertyValues, html, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';
import 'unfonts.css';

import {BankInfo, getBankInfo} from './banks/index.js';
import {api} from './ky.js';
import './styles/global.css';
import {getAverageColor} from './utilities/average-color.js';
import {
  Notification,
  notificationContext,
  notificationRenderer,
  pushNotification,
} from './utilities/notification.context.js';

import type {CardInterface, StringifyEntity} from '@gecut/kartbook-types';
import type {RenderResult} from '@gecut/types';

type Data = {
  card: StringifyEntity<CardInterface>;
  bankInfo: NonNullable<BankInfo>;
  primaryColor: string;
};

@customElement('app-index')
export class AppIndex extends GecutApp {
  @state() data?: Data;
  @state() username = '';
  @state() amount = 0;

  override render(): RenderResult {
    return html`
      <div class="grow relative">
        <div class="absolute inset-0 flex flex-col gap-3 justify-start items-start pt-6">
          ${gecutContext<Notification | null>()(notificationContext, notificationRenderer)}
        </div>
      </div>
      ${this.renderSkeletonCard()} ${this.renderCard()} ${this.renderAmountBox()}
      <div class="grow relative">
        <div
          class="absolute inset-0 flex flex-col gap-3 justify-center items-center text-bodySmall lg:text-bodyMedium text-onSurfaceVariant"
        >
          <img class="h-6 md:h-8 lg:h-10" src="/icon.png" />

          <span>پلتفرم شمـاره کـارت آنـلایـــن, کـــارت بـوک</span>

          <a class="flex" href="//k32.ir" target="_blank" dir="ltr">
            <span class="text-primary">K32</span>
            <span>.ir</span>
          </a>
        </div>
      </div>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    const slug = window.location.pathname.split('/');

    this.username = slug[1] ?? '';
    this.amount = Number(slug[2] ?? 0);

    this.log.methodArgs?.('load', {username: this.username, amount: this.amount, slug});

    if (this.username != '') {
      api
        .get('cards/' + this.username)
        .json<{ok: boolean; data: StringifyEntity<CardInterface>}>()
        .then((response) => {
          const card = response.data;
          const bankInfo = getBankInfo(card.cardNumber);

          if (!bankInfo) {
            throw new Error('bank info null');
          }

          return {card, bankInfo};
        })
        .then(async ({card, bankInfo}) => ({card, bankInfo, primaryColor: await getAverageColor(bankInfo.bankLogo)}))
        .then((data) => {
          this.data = {
            ...data,
            primaryColor: `${data.primaryColor?.r},${data.primaryColor?.g},${data.primaryColor?.b}`,
          };
        })
        .catch(() => {
          pushNotification({
            type: 'error',
            msg: 'مشکلی در دریافت داده به وجود آمده، دوباره تلاش کنید.',
          });
        });
    }
  }

  protected renderSkeletonCard() {
    if (this.data) return nothing;

    return html`
      <div
        class="w-full h-56 bg-surfaceVariant rounded-2xl shadow-xl relative overflow-hidden
               animate-pulse *:animate-pulse"
      >
        <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
        <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

        <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
          <div class="size-16 mb-3 mt-1 mx-2 rounded-xl bg-outline animate-pulse"></div>

          <div class="grow"></div>

          <div class="flex justify-between cursor-pointer" dir="ltr">
            <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
            <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
            <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
            <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
          </div>
          <div class="flex justify-start cursor-pointer mt-4" dir="ltr">
            <span class="h-3 w-52 rounded-md bg-outline animate-pulse"></span>
          </div>

          <div class="grow"></div>

          <div class="h-4 w-32 rounded-md bg-outline opacity-85 animate-pulse"></div>
        </div>
      </div>
    `;
  }
  protected renderCard() {
    if (!this.data) return nothing;

    return html`
      <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
        <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
        <span
          class="absolute inset-0 opacity-25 bg-cover bg-gradient-to-bl from-primary from-0%
                 to-transparent to-100% z-[4]"
          style=${styleMap({
            '--tw-gradient-from': `rgba(${this.data.primaryColor}, 1) var(--tw-gradient-from-position)`,
            '--tw-gradient-to': `rgba(${this.data.primaryColor}, 0) var(--tw-gradient-to-position)`,
            '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
          })}
        ></span>
        <span
          class="absolute inset-0 opacity-30 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent
                 to-60% z-[4]"
          style=${styleMap({
            '--tw-gradient-from': `rgba(${this.data.primaryColor}, 1) var(--tw-gradient-from-position)`,
            '--tw-gradient-to': `rgba(${this.data.primaryColor}, 0) var(--tw-gradient-to-position)`,
            '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
          })}
        ></span>

        <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

        <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
          <div class="size-20 flex items-center justify-center">
            <img class="h-full w-full object-contain" src=${this.data.bankInfo.bankLogo} />
          </div>

          <div class="grow"></div>

          <div
            class="flex justify-between text-titleLarge text-[20px] text-onSurface cursor-pointer"
            dir="ltr"
            @click=${this.copyCardNumber}
          >
            ${map(this, this.data.card.cardNumber, (str) => html`<span>${str}</span>`)}
          </div>

          <div class="flex justify-between items-center text-bodyMedium text-outline pt-1 mt-1" dir="ltr">
            <span class="opacity-85 cursor-pointer" @click=${this.copyIBAN}>IR${this.data.card.iban}</span>

            <span
              class="[&>.gecut-icon]:text-[18px] [&>.gecut-icon]:text-outline cursor-pointer"
              @click=${this.copyIBAN}
            >
              ${icon({
                // eslint-disable-next-line max-len
                svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"/><path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828C5.343 2 7.229 2 11 2h4a3 3 0 0 1 3 3" opacity="0.5"/></g></svg>',
              })}
            </span>
          </div>

          <div class="grow"></div>

          <div class="text-bodyMedium text-outline opacity-85">
            ${this.data.card.owner.firstName + ' ' + this.data.card.owner.lastName}
          </div>
        </div>
      </div>
    `;
  }
  protected renderAmountBox() {
    if (this.amount <= 0) return nothing;

    return html`
      <div class="-mt-3.5 h-7 inset-x-0 flex items-center justify-center z-topness">
        <div
          class="bg-onSurface text-surfaceVariant h-full px-4 gap-1 flex items-center justify-center
                 rounded-xl text-bodySmall"
        >
          <span>مبلغ: </span>
          <span class="text-labelMedium text-surface">${this.amount.toLocaleString('fa-IR')}</span>
          <span>ریال</span>
        </div>
      </div>
    `;
  }

  protected async copyCardNumber() {
    if (!this.data)
      return pushNotification({
        type: 'error',
        msg: 'شماره کارت وجود ندارد',
      });

    try {
      await clipboard.write(this.data.card.cardNumber.join(''));

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
  }
  protected async copyIBAN() {
    if (!this.data)
      return pushNotification({
        type: 'error',
        msg: 'شماره شبا وجود ندارد',
      });

    try {
      await clipboard.write(this.data.card.iban);

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
  }
}
