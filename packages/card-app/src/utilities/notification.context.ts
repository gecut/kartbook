import {icon} from '@gecut/components';
import {ContextSignal} from '@gecut/signal';
import {untilEvent, untilNextFrame} from '@gecut/utilities/wait/wait.js';
import {choose} from 'lit/directives/choose.js';
import {html, nothing} from 'lit/html.js';

export type Notification = {
  type: 'error' | 'warning' | 'success';
  msg: string;
};

const successIcon =
  // eslint-disable-next-line max-len
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity="0.5"/><path fill="currentColor" d="M16.03 8.97a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47l2.235-2.235L14.97 8.97a.75.75 0 0 1 1.06 0"/></svg>';
const warningIcon =
  // eslint-disable-next-line max-len
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-2.31 0-3.77 2.587-6.688 7.762l-.364.644c-2.425 4.3-3.638 6.45-2.542 8.022S6.214 21 11.636 21h.728c5.422 0 8.134 0 9.23-1.572s-.117-3.722-2.542-8.022l-.364-.645C15.77 5.587 14.311 3 12 3" opacity="0.5"/><path fill="currentColor" d="M12 7.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75M12 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/></svg>';
const errorIcon =
  // eslint-disable-next-line max-len
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity="0.5"/><path fill="currentColor" d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"/></svg>';

export const notificationContext = new ContextSignal<Notification | null>('notification');

export const removeNotification = async (target: HTMLElement) => {
  target.classList.remove('animate-fadeInSlide');
  target.classList.add('animate-fadeOutSlide');
  await untilEvent(target, 'animationend');
  target.remove();
};
export const notificationRenderer = (content: Notification | null) => {
  if (content)
    return html`
      <div
        id="notification"
        class="gecut-card-filled shadow-xl cursor-pointer flex p-3 gap-3 justify-between text-onSurfaceVariant text-bodyMedium w-full
               min-w-32 animate-fadeInSlide"
        @click=${(event: PointerEvent) => {
          const target = (event.currentTarget || event.target) as HTMLElement | null;

          if (target) {
            removeNotification(target);
          }
        }}
      >
        <span>${content.msg}</span>

        ${choose(content.type, [
          ['error', () => html` <span class="text-error [&>.gecut-icon]:text-2xl">${icon({svg: errorIcon})}</span> `],
          [
            'warning',
            () => html` <span class="text-tertiary [&>.gecut-icon]:text-2xl">${icon({svg: warningIcon})}</span> `,
          ],
          [
            'success',
            () => html` <span class="text-primary [&>.gecut-icon]:text-2xl">${icon({svg: successIcon})}</span> `,
          ],
        ])}
      </div>
    `;

  return nothing;
};
export const pushNotification = async (content: Notification) => {
  const target = document.getElementById('notification');

  if (target) {
    await removeNotification(target);
  }

  notificationContext.setValue(null);

  await untilNextFrame();

  notificationContext.setValue(content);
};
