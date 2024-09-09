import {divider, gecutButton, icon} from '@gecut/components';
import {GecutState} from '@gecut/lit-helper';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {untilIdle} from '@gecut/utilities/wait/wait.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {userContext} from '../../contexts/user.js';
import {envvm} from '../../utilities/envvm.js';
import {i18n} from '../../utilities/i18n.js';
import {router} from '../router/index.js';

import FluentEmojiRevolvingHearts from '~icons/fluent-emoji/revolving-hearts';
import LineMdAccount from '~icons/line-md/account';
import LineMdEmail from '~icons/line-md/email';
import LineMdLightbulbTwotone from '~icons/line-md/lightbulb-twotone';
import LineMdLogOut from '~icons/line-md/log-out';
import LineMdPencil from '~icons/line-md/pencil';
import LineMdPhone from '~icons/line-md/phone';
import LineMdTextBoxMultiple from '~icons/line-md/text-box-multiple';

export function $UserPage() {
  const timerState = new GecutState('date', 0);
  const currentPath = router.route.path;

  const timer = setInterval(async () => {
    await untilIdle();

    if (currentPath != router.route.path) {
      clearInterval(timer);
    }
    else {
      timerState.value = timerState.value || 0;
    }
  }, 1000);

  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <div class="w-full h-full flex flex-col items-center justify-center py-4 *:animate-fadeInSlide">
        ${gecutContext(
          userContext,
          (user) => html`
            ${when(
              user.email == null,
              () => html`
                <button
                  class="gecut-card-filled w-full flex gap-2 p-4 bg-secondaryContainer text-onSecondaryContainer
                     text-bodyMedium focus-ring"
                >
                  <i>${icon({svg: LineMdLightbulbTwotone})}</i>
                  <p class="text-start text-pretty">
                    <span class="text-primary text-labelLarge !font-black">${user.firstName}</span>
                    عزیز، با تکمیل پروفایل،
                    <span class="text-primary text-labelLarge !font-bold">کـــارت بـوک</span>
                    را به بهترین شکل شخصی‌سازی کنید و از پیشنهادهای ویژه ما لذت ببرید. برای تکمیل،
                    <span class="text-error text-labelLarge !font-black">کلـــــیـک</span>
                    کنید.
                  </p>
                </button>
              `,
            )}

            <div class="gecut-card-elevated w-full flex flex-col gap-4 py-4">
              <div class="flex flex-col gap-6 w-full">
                <div class="flex items-center justify-start gap-4 w-full">
                  <i class="text-primary">
                    ${icon({
                      svg: LineMdAccount,
                    })}
                  </i>
                  <span class="text-onSurfaceVariant">${user.firstName} ${user.lastName}</span>
                </div>
                <div class="flex items-center justify-start gap-4 w-full">
                  <i class="text-primary">
                    ${icon({
                      svg: LineMdPhone,
                    })}
                  </i>
                  <span class="text-onSurfaceVariant">${user.phoneNumber}</span>
                </div>
                ${when(
                  user.email,
                  () => html`
                    <div class="flex items-center justify-start gap-4 w-full">
                      <i class="text-primary">
                        ${icon({
                          svg: LineMdEmail,
                        })}
                      </i>
                      <span class="text-onSurfaceVariant">${user.email}</span>
                    </div>
                  `,
                )}
                ${when(
                  user.wallet.balance > 0,
                  () => html`
                    <div class="flex items-center justify-start gap-4 w-full">
                      <i class="text-primary">
                        ${icon({
                          svg: LineMdTextBoxMultiple,
                        })}
                      </i>
                      <span class="text-onSurfaceVariant">${i18n.n(user.wallet.balance)} ﷼</span>
                    </div>
                  `,
                )}
              </div>
              ${divider({})}
              <div class="flex gap-4 *:grow flex-col sm:*:flex-1 sm:flex-row">
                ${gecutButton({
                  type: 'filled',
                  icon: {svg: LineMdPencil},
                  label: 'ویرایش اطلاعات',
                })}
                ${gecutButton({
                  type: 'outlined',
                  icon: {svg: LineMdLogOut},
                  events: {
                    click: async () => {
                      envvm.remove('user-token');
                      await untilIdle();
                      return window.location.reload();
                    },
                  },
                  label: 'خروج',
                })}
              </div>
            </div>
            <div class="gecut-card-elevated w-full flex flex-col gap-4 py-4">
              <div class="flex flex-col justify-center gap-4 w-full">
                <p
                  class="text-onSurfaceVariant text-bodySmall [&>.gecut-icon]:inline-block
                          max-w-[15.7rem] mx-auto text-center"
                >
                  <span>${timerState.hydrate(() => i18n.rtf(user.createdAt))}</span>
                  <span>به</span>
                  <span class="text-primary text-labelLarge !font-bold">کـــارت بـوک</span>
                  <span>پیوستید</span>
                  ${icon({
                    svg: FluentEmojiRevolvingHearts,
                  })}
                </p>
              </div>
            </div>
          `,
        )}
      </div>
    </main>
  `;
}

/*
            <div
              class="bg-surfaceContainer text-onSurface flex rounded-xl items-center justify-between
                   overflow-hidden w-full p-4"
            >
              <span>${dateState.hydrate(() => i18n.rtf(user.createdAt))}</span>
            </div>
             */
