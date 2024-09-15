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
          icon: {
            // eslint-disable-next-line max-len
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><g fill="none"><path fill="#72adf1" d="m9.234 14.25l6.75 15.914l7.532-15.914z"/><path fill="url(#f589id0)" d="m9.234 14.25l6.75 15.914l7.532-15.914z"/><path fill="url(#f589id1)" d="m9.234 14.25l6.75 15.914l7.532-15.914z"/><path fill="url(#f589id2)" d="m7.547 7.969l-5.5 7.406h9.031L16 7.969z"/><path fill="url(#f589id3)" d="m7.547 7.969l-5.5 7.406h9.031L16 7.969z"/><path fill="url(#f589id4)" d="m7.547 7.969l-5.5 7.406h9.031L16 7.969z"/><path fill="url(#f589idb)" d="m24.43 7.969l5.5 7.406h-9.032l-4.921-7.406z"/><path fill="url(#f589id5)" d="m24.43 7.969l5.5 7.406h-9.032l-4.921-7.406z"/><path fill="url(#f589id6)" d="M15.99 30.174L2.047 15.375h9.031z"/><path fill="url(#f589id7)" d="M15.99 30.174L2.047 15.375h9.031z"/><path fill="url(#f589idc)" d="m15.984 30.164l13.95-14.789h-9.032z"/><path fill="url(#f589id8)" d="m15.984 30.164l13.95-14.789h-9.032z"/><path fill="url(#f589id9)" d="m15.984 30.164l13.95-14.789h-9.032z"/><path fill="url(#f589ida)" d="M11.078 15.375h9.82l-4.91-7.389z"/><defs><linearGradient id="f589id0" x1="16.375" x2="16.375" y1="14.848" y2="16.848" gradientUnits="userSpaceOnUse"><stop stop-color="#72c8f9"/><stop offset="1" stop-color="#73aef2" stop-opacity="0"/></linearGradient><linearGradient id="f589id1" x1="19.191" x2="15.947" y1="25.113" y2="24.491" gradientUnits="userSpaceOnUse"><stop stop-color="#73d2ff"/><stop offset="1" stop-color="#73aef2" stop-opacity="0"/></linearGradient><linearGradient id="f589id2" x1="11.172" x2="7.234" y1="15" y2="9.875" gradientUnits="userSpaceOnUse"><stop offset=".33" stop-color="#2e97d8"/><stop offset="1" stop-color="#1c82ca"/></linearGradient><linearGradient id="f589id3" x1="2.484" x2="6.297" y1="16.063" y2="13.125" gradientUnits="userSpaceOnUse"><stop stop-color="#2e8bdb"/><stop offset="1" stop-color="#2e8bdb" stop-opacity="0"/></linearGradient><linearGradient id="f589id4" x1="13.57" x2="12.704" y1="12.471" y2="11.916" gradientUnits="userSpaceOnUse"><stop stop-color="#32b3ea"/><stop offset="1" stop-color="#32b3ea" stop-opacity="0"/></linearGradient><linearGradient id="f589id5" x1="19.578" x2="20.203" y1="13.594" y2="13.188" gradientUnits="userSpaceOnUse"><stop offset=".17" stop-color="#20d0f6"/><stop offset="1" stop-color="#20d0f6" stop-opacity="0"/></linearGradient><linearGradient id="f589id6" x1="9.019" x2="15.99" y1="15.375" y2="29.734" gradientUnits="userSpaceOnUse"><stop offset=".379" stop-color="#296bcc"/><stop offset="1" stop-color="#3e7de1"/></linearGradient><linearGradient id="f589id7" x1="9.019" x2="9.019" y1="15.375" y2="15.781" gradientUnits="userSpaceOnUse"><stop stop-color="#2d75d2"/><stop offset="1" stop-color="#2d75d2" stop-opacity="0"/></linearGradient><linearGradient id="f589id8" x1="17.563" x2="18.063" y1="24.898" y2="25.094" gradientUnits="userSpaceOnUse"><stop stop-color="#368fe1"/><stop offset="1" stop-color="#368fe1" stop-opacity="0"/></linearGradient><linearGradient id="f589id9" x1="22.959" x2="22.959" y1="15.063" y2="16.094" gradientUnits="userSpaceOnUse"><stop stop-color="#309ee9"/><stop offset="1" stop-color="#309ee9" stop-opacity="0"/></linearGradient><linearGradient id="f589ida" x1="19.672" x2="11.078" y1="11.312" y2="17.312" gradientUnits="userSpaceOnUse"><stop stop-color="#6ce8fe"/><stop offset=".642" stop-color="#68caea"/></linearGradient><radialGradient id="f589idb" cx="0" cy="0" r="1" gradientTransform="matrix(8.25 -.82813 1.11925 11.15027 17.984 12.5)" gradientUnits="userSpaceOnUse"><stop stop-color="#20d5fc"/><stop offset="1" stop-color="#20bff7"/></radialGradient><radialGradient id="f589idc" cx="0" cy="0" r="1" gradientTransform="matrix(5.72464 -10.31253 5.40695 3.00148 17.234 29.563)" gradientUnits="userSpaceOnUse"><stop stop-color="#42a2ec"/><stop offset="1" stop-color="#3294e4"/></radialGradient></defs></g></svg>',
          },
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
  }, 2048);
}
