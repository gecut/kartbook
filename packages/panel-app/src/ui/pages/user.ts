import {gecutButton, icon} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {html} from 'lit/html.js';

import {userContext} from '../contexts/user.js';

import SolarUserCircleLineDuotone from '~icons/solar/user-circle-line-duotone';

export function $UserPage() {
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
        `,
      )}
      ${gecutButton({
        type: 'filled',
        label: 'ویرایش اطلاعات',
      })}
    </div>
  `;
}
