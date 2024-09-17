import {gecutButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {untilIdle, untilMS, untilNextFrame} from '@gecut/utilities/wait/wait.js';
import {html, render} from 'lit/html.js';

import {card} from './components/card.js';
import {dataState, load as loadCardData} from './utilities/data.state.js';
import {notificationContext, notificationRenderer} from './utilities/notification.context.js';

import type {Notification} from './utilities/notification.context.js';

export async function startApp() {
  document.body.innerHTML = '';

  await untilNextFrame();

  render(
    html`
      <div class="grow relative">
        <div class="absolute inset-0 flex flex-col gap-3 justify-start items-start pt-6">
          ${gecutContext<Notification | null>(notificationContext, notificationRenderer)}
        </div>
      </div>

      <div class="*:animate-fadeInSlide *:[animation-duration:1024ms] *:[animation-delay:256ms]">
        ${dataState.hydrate(card)}
      </div>

      <div class="grow relative">
        <div
          class="absolute inset-0 flex flex-col gap-3 justify-center items-center text-bodySmall
                 lg:text-bodyMedium text-onSurfaceVariant"
        >
          <img class="h-6 md:h-8 lg:h-10" alt="KartBook LOGO" src="/icon.png" />

          <span>پلتفرم شمـاره کـارت آنـلایـــن, کـــارت بـوک</span>

          <a class="flex" href="//k32.ir" target="_blank" dir="ltr">
            <span class="text-primary">K32</span>
            <span>.ir</span>
          </a>
        </div>
      </div>

      <div
        id="invite-button"
        class="absolute -bottom-16 inset-x-0 *:w-full *:h-14 duration-1000
               *:rounded-b-none [&.show]:bottom-0 transition-all"
      >
        ${gecutButton({
          type: 'filledTonal',
          label: 'همین الان کارت خودت رو بساز',
          href: 'https://kartbook.ir/',
          target: '_blank',
        })}
      </div>
    `,
    document.body,
  );

  await untilIdle();
  const data = await loadCardData();
  await untilMS(1024);

  dataState.value = data;

  setTimeout(() => {
    document.querySelector('#invite-button')?.classList.add('show');
  }, 1024);
}
