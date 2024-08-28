import {isAuthenticated} from '../../../utilities/is-authenticated.js';

import type {Plugin} from '@thepassle/app-tools/router.js';

const requireAuthenticated = (redirect: string): Plugin => ({
  name: 'requireAuthenticated',
  shouldNavigate: () =>
    ({
      condition: async () => {
        return isAuthenticated();
      },
      redirect,
    }) as any,
});

export default requireAuthenticated;
