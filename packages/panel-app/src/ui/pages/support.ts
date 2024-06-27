import {gecutButton, icon} from '@gecut/components';
import {html} from 'lit/html.js';

import LineMdPhoneCallLoop from '~icons/line-md/phone-call-loop';
import SolarCallChatRoundedLineDuotone from '~icons/solar/call-chat-rounded-line-duotone';

export function $SupportPage() {
  return html`
    <div
      class="h-full w-full flex flex-col items-center justify-center gap-4 text-onSurfaceVariant
             [&>.gecut-button]:w-full"
    >
      <div class="[&>.gecut-icon]:text-[6rem]">
        ${icon({
          svg: SolarCallChatRoundedLineDuotone,
        })}
      </div>
      <h1 class="text-titleMedium">گفتگوی مستقیم با کارشناس پشتیبانی</h1>
      ${gecutButton({
        type: 'filled',
        label: 'تماس با پشتیبانی',
        trailingIcon: {
          svg: LineMdPhoneCallLoop,
        },
      })}
    </div>
  `;
}
