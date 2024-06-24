import {gecutIconButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {html} from 'lit/html.js';

import logo from '../../../public/logo.svg?raw';
import {titleContext} from '../contexts/title.js';

import SolarBellBingBoldDuotone from '~icons/solar/bell-bing-bold-duotone';

export function topBar() {
  return html`
    <header class="fixed top-0 inset-x-0 bg-surfaceContainer translucent flex flex-col h-16">
      <div class="max-w-screen-md mx-auto flex items-center justify-between gap-4 w-full h-full relative">
        ${gecutIconButton({
          type: 'normal',
          svg: SolarBellBingBoldDuotone,
        })}

        <div class="flex items-center justify-center text-titleLarge text-primary my-auto">
          ${gecutContext(titleContext, (title) => title)}
        </div>

        ${gecutIconButton({
          type: 'normal',
          svg: logo,
        })}
      </div>
    </header>
  `;
}
