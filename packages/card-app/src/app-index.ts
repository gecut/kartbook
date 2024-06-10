import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {html, render} from 'lit/html.js';
import 'unfonts.css';

import {card} from './components/card.js';
import './styles/global.css';
import {dataContext, load as loadCardData} from './utilities/data.context.js';
import {notificationContext, notificationRenderer} from './utilities/notification.context.js';

import type {Notification} from './utilities/notification.context.js';

document.body.innerHTML = '';

render(
  html`
    <div class="grow relative">
      <div class="absolute inset-0 flex flex-col gap-3 justify-start items-start pt-6">
        ${gecutContext<Notification | null>(notificationContext, notificationRenderer)}
      </div>
    </div>

    ${gecutContext(dataContext, card)}

    <div class="grow relative">
      <div
        class="absolute inset-0 flex flex-col gap-3 justify-center items-center text-bodySmall
               lg:text-bodyMedium text-onSurfaceVariant"
      >
        <img class="h-6 md:h-8 lg:h-10" src="/icon.png" />

        <span>پلتفرم شمـاره کـارت آنـلایـــن, کـــارت بـوک</span>

        <a class="flex" href="//k32.ir" target="_blank" dir="ltr">
          <span class="text-primary">K32</span>
          <span>.ir</span>
        </a>
      </div>
    </div>
  `,
  document.body,
);

loadCardData();
