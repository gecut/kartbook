import {isAuthenticated} from '../../../utilities/is-authenticated.js';

import type {Plugin} from '@thepassle/app-tools/router.js';

const requireNotAuthenticated = (redirect: string): Plugin => ({
  name: 'requireNotAuthenticated',
  shouldNavigate: () => ({
    condition: () => {
      return !isAuthenticated();
    },
    redirect,
  }),
});

export default requireNotAuthenticated;
