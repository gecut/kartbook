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
import {when} from 'lit/directives/when.js';

type Data = {
  card: StringifyEntity<CardInterface>;
  bankInfo: NonNullable<BankInfo>;
  primaryColor: string | null;
};

@customElement('app-index')
export class AppIndex extends GecutApp {
  @state() private data?: Data;
  @state() private username = '';
  @state() private amount = 0;
  @state() private errored = false;
  @state() private disabled = false;

  override render(): RenderResult {
    return html`
      <div class="grow relative">
        <div class="absolute inset-0 flex flex-col gap-3 justify-start items-start pt-6">
          ${gecutContext<Notification | null>(notificationContext, notificationRenderer)}
        </div>
      </div>
      ${this.renderSkeletonCard()} ${this.renderCard()} ${this.renderAmountBox()} ${this.renderErrorCard()}
      ${this.renderDisabledCard()}
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

    this.log.methodArgs?.('loading', {username: this.username, amount: this.amount, slug});

    if (this.username != '') {
      api
        .get('cards/' + this.username, {throwHttpErrors: false})
        .then((response) => {
          if (!response.ok) {
            if (response.status === 403) {
              this.disabled = true;
            }

            throw new Error('fetch failed: ' + response.statusText);
          }

          return response.json<{ok: true; data: StringifyEntity<CardInterface>}>();
        })
        .then((response) => {
          const card = response.data;
          const bankInfo = getBankInfo(card.cardNumber);

          this.log.methodArgs?.('loaded', {card, bankInfo});

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
          this.data = {
            ...data,
            primaryColor: data.primaryColor
              ? `${data.primaryColor?.r},${data.primaryColor?.g},${data.primaryColor?.b}`
              : null,
          };
        })
        .catch((error) => {
          this.log.error('loading', 'load_error', error);

          this.errored = true;

          if (!this.disabled) {
            pushNotification({
              type: 'error',
              msg: 'مشکلی در دریافت داده به وجود آمده، دوباره تلاش کنید.',
            });
          }
        });
    } else {
      this.errored = true;

      pushNotification({
        type: 'error',
        msg: 'نام کاربری وجود ندارد!',
      });
    }
  }

  protected renderSkeletonCard() {
    if (this.data || this.errored) return nothing;

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
  protected renderDisabledCard() {
    if (!this.disabled) return nothing;

    return html`
      <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
        <span
          class="absolute inset-0 backdrop-blur-sm backdrop-brightness-90 flex flex-col justify-center items-center text-labelLarge text-onSurface [&>.gecut-icon]:text-[3rem] z-[10]"
        >
          ${icon({
            // eslint-disable-next-line max-len
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2.69 6.705a.75.75 0 0 0-1.38.59zm12.897 6.624l-.274-.698zm-6.546.409a.75.75 0 1 0-1.257-.818zm-2.67 1.353a.75.75 0 1 0 1.258.818zM22.69 7.295a.75.75 0 0 0-1.378-.59zM19 11.13l-.513-.547zm.97 2.03a.75.75 0 1 0 1.06-1.06zm-8.72 3.34a.75.75 0 0 0 1.5 0zm5.121-.591a.75.75 0 1 0 1.258-.818zm-10.84-4.25A.75.75 0 0 0 4.47 10.6zm-2.561.44a.75.75 0 0 0 1.06 1.06zM12 13.25c-3.224 0-5.539-1.605-7.075-3.26a13.637 13.637 0 0 1-1.702-2.28a11.707 11.707 0 0 1-.507-.946a3.903 3.903 0 0 1-.022-.049l-.004-.01l-.001-.001L2 7a76 76 0 0 0-.69.296h.001l.001.003l.003.006a3.837 3.837 0 0 0 .04.088a13.202 13.202 0 0 0 .58 1.084c.41.69 1.034 1.61 1.89 2.533C5.54 12.855 8.224 14.75 12 14.75zm3.313-.62c-.97.383-2.071.62-3.313.62v1.5c1.438 0 2.725-.276 3.862-.723zm-7.529.29l-1.413 2.17l1.258.818l1.412-2.171zM22 7l-.69-.296h.001v.002l-.007.013a8.017 8.017 0 0 1-.151.313a13.298 13.298 0 0 1-2.666 3.55l1.026 1.094a14.802 14.802 0 0 0 3.122-4.26l.039-.085l.01-.024l.004-.007v-.003h.001v-.001zm-3.513 3.582c-.86.806-1.913 1.552-3.174 2.049l.549 1.396c1.473-.58 2.685-1.444 3.651-2.351zm-.017 1.077l1.5 1.5l1.06-1.06l-1.5-1.5zM11.25 14v2.5h1.5V14zm3.709-.262l1.412 2.171l1.258-.818l-1.413-2.171zm-10.49-3.14l-1.5 1.5L4.03 13.16l1.5-1.5z"/></svg>',
          })}
          <span>کارت غیر فعال است</span>
        </span>
        <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
        <span
          class="absolute inset-0 opacity-5 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-100% z-[4]"
        ></span>
        <span
          class="absolute inset-0 opacity-15 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-50% z-[4]"
        ></span>

        <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

        <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
          <div class="size-20 flex items-center justify-center">
            <img class="h-full w-full object-contain" src=${'/icon.png'} />
          </div>

          <div class="grow"></div>

          <div class="flex justify-between text-titleLarge text-[20px] text-onSurface cursor-pointer" dir="ltr">
            <span>0000</span>
            <span>0000</span>
            <span>0000</span>
            <span>0000</span>
          </div>

          <div class="flex justify-between items-center text-bodyMedium text-outline pt-1 mt-1" dir="ltr">
            <span class="opacity-85 cursor-pointer">IR000000000000000000000</span>

            <span class="[&>.gecut-icon]:text-[18px] [&>.gecut-icon]:text-outline cursor-pointer">
              ${icon({
                // eslint-disable-next-line max-len
                svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"/><path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828C5.343 2 7.229 2 11 2h4a3 3 0 0 1 3 3" opacity="0.5"/></g></svg>',
              })}
            </span>
          </div>

          <div class="grow"></div>

          <div class="text-bodyMedium text-outline opacity-85">کیر خوردی</div>
        </div>
      </div>
    `;
  }
  protected renderErrorCard() {
    if (!this.errored || this.disabled) return nothing;

    return html`
      <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
        <span class="absolute inset-0 bg-error z-[2]"></span>
        <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>
        <span
          class="absolute inset-0 opacity-40 bg-cover bg-gradient-to-bl from-onError from-0% to-transparent to-70% z-[4]"
        ></span>

        <div
          class="absolute inset-0 z-[5] flex flex-col pt-3 gap-6 pb-6 px-6 justify-center items-center [&>.gecut-icon]:text-[4rem] text-onError"
        >
          ${icon({
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M5.312 10.762C8.23 5.587 9.689 3 12 3c2.31 0 3.77 2.587 6.688 7.762l.364.644c2.425 4.3 3.638 6.45 2.542 8.022S17.786 21 12.364 21h-.728c-5.422 0-8.134 0-9.23-1.572s.117-3.722 2.542-8.022zM12 7.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>',
          })}

          <span>مشکلی در دریافت کارت به وجود آمده</span>
        </div>
      </div>
    `;
  }
  protected renderCard() {
    if (!this.data) return nothing;

    return html`
      <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
        <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
        ${when(
          this.data.primaryColor,
          () => html`
            <span
              class="absolute inset-0 opacity-25 bg-cover bg-gradient-to-bl from-primary from-0%
                 to-transparent to-100% z-[4]"
              style=${styleMap({
                '--tw-gradient-from': `rgba(${this.data?.primaryColor}, 1) var(--tw-gradient-from-position)`,
                '--tw-gradient-to': `rgba(${this.data?.primaryColor}, 0) var(--tw-gradient-to-position)`,
                '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
              })}
            ></span>
            <span
              class="absolute inset-0 opacity-30 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent
                 to-60% z-[4]"
              style=${styleMap({
                '--tw-gradient-from': `rgba(${this.data?.primaryColor}, 1) var(--tw-gradient-from-position)`,
                '--tw-gradient-to': `rgba(${this.data?.primaryColor}, 0) var(--tw-gradient-to-position)`,
                '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
              })}
            ></span>
          `,
          () => html`
            <span
              class="absolute inset-0 opacity-5 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-100% z-[4]"
            ></span>
            <span
              class="absolute inset-0 opacity-15 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-50% z-[4]"
            ></span>
          `,
        )}

        <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

        <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
          <div class="size-20 flex items-center justify-center">
            <img class="h-full w-full object-contain" src=${this.data.bankInfo?.bankLogo ?? '/icon.png'} />
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
