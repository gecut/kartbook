import {gecutButton, icon} from '@gecut/components';
import {html} from 'lit/html.js';

import LineMdInstagram from '~icons/line-md/instagram';
import LineMdLinkedin from '~icons/line-md/linkedin';
import LineMdPhoneCallLoop from '~icons/line-md/phone-call-loop';
import LineMdTelegram from '~icons/line-md/telegram';
import LineMdTwitterX from '~icons/line-md/twitter-x';
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
          icon: {svg: LineMdTwitterX},
          href: 'https://x.com/kartbook_ir',
          target: '_blank',
        })}
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LineMdTelegram},
          href: 'https://t.me/kartbook_ir',
          target: '_blank',
        })}
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LineMdInstagram},
          href: 'https://instagram.com/kartbook.ir',
          target: '_blank',
        })}
        ${gecutButton({
          type: 'filledTonal',
          icon: {svg: LineMdLinkedin},
          // eslint-disable-next-line max-len
          href: 'https://www.linkedin.com/company/kartbook-%DA%A9%D8%A7%D8%B1%D8%AA%D8%A8%D9%88%DA%A9?trk=similar-pages',
          target: '_blank',
        })}
      </div>
    </div>
  `;
}
