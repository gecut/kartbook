import {gecutList, icon, type ItemContent} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper';
import clipboard from '@gecut/utilities/clipboard.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {invitesState} from '../../contexts/seller-invites.state.js';
import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {sbm} from '../../utilities/sbm.js';

import SolarCopyLineDuotone from '~icons/solar/copy-line-duotone';
import SolarHandMoneyLineDuotone from '~icons/solar/hand-money-line-duotone';
import SolarNotificationLinesRemoveLineDuotone from '~icons/solar/notification-lines-remove-line-duotone';
import SolarStarShineLineDuotone from '~icons/solar/star-shine-line-duotone';
import SolarTicketSaleLineDuotone from '~icons/solar/ticket-sale-line-duotone';

export function $SellerPanelPage() {
  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <div class="w-full h-full flex flex-col justify-center py-4 gap-4 *:animate-fadeInSlide">
        ${gecutContext(
          userContext,
          (user) => html`
            <div class="gecut-card-elevated flex flex-col p-0 gap-0 m-0">
              <h2 class="text-titleMedium text-onSurfaceVariant w-full p-4 pb-0">اطلاعات فروشنده</h2>

              ${gecutList<ItemContent>(
                {},
                [
                  {
                    headline: html`
                      <span>کد دعوت شما:</span>
                      <span class="text-primary">${user?.seller.sellerCode}</span>
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
                            .write(user?.seller.sellerCode ?? '')
                            .then(() =>
                              sbm.notify({
                                message: 'کد دعوت با موفقیت کپی شد.',
                                close: true,
                              }),
                            )
                            .catch(() =>
                              sbm.notify({
                                message: 'متأسفانه در کپی کردن کد دعوت با مشکل مواجه شدیم. لطفاً مجدد تلاش کنید.',
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
                      <span class="text-primary">${i18n.n(user?.seller.salesBonus || 0)}</span>
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
                      <span class="text-primary">${i18n.n(user?.seller.salesDiscount || 0)}</span>
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
            </div>
            <div class="gecut-card-elevated p-0 flex flex-col items-center justify-content overflow-auto relative m-0">
              <h2 class="sticky inset-x-0 top-0 text-titleMedium text-onSurfaceVariant p-4 w-full">اطلاعات فروشنده</h2>

              ${invitesState.hydrate((invites) =>
                when(
                  invites.length > 0,
                  () =>
                    gecutList(
                      {
                        scrollable: true,
                      },
                      invites,
                      (order, index) => ({
                        divider: invites.length - 1 <= index ? false : true,
                        headline: `${order.customer.firstName} ${order.customer.lastName}`,
                        supportingTextTwoLine: true,
                        supportingText: i18n.dt(order.createdAt, {timeStyle: 'short', dateStyle: 'long'}),
                        trailingSupportingText: {
                          type: 'string',
                          value: 'پاداش ' + i18n.n(order.caller?.seller.salesBonus || 0) + ' ﷼',
                        },
                        leading: {
                          element: 'avatar:character',
                          character: i18n.n(invites.length - index),
                        },
                      }),
                    ),
                  () => html`
                    <div class="flex w-full gap-4 p-4 pt-0 items-center justify-center">
                      <i class="[&>.gecut-icon]:text-xl">${icon({svg: SolarNotificationLinesRemoveLineDuotone})}</i>
                      <span>هیچ دعوتی انجام ندادید</span>
                    </div>
                  `,
                ),
              )}
            </div>
          `,
        )}
      </div>
    </main>
  `;
}
