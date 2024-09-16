import {gecutButton, icon} from '@gecut/components';
import {gecutContext, GecutState} from '@gecut/lit-helper';
import {html} from 'lit/html.js';

import {client} from '../../client/index.js';
import {loadUser, userContext} from '../../contexts/user.js';
import {router} from '../router/index.js';
import {resolvePath} from '../router/resolver.js';

import SolarLetterLineDuotone from '~icons/solar/letter-line-duotone';
import SolarPhoneCallingLineDuotone from '~icons/solar/phone-calling-line-duotone';
import SolarUserIdLineDuotone from '~icons/solar/user-id-line-duotone';

export function $UserEditPage() {
  const loadingState = new GecutState('loading', false);

  return html`
    <main class="flex flex-1 flex-col max-w-md mx-auto page-modal has-top-bar pb-20 px-4 !z-sticky">
      <form
        class="w-full h-full flex flex-col items-center justify-center py-4 *:animate-fadeInSlide"
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();

          const form = (event.currentTarget || event.target) as HTMLFormElement;
          const data = new FormData(form);

          loadingState.value = true;

          client.user.edit
            .mutate({
              firstName: data.get('firstName')?.toString() || undefined,
              lastName: data.get('lastName')?.toString() || undefined,
              email: data.get('email')?.toString() || undefined,
              nationalCode: data.get('nationalCode')?.toString() || undefined,
            })
            .then(loadUser)
            .then(() => router.navigate(resolvePath('user')))
            .finally(() => (loadingState.value = false));
        }}
      >
        <div class="flex flex-col gecut-card-elevated p-4 w-full gap-4">
          <h1 class="text-onSurfaceVariant text-titleLarge text-center mb-4">ویرایش اطلاعات حساب</h1>
          ${gecutContext(
            userContext,
            (user) => html`
              <label class="gecut-input">
                ${icon({svg: SolarPhoneCallingLineDuotone})}

                <input
                  type="tel"
                  name="tel"
                  inputmode="tel"
                  dir="ltr"
                  placeholder="شمـاره همراه"
                  pattern="^[09]{2}[0-9]{9}$"
                  .value=${user.phoneNumber ?? ''}
                  readonly
                />
              </label>
              <div class="flex gap-4 *:!shrink">
                <label class="gecut-input">
                  <input type="text" name="firstName" placeholder="نام" .value=${user.firstName ?? ''} required />
                </label>
                <label class="gecut-input">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="نام خانوادگی"
                    .value=${user.lastName ?? ''}
                    required
                  />
                </label>
              </div>
              <label class="gecut-input">
                ${icon({svg: SolarLetterLineDuotone})}

                <input
                  type="email"
                  name="email"
                  inputmode="email"
                  placeholder="ایمیل"
                  dir="ltr"
                  .value=${user.email ?? ''}
                />
              </label>
              <label class="gecut-input">
                ${icon({svg: SolarUserIdLineDuotone})}

                <input
                  type="tel"
                  name="nationalCode"
                  inputmode="numeric"
                  dir="ltr"
                  placeholder="کد ملی"
                  pattern="^[09]{2}[0-9]{8}$"
                  .value=${user?.seller?.nationalCode ?? ''}
                />
              </label>
              ${loadingState.hydrate((loading) =>
                gecutButton({
                  type: 'filled',
                  label: 'ویرایش',
                  htmlType: 'submit',
                  loading,
                }),
              )}
            `,
          )}
        </div>
      </form>
    </main>
  `;
}
