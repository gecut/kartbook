import {icon} from '@gecut/components';
import {html} from 'lit/html.js';

export const errorCard = html`
  <div class="w-full h-56 bg-surface rounded-2xl shadow-2xl relative overflow-hidden">
    <span class="absolute inset-0 bg-error z-[2]"></span>
    <span class="absolute inset-0 opacity-20 bg-cover bg-[url('/card-bg.webp')] z-[3]"></span>
    <span
      class="absolute inset-0 opacity-40 bg-cover bg-gradient-to-bl from-onError from-0% to-transparent to-70% z-[4]"
    ></span>

    <div
      class="absolute inset-0 z-[5] flex flex-col pt-3 gap-6 pb-6 px-6 justify-center
             items-center [&>.gecut-icon]:text-[4rem] text-onError"
    >
      ${icon({
        // eslint-disable-next-line max-len
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M5.312 10.762C8.23 5.587 9.689 3 12 3c2.31 0 3.77 2.587 6.688 7.762l.364.644c2.425 4.3 3.638 6.45 2.542 8.022S17.786 21 12.364 21h-.728c-5.422 0-8.134 0-9.23-1.572s.117-3.722 2.542-8.022zM12 7.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2" clip-rule="evenodd"/></svg>',
      })}

      <span>مشکلی در دریافت کارت به وجود آمده</span>
    </div>
  </div>
`;
