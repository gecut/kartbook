import {html} from 'lit/html.js';

export const skeletonCard = html`
  <div
    class="w-full h-56 bg-surfaceVariant rounded-2xl shadow-xl relative overflow-hidden animate-pulse *:animate-pulse"
  >
    <span class="absolute inset-0 opacity-20 bg-surfaceVariant z-[2]"></span>
    <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>

    <div class="absolute inset-0 z-[5] flex flex-col pt-3 pb-6 px-6">
      <div class="size-16 mb-3 mt-1 mx-2 rounded-xl bg-outline animate-pulse"></div>

      <div class="grow"></div>

      <div class="flex justify-between cursor-pointer" dir="ltr">
        <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
        <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
        <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
        <span class="h-5 w-12 rounded-md bg-onSurface animate-pulse"></span>
      </div>
      <div class="flex justify-start cursor-pointer mt-4" dir="ltr">
        <span class="h-3 w-52 rounded-md bg-outline animate-pulse"></span>
      </div>

      <div class="grow"></div>

      <div class="h-4 w-32 rounded-md bg-outline opacity-85 animate-pulse"></div>
    </div>
  </div>
`;
