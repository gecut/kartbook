import {envvm} from '../../utilities/envvm.js';

import type {Plugin} from '@thepassle/app-tools/router.js';

const requireNotAuthenticated = (redirect: string): Plugin => ({
  name: 'requireNotAuthenticated',
  shouldNavigate: () => ({
    condition: () => {
      if (envvm.get('user-token').trim() !== '') return false;

      return true;
    },
    redirect,
  }),
});

export default requireNotAuthenticated;
