import {gecutButton, icon} from '@gecut/components';
import {GecutState} from '@gecut/lit-helper';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {untilIdle} from '@gecut/utilities/wait/wait.js';
import {html} from 'lit/html.js';

import {userContext} from '../../contexts/user.js';
import {i18n} from '../../utilities/i18n.js';
import {router} from '../router/index.js';

import SolarUserCircleLineDuotone from '~icons/solar/user-circle-line-duotone';

export function $UserPage() {
  const dateState = new GecutState('date', 0);
  const currentPath = router.route.path;

  const timer = setInterval(async () => {
    await untilIdle();

    console.log('fuck');

    if (currentPath != router.route.path) {
      clearInterval(timer);
    }
    else {
      dateState.value = dateState.value || 0;
    }
  }, 1000);

  return html`
    <div
      class="h-full w-full flex flex-col items-center justify-center gap-4 text-onSurfaceVariant
             [&>.gecut-button]:w-full"
    >
      <div class="[&>.gecut-icon]:text-[6rem]">
        ${icon({
          svg: SolarUserCircleLineDuotone,
        })}
      </div>
      ${gecutContext(
        userContext,
        (user) => html`
          <div
            class="bg-surfaceContainer text-onSurface flex rounded-xl items-center justify-between
                   overflow-hidden w-full p-4"
          >
            <span>${user.firstName} ${user.lastName}</span>
            <span>${user.phoneNumber}</span>
          </div>
          <div
            class="bg-surfaceContainer text-onSurface flex rounded-xl items-center justify-between
                   overflow-hidden w-full p-4"
          >
            <span>${dateState.hydrate(() => i18n.rtf(user.createdAt))}</span>
          </div>
        `,
      )}
      ${gecutButton({
        type: 'filled',
        label: 'ویرایش اطلاعات',
      })}
    </div>
  `;
}
