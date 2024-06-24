import {icon, gecutButton} from '@gecut/components';
import {html} from 'lit/html.js';

import {otpTimer} from './otp-timer.js';
import {client} from '../client/index.js';
import {signInStatesContext} from '../contexts/sign-in.states.js';
import {userExistsContext} from '../contexts/user.exists.js';
import {loadUser} from '../contexts/user.js';
import {userPartialContext} from '../contexts/user.partial.js';
import {router} from '../router/index.js';
import {envvm} from '../utilities/envvm.js';

import SolarNotificationUnreadLinesLineDuotone from '~icons/solar/notification-unread-lines-line-duotone';
import SolarSmartphone2LineDuotone from '~icons/solar/smartphone-2-line-duotone';

import type {StateManager} from '@gecut/utilities/state-manager.js';

export const signInFormStates: StateManager<'tel' | 'otp' | 'info'> = {
  tel: () => html`
    <label class="gecut-input">
      ${icon({svg: SolarSmartphone2LineDuotone})}
      <input
        type="tel"
        name="tel"
        placeholder="شمـاره همراه"
        pattern="^[09]{2}[0-9]{9}$"
        .value=${userPartialContext.value?.phoneNumber ?? ''}
        required
      />
    </label>
    ${gecutButton({
      type: 'filled',
      label: 'ورود / ثبت نام',
      events: {
        click: async (event) => {
          const target = event.target as HTMLElement;
          const userPartial = await userPartialContext.requireValue();
          const phoneNumber = userPartial.phoneNumber;

          if (phoneNumber) {
            target.setAttribute('loading', '');

            client.user.has
              .query({phoneNumber})
              .then(async (userId) => {
                const exists = userId != null;

                if (exists) {
                  await client.user.otp.send.mutate({userId});
                }

                userExistsContext.value = exists;
                userPartialContext.value = {
                  ...userPartial,

                  _id: userId,
                };
              })
              .finally(() => {
                target.removeAttribute('loading');
              });
          }
        },
      },
    })}
  `,
  otp: () => html`
    <span class="text-bodySmall text-outline mx-auto -mb-2">
      لطفا کد اعتبارسنجی ارسال شده به موبایل خود را وارد نمایید.
    </span>
    <label class="gecut-input">
      ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}
      <input type="tel" name="otp" placeholder="کـد اعتبارسنجـــی" pattern="^[0-9]{6}$" maxlength="6" required />
    </label>
    <div class="flex justify-between">
      <span
        class="text-bodySmall font-bold text-primary cursor-pointer"
        @click=${() => (signInStatesContext.value = 'tel')}
      >
        ویرایش شماره تلفن
      </span>
      <span class="text-bodySmall text-onSurfaceVariant"> ${otpTimer()} تا ارسال مجدد </span>
    </div>

    ${gecutButton({
      type: 'filled',
      label: 'ورود / ثبـت نـام',
      events: {
        click: async (event) => {
          const target = event.target as HTMLElement;
          const userPartial = await userPartialContext.requireValue();

          if (userPartial._id && userPartial.otp?.code) {
            target.setAttribute('loading', '');

            client.user.otp.verify
              .mutate({
                userId: userPartial._id,
                otpCode: userPartial.otp?.code,
              })
              .then((token) => {
                envvm.set('user-token', token);

                loadUser();

                router.navigate('/');
              })
              .finally(() => target.removeAttribute('loading'));
          }
        },
      },
    })}
  `,
  info: () => html`
    <span class="text-bodySmall text-outline mx-auto -mb-2"> اطلاعات خود را جهت تکمیل حساب وارد کنید. </span>
    <label class="gecut-input">
      ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}
      <input type="text" name="first-name" placeholder="نام" minlength="4" required />
    </label>
    <label class="gecut-input">
      ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}
      <input type="text" name="last-name" placeholder="نام خانوادگـی" minlength="4" required />
    </label>

    ${gecutButton({
      type: 'filled',
      label: 'ثـــبت اطــلاعات',
    })}
  `,
};
