import {gecutButton, icon} from '@gecut/components';
import {html} from 'lit/html.js';

import LineMdPhoneCallLoop from '~icons/line-md/phone-call-loop';
import LogosInstagramIcon from '~icons/logos/instagram-icon';
import LogosLitIcon from '~icons/logos/lit-icon';
import LogosTelegram from '~icons/logos/telegram';
import SolarCallChatRoundedLineDuotone from '~icons/solar/call-chat-rounded-line-duotone';

export function $SupportPage() {
  return html`
    <div
      class="h-full w-full flex flex-col items-center justify-center gap-4 text-onSurfaceVariant
             [&>.gecut-button]:w-full *:animate-fadeInSlide"
    >
      <i class="[&>.gecut-icon]:text-[6rem]">
        ${icon({
          svg: SolarCallChatRoundedLineDuotone,
        })}
      </i>
      <h1 class="text-titleMedium">گفتگوی مستقیم با کارشناس پشتیبانی</h1>
      ${gecutButton({
        type: 'filled',
        label: 'تماس با پشتیبانی',
        href: 'tel:+989999969776',
        trailingIcon: {
          svg: LineMdPhoneCallLoop,
        },
      })}
      <div class="flex gap-4 w-full *:flex-1">
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LogosInstagramIcon},
        })}
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LogosTelegram},
        })}
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LogosLitIcon},
        })}
      </div>
    </div>
  `;
}
