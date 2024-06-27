import {envvm} from '../../utilities/envvm.js';

import type {Plugin} from '@thepassle/app-tools/router.js';

const requireNotAuthenticated = (redirect: string): Plugin => ({
  name: 'requireNotAuthenticated',
  shouldNavigate: () => ({
    condition: () => {
      console.log('fuck', envvm.get('user-token'));

      if (envvm.get('user-token').trim().length > 0) return false;

      return true;
    },
    redirect,
  }),
});

export default requireNotAuthenticated;
