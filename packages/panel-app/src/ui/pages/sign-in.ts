import {gecutIconButton} from '@gecut/components';
import {gecutContext} from '@gecut/lit-helper/directives/context.js';
import {stateManager} from '@gecut/utilities/state-manager.js';
import {html} from 'lit/html.js';

import {signInFormStates} from '../components/sign-in.states.js';
import {signInStatesContext} from '../contexts/sign-in.states.js';
import {userExistsContext} from '../contexts/user.exists.js';
import {userPartialContext} from '../contexts/user.partial.js';

import SolarHelpLineDuotone from '~icons/solar/help-line-duotone';

const formSubmitter = async (event: SubmitEvent) => {
  event.preventDefault();

  const userPartial = await userPartialContext.requireValue();
  const state = await signInStatesContext.requireValue();
  const form = (event.currentTarget || event.target) as HTMLFormElement;
  const data = new FormData(form);

  switch (state) {
    case 'otp':
      const otp = data.get('otp')?.toString();

      if (otp) {
        userPartialContext.value = {
          ...userPartial,

          otp: {code: otp},
        };
      }

      break;
    case 'tel':
      const phoneNumber = data.get('tel')?.toString();

      if (phoneNumber) {
        userPartialContext.value = {
          ...userPartial,

          phoneNumber,
        };
      }

      if (await userExistsContext.requireValue()) {
        signInStatesContext.value = 'otp';
      }
      else {
        signInStatesContext.value = 'info';
      }
      break;
    case 'info':
      const firstName = data.get('first-name')?.toString();
      const lastName = data.get('last-name')?.toString();

      if (firstName && lastName) {
        userPartialContext.value = {
          ...userPartial,

          firstName,
          lastName,
        };
      }

      signInStatesContext.value = 'otp';

      break;
  }

  return false;
};

export function $SignPage() {
  return html`
    <div class="px-4 w-full h-full flex flex-1 flex-col max-w-md mx-auto">
      <form class="flex-1 flex flex-col justify-center gap-4 min-h-52 *:animate-fadeInSlide" @submit=${formSubmitter}>
        <div class="absolute top-4 left-0 [&>*]:m-0 px-4">
          ${gecutIconButton({
            svg: SolarHelpLineDuotone,
            type: 'normal',
          })}
        </div>

        <div class="flex w-full items-center justify-center pb-4">
          <img src="/icon.png" class="h-32" />
        </div>

        ${gecutContext(signInStatesContext, (state) => stateManager(signInFormStates, state))}
      </form>

      <div class="flex flex-col items-center justify-end pb-8">
        <p class="text-outline text-bodySmall">پلتفرم شمــاره کــارت آنــلایــن، کارت بــوک</p>
      </div>
    </div>
  `;
}
