import {icon} from '@gecut/components';
import {html} from 'lit/html.js';

export const disabledCard = html`
  <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
    <span
      class="absolute inset-0 backdrop-blur-sm backdrop-brightness-90 flex flex-col justify-center
             items-center text-labelLarge text-onSurface [&>.gecut-icon]:text-[3rem] z-[10]"
    >
      ${icon({
        // eslint-disable-next-line max-len
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2.69 6.705a.75.75 0 0 0-1.38.59zm12.897 6.624l-.274-.698zm-6.546.409a.75.75 0 1 0-1.257-.818zm-2.67 1.353a.75.75 0 1 0 1.258.818zM22.69 7.295a.75.75 0 0 0-1.378-.59zM19 11.13l-.513-.547zm.97 2.03a.75.75 0 1 0 1.06-1.06zm-8.72 3.34a.75.75 0 0 0 1.5 0zm5.121-.591a.75.75 0 1 0 1.258-.818zm-10.84-4.25A.75.75 0 0 0 4.47 10.6zm-2.561.44a.75.75 0 0 0 1.06 1.06zM12 13.25c-3.224 0-5.539-1.605-7.075-3.26a13.637 13.637 0 0 1-1.702-2.28a11.707 11.707 0 0 1-.507-.946a3.903 3.903 0 0 1-.022-.049l-.004-.01l-.001-.001L2 7a76 76 0 0 0-.69.296h.001l.001.003l.003.006a3.837 3.837 0 0 0 .04.088a13.202 13.202 0 0 0 .58 1.084c.41.69 1.034 1.61 1.89 2.533C5.54 12.855 8.224 14.75 12 14.75zm3.313-.62c-.97.383-2.071.62-3.313.62v1.5c1.438 0 2.725-.276 3.862-.723zm-7.529.29l-1.413 2.17l1.258.818l1.412-2.171zM22 7l-.69-.296h.001v.002l-.007.013a8.017 8.017 0 0 1-.151.313a13.298 13.298 0 0 1-2.666 3.55l1.026 1.094a14.802 14.802 0 0 0 3.122-4.26l.039-.085l.01-.024l.004-.007v-.003h.001v-.001zm-3.513 3.582c-.86.806-1.913 1.552-3.174 2.049l.549 1.396c1.473-.58 2.685-1.444 3.651-2.351zm-.017 1.077l1.5 1.5l1.06-1.06l-1.5-1.5zM11.25 14v2.5h1.5V14zm3.709-.262l1.412 2.171l1.258-.818l-1.413-2.171zm-10.49-3.14l-1.5 1.5L4.03 13.16l1.5-1.5z"/></svg>',
      })}
      <span>کارت غیرفعال است</span>
    </span>
    <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
    <span
      class="absolute inset-0 opacity-5 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-100% z-[4]"
    ></span>
    <span
      class="absolute inset-0 opacity-15 bg-cover bg-gradient-to-bl from-primary from-0% to-transparent to-50% z-[4]"
    ></span>

    <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

    <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
      <div class="size-20 flex items-center justify-center">
        <img class="h-full w-full object-contain" src=${'/icon.png'} />
      </div>

      <div class="grow"></div>

      <div class="flex justify-between text-titleLarge text-[20px] text-onSurface cursor-pointer" dir="ltr">
        <span>0000</span>
        <span>0000</span>
        <span>0000</span>
        <span>0000</span>
      </div>

      <div class="flex justify-between items-center text-bodyMedium text-outline pt-1 mt-1" dir="ltr">
        <span class="opacity-85 cursor-pointer">IR000000000000000000000</span>

        <span class="[&>.gecut-icon]:text-[18px] [&>.gecut-icon]:text-outline cursor-pointer">
          ${icon({
            // eslint-disable-next-line max-len
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 11c0-2.828 0-4.243.879-5.121C7.757 5 9.172 5 12 5h3c2.828 0 4.243 0 5.121.879C21 6.757 21 8.172 21 11v5c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22h-3c-2.828 0-4.243 0-5.121-.879C6 20.243 6 18.828 6 16z"/><path d="M6 19a3 3 0 0 1-3-3v-6c0-3.771 0-5.657 1.172-6.828C5.343 2 7.229 2 11 2h4a3 3 0 0 1 3 3" opacity="0.5"/></g></svg>',
          })}
        </span>
      </div>

      <div class="grow"></div>

      <div class="text-bodyMedium text-outline opacity-85">کارت غیرفعال</div>
    </div>
  </div>
`;
