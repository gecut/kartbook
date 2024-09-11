import {gecutList, type ItemContent} from '@gecut/components';
import {gecutContext, GecutState} from '@gecut/lit-helper';
import clipboard from '@gecut/utilities/clipboard.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {sbm} from '../../utilities/sbm.js';

import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone';
import SolarHandMoneyLineDuotone from '~icons/solar/hand-money-line-duotone';
import SolarStarLineDuotone from '~icons/solar/star-line-duotone';
import SolarStarShineLineDuotone from '~icons/solar/star-shine-line-duotone';
import SolarTicketSaleLineDuotone from '~icons/solar/ticket-sale-line-duotone';

import type {OrderData} from '@gecut/kartbook-types';

export function $SellerPanelPage() {
  const invitesState = new GecutState<OrderData[]>('invites');

  client.seller.invites.query().then((invites) => (invitesState.value = invites));

  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <div class="w-full h-full flex flex-col justify-center py-4 gap-4 *:animate-fadeInSlide">
        ${gecutContext(
          userContext,
          (user) => html`
            ${gecutList<ItemContent>(
              {
                box: 'elevated',
              },
              [
                {
                  headline: html`
                    <span>کد دعوت شما:</span>
                    <span class="text-primary">${user.seller.sellerCode}</span>
                  `,
                  leading: {
                    element: 'icon',
                    svg: SolarTicketSaleLineDuotone,
                  },
                  trailing: {
                    element: 'icon-button',
                    svg: SolarCopyLineDuotone,
                    events: {
                      click: () => {
                        clipboard
                          .write(user.seller.sellerCode ?? '')
                          .then(() =>
                            sbm.notify({
                              message: 'لینک کارت با موفقیت کپی شد.',
                              close: true,
                            }),
                          )
                          .catch(() =>
                            sbm.notify({
                              message: 'متأسفانه در کپی کردن لینک کارت با مشکل مواجه شدیم. لطفاً مجدد تلاش کنید.',
                              close: true,
                            }),
                          );
                      },
                    },
                  },
                },
                {
                  headline: html`
                    <span>پاداش فروش:</span>
                    <span class="text-primary">${i18n.n(user.seller.salesBonus || 0)}</span>
                    <span>ریال</span>
                  `,
                  supportingTextTwoLine: true,
                  supportingText: 'پاداش شما به ازای هر فروش٬ که به کیف پول کارت بوک شما واریز می شود',
                  leading: {
                    element: 'icon',
                    svg: SolarStarShineLineDuotone,
                  },
                },
                {
                  headline: html`
                    <span>تخفیف مشتری شما:</span>
                    <span class="text-primary">${i18n.n(user.seller.salesDiscount || 0)}</span>
                    <span>ریال</span>
                  `,
                  supportingTextTwoLine: true,
                  supportingText: 'تخفیفی که برای مشتری شما در نظر گرفتیم',
                  leading: {
                    element: 'icon',
                    svg: SolarHandMoneyLineDuotone,
                  },
                },
              ],
              (item) => item,
            )}
            ${invitesState.hydrate((invites) =>
              when(invites.length > 0, () =>
                gecutList(
                  {
                    box: 'elevated',
                    scrollable: true,
                  },
                  invites,
                  (invite) => ({
                    divider: true,
                    headline: html`
                      <span class="text-onSurfaceVariant">دعوت</span>
                      <span>${invite.customer.firstName} ${invite.customer.lastName}</span>
                    `,
                    supportingText: html`
                      <span>${i18n.n(invite.caller?.seller.salesBonus || 0)}</span>
                      <span class="text-onSurfaceVariant">﷼ پاداش دعوت</span>
                    `,
                    leading: {
                      element: 'icon',
                      svg: SolarStarLineDuotone,
                    },
                  }),
                ),
              ),
            )}
          `,
        )}
      </div>
    </main>
  `;
}
