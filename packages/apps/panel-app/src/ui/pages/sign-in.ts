import {gecutButton, gecutIconButton, icon} from '@gecut/components';
import {GecutState} from '@gecut/lit-helper';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {loadUser} from '../../contexts/user.js';
import {envvm} from '../../utilities/envvm.js';
import {otpTimer} from '../components/otp-timer.js';
import {router} from '../router/index.js';

import SolarHelpLineDuotone from '~icons/solar/help-line-duotone';
import SolarNotificationUnreadLinesLineDuotone from '~icons/solar/notification-unread-lines-line-duotone';
import SolarSmartphone2LineDuotone from '~icons/solar/smartphone-2-line-duotone';

const signInSlides = new GecutState<'tel' | 'otp' | 'info'>('sign-in.slides', 'tel');
const signInLoading = new GecutState<boolean>('sign-in.loading', false);

let userId: string | undefined = undefined;
let phoneNumber: string | undefined = undefined;

export const $OnFormSubmit = async (event: SubmitEvent) => {
  event.preventDefault();

  const state = (signInSlides.value ??= 'tel');
  const form = (event.currentTarget || event.target) as HTMLFormElement;
  const data = new FormData(form);

  switch (state) {
    case 'otp':
      const otp = data.get('otp')!.toString();

      if (userId) {
        signInLoading.value = true;

        client.user.otp.verify
          .mutate({
            userId,
            otpCode: otp,
          })
          .then((token) => {
            envvm.set('user-token', token);

            loadUser();

            router.navigate('/');
          })
          .finally(() => (signInLoading.value = false));
      }

      break;
    case 'tel':
      const _phoneNumber = data.get('tel')!.toString();

      phoneNumber = _phoneNumber;

      signInLoading.value = true;

      client.user.has
        .query({phoneNumber})
        .then(async (__userId) => {
          userId = __userId;

          const exist = __userId != null;

          if (exist) {
            await client.user.otp.send.mutate({userId: __userId});

            return true;
          }

          return false;
        })
        .then((exist) => {
          if (exist) {
            return (signInSlides.value = 'otp');
          }

          return (signInSlides.value = 'info');
        })
        .finally(() => (signInLoading.value = false));

      break;
    case 'info':
      const firstName = data.get('first-name')!.toString();
      const lastName = data.get('last-name')!.toString();

      if (phoneNumber) {
        signInLoading.value = true;

        client.user.create
          .mutate({
            firstName: firstName,
            lastName: lastName,
            phoneNumber,
          })
          .then((user) => (userId = user._id))
          .then(() => client.user.otp.send.mutate({userId: userId!}))
          .then(() => (signInSlides.value = 'otp'))
          .finally(() => (signInLoading.value = false));
      }

      break;
  }

  return false;
};

export function $SignPage() {
  return html`
    <div class="px-4 w-full h-full flex flex-1 flex-col max-w-md mx-auto page-modal">
      <form class="flex-1 flex flex-col justify-center gap-4 min-h-52 *:animate-fadeInSlide" @submit=${$OnFormSubmit}>
        <div class="absolute top-4 left-0 [&>*]:m-0 px-4">
          ${gecutIconButton({
            svg: SolarHelpLineDuotone,
            type: 'normal',
          })}
        </div>

        <div class="flex w-full items-center justify-center pb-4">
          <img src="/logo.png" class="h-32" />
        </div>

        ${signInSlides.hydrate((state) =>
          stateManager(
            {
              tel: () => html`
                <label class="gecut-input">
                  ${icon({svg: SolarSmartphone2LineDuotone})}

                  <input
                    type="tel"
                    name="tel"
                    inputmode="tel"
                    placeholder="شمـاره همراه"
                    pattern="^[09]{2}[0-9]{9}$"
                    .value=${phoneNumber ?? ''}
                    required
                  />
                </label>
              `,
              otp: () => html`
                <span class="text-bodySmall text-outline mx-auto -mb-2">
                  لطفا کد اعتبارسنجی ارسال شده به موبایل خود را وارد نمایید.
                </span>
                <label class="gecut-input">
                  ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}

                  <input
                    type="text"
                    name="otp"
                    inputmode="numeric"
                    placeholder="کـد اعتبارسنجـــی"
                    pattern="^[0-9]{6}$"
                    maxlength="6"
                    required
                  />
                </label>
                <div class="flex justify-between">
                  <span class="text-bodySmall font-bold text-primary cursor-pointer"> ویرایش شماره تلفن </span>
                  <span class="text-bodySmall text-onSurfaceVariant"> ${otpTimer()} تا ارسال مجدد </span>
                </div>
              `,
              info: () => html`
                <span class="text-bodySmall text-outline mx-auto -mb-2">
                  اطلاعات خود را جهت تکمیل حساب وارد کنید.
                </span>
                <label class="gecut-input">
                  ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}

                  <input
                    type="text"
                    name="first-name"
                    placeholder="نام"
                    pattern="^[U+0020 U+2002ء-بت-غف-قل-وَ-ّٕپچژکگھی]{3,19}$"
                    minlength="4"
                    required
                  />
                </label>
                <label class="gecut-input">
                  ${icon({svg: SolarNotificationUnreadLinesLineDuotone})}

                  <input
                    type="text"
                    name="last-name"
                    placeholder="نام خانوادگـی"
                    pattern="^[U+0020 U+2002ء-بت-غف-قل-وَ-ّٕپچژکگھی]{3,19}$"
                    minlength="4"
                    required
                  />
                </label>
              `,
            },
            state,
          ),
        )}
        ${signInLoading.hydrate((loading) =>
          gecutButton({
            type: 'filled',
            label: 'ورود / ثبت نام',
            loading,
          }),
        )}
      </form>

      <div class="flex flex-col items-center justify-end pb-8">
        <p class="text-outline text-bodySmall">پلتفرم شمــاره کــارت آنــلایــن، کارت بــوک</p>
      </div>
    </div>
  `;
}
