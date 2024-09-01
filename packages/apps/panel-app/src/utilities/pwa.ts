import {untilIdle} from '@gecut/utilities/wait/wait.js';
import {registerSW} from 'virtual:pwa-register';

import {sbm} from './sbm.js';

export const pwa = () =>
  setTimeout(async () => {
    await untilIdle();

    registerSW({
      onNeedRefresh() {
        sbm.notify({
          message:
            // eslint-disable-next-line max-len
            'نسخه جدید اپلیکیشن آماده دانلود است! برای بهره‌مندی از ویژگی‌های جدید و بهبود عملکرد، اپلیکیشن را به‌روزرسانی کنید.',
          close: true,
        });
      },
      onOfflineReady() {
        sbm.notify({
          message:
            'نصب اپلیکیشن به پایان رسید. تمامی ویژگی‌های آن، حتی در حالت آفلاین، در دسترس شما هستند. از آن لذت ببرید!',
          close: true,
        });
      },
    });
  }, 1000);
