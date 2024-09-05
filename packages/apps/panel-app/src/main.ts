import {untilIdle} from '@gecut/utilities/wait/wait.js';

window.addEventListener('load', async () => {
  await import('unfonts.css');

  const {startApp} = await import('./ui/app-index.js');

  await untilIdle();

  startApp();
});
