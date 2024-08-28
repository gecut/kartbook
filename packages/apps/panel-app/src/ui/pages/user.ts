import {divider, gecutButton, icon} from '@gecut/components';
import {GecutState} from '@gecut/lit-helper';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {untilIdle} from '@gecut/utilities/wait/wait.js';
import {when} from 'lit/directives/when.js';
import {html} from 'lit/html.js';

import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {router} from '../router/index.js';

import FluentEmojiRevolvingHearts from '~icons/fluent-emoji/revolving-hearts';
import LineMdAccount from '~icons/line-md/account';
import LineMdEmail from '~icons/line-md/email';
import LineMdEmojiSmileWink from '~icons/line-md/emoji-smile-wink';
import LineMdLogOut from '~icons/line-md/log-out';
import LineMdPencil from '~icons/line-md/pencil';
import LineMdPhone from '~icons/line-md/phone';

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
      <div class="w-full h-full flex flex-col items-center justify-center py-4">
        ${gecutContext(
          userContext,
          (user) => html`
            <div class="gecut-card-filled w-full flex flex-col gap-4 py-4">
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
                  user.caller,
                  () => html`
                    <div class="flex items-center justify-start gap-4 w-full">
                      <i class="text-primary">
                        ${icon({
                          svg: LineMdEmojiSmileWink,
                        })}
                      </i>
                      <span class="text-onSurfaceVariant">${user.caller?.firstName} ${user.caller?.lastName}</span>
                    </div>
                  `,
                )}
                ${when(
                  user.wallet.balance > 0,
                  () => html`
                    <div class="flex items-center justify-start gap-4 w-full">
                      <i class="text-primary">
                        ${icon({
                          svg: LineMdEmojiSmileWink,
                        })}
                      </i>
                      <span class="text-onSurfaceVariant">${i18n.n(user.wallet.balance)}</span>
                    </div>
                  `,
                )}
              </div>
              ${divider({})}
              <div class="flex gap-4 *:grow *:flex-1">
                ${gecutButton({
                  type: 'filled',
                  icon: {svg: LineMdPencil},
                  label: 'ویرایش اطلاعات',
                })}
                ${gecutButton({
                  type: 'elevated',
                  icon: {svg: LineMdLogOut},
                  label: 'خروج',
                })}
              </div>
            </div>
            <div class="gecut-card-filled w-full flex flex-col gap-4 py-4">
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
